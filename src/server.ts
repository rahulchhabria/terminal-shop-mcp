import express, { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { McpRequestSchema, ListMenuParamsSchema, PlaceOrderParamsSchema, ListMenuParams, PlaceOrderParams } from './schemas/mcp';
import { getMenuItems, submitOrder } from './mocks/terminalShopApi';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // Parse JSON bodies

// --- MCP Root Endpoint --- (/mcp)
// Provides information about the available actions
app.post('/mcp', (req: Request, res: Response) => {
    // In a full MCP implementation, this endpoint might require specific validation
    // For now, we'll return a list of available actions
    res.json({
        protocol: 'mcp',
        version: '1.0',
        available_actions: [
            {
                name: 'listMenu',
                description: 'Lists the available coffee items on the menu.',
                parameters_schema: ListMenuParamsSchema.shape, // Describe expected params
                endpoint: '/mcp/actions/listMenu'
            },
            {
                name: 'placeOrder',
                description: 'Places an order for a specific coffee item.',
                parameters_schema: PlaceOrderParamsSchema.shape, // Describe expected params
                endpoint: '/mcp/actions/placeOrder'
            }
        ]
    });
});

// --- MCP Action Endpoints --- (/mcp/actions/{actionName})

// Middleware for validating the base MCP request structure for action routes
const validateMcpRequest = (req: Request, res: Response, next: NextFunction) => {
    try {
        McpRequestSchema.parse(req.body);
        next(); // Proceed if validation passes
    } catch (error) {
        if (error instanceof ZodError) {
            res.status(400).json({ error: 'Invalid MCP Request', details: error.errors });
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

// Action: listMenu
app.post('/mcp/actions/listMenu', validateMcpRequest, async (req: Request, res: Response) => {
    try {
        // Validate specific parameters for listMenu (none expected here)
        const params: ListMenuParams = ListMenuParamsSchema.parse(req.body.parameters || {});

        console.log('[Server] Received listMenu request');
        const menu = await getMenuItems();
        res.json({ success: true, data: menu });

    } catch (error) {
        if (error instanceof ZodError) {
            res.status(400).json({ error: 'Invalid Parameters for listMenu', details: error.errors });
        } else {
            console.error('[Server] Error processing listMenu:', error);
            res.status(500).json({ error: 'Failed to retrieve menu' });
        }
    }
});

// Action: placeOrder
app.post('/mcp/actions/placeOrder', validateMcpRequest, async (req: Request, res: Response) => {
    try {
        // Validate specific parameters for placeOrder
        const params: PlaceOrderParams = PlaceOrderParamsSchema.parse(req.body.parameters || {});

        console.log(`[Server] Received placeOrder request for ${params.quantity}x ${params.itemName}`);
        const result = await submitOrder(params.itemName, params.quantity);

        if (result.success) {
            res.json({ success: true, message: result.message, orderId: result.orderId });
        } else {
            // Use 404 if the item wasn't found, otherwise 400 might be suitable for other order failures
            res.status(404).json({ success: false, error: result.message });
        }

    } catch (error) {
        if (error instanceof ZodError) {
            res.status(400).json({ error: 'Invalid Parameters for placeOrder', details: error.errors });
        } else {
            console.error('[Server] Error processing placeOrder:', error);
            res.status(500).json({ error: 'Failed to place order' });
        }
    }
});

// Basic Error Handler (Optional, but good practice)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start Server
app.listen(port, () => {
    console.log(`MCP Server listening at http://localhost:${port}`);
    console.log(`Root MCP endpoint: POST http://localhost:${port}/mcp`);
    console.log(`Actions available at: POST http://localhost:${port}/mcp/actions/{actionName}`);
}); 