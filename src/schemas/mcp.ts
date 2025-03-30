import { z } from 'zod';

// Base MCP Request Schema
export const McpRequestSchema = z.object({
  version: z.string().optional().default('1.0'), // Version of the protocol
  protocol: z.literal('mcp'),                // Protocol identifier
  context_id: z.string().uuid().optional(),      // Optional unique ID for the conversation context
  action_name: z.string(),                   // Name of the action to perform
  parameters: z.record(z.unknown()).optional(), // Action-specific parameters (will be validated further)
});

// Schema for parameters of the 'listMenu' action
export const ListMenuParamsSchema = z.object({
  // No parameters expected for listing the menu in this simple example
});

// Schema for parameters of the 'placeOrder' action
export const PlaceOrderParamsSchema = z.object({
  itemName: z.string().min(1, 'Item name cannot be empty'),
  quantity: z.number().int().positive('Quantity must be a positive integer'),
});

// Type definition for a valid MCP request based on the schema
export type McpRequest = z.infer<typeof McpRequestSchema>;

// Type definitions for action parameters
export type ListMenuParams = z.infer<typeof ListMenuParamsSchema>;
export type PlaceOrderParams = z.infer<typeof PlaceOrderParamsSchema>; 