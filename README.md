# Terminal Shop MCP Server

This project implements a basic Model Context Protocol (MCP) server in TypeScript using Express. It simulates interactions with a hypothetical `terminal.shop` coffee ordering system, allowing an LLM (or any MCP client) to list the menu and place coffee orders.

## Features

*   **MCP Compliant (Basic):** Implements core MCP concepts with a root endpoint (`/mcp`) and specific action endpoints (`/mcp/actions/{actionName}`).
*   **Action Handling:** Supports `listMenu` and `placeOrder` actions.
*   **Schema Validation:** Uses Zod for validating incoming MCP requests and action parameters.
*   **Mock API:** Simulates interactions with `terminal.shop` (fetching menu, placing orders).
*   **TypeScript:** Built with TypeScript for type safety.
*   **Express Server:** Uses Express for handling HTTP requests.

## Project Structure

```
.
├── dist/                 # Compiled JavaScript output
├── node_modules/         # Project dependencies
├── src/
│   ├── mocks/
│   │   └── terminalShopApi.ts # Mock API functions
│   ├── schemas/
│   │   └── mcp.ts             # Zod schemas for MCP requests/actions
│   └── server.ts           # Main Express server logic
├── package.json
├── package-lock.json
├── README.md             # This file
└── tsconfig.json         # TypeScript configuration
```

## Prerequisites

*   Node.js (v16 or later recommended)
*   npm (usually comes with Node.js)

## Installation

1.  Clone the repository (if applicable).
2.  Navigate to the project directory:
    ```bash
    cd path/to/terminal-shop-mcp
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```

## Running the Server

### Development Mode (with auto-reload)

This command uses `nodemon` to watch for file changes in the `src` directory and automatically restarts the server.

```bash
npm run dev
```

The server will typically start on `http://localhost:3000`.

### Production Mode

1.  **Build the project (compile TypeScript to JavaScript):**
    ```bash
    npm run build
    ```
    This will create the `dist` directory with the compiled code.

2.  **Start the server:**
    ```bash
    npm start
    ```
    This runs the compiled code using Node.js.

## API Endpoints

*   **`POST /mcp`**: Root MCP endpoint. Returns information about the available actions.
    *   **Request Body:** (Optional, depends on implementation detail, none required here)
    *   **Success Response (200 OK):**
        ```json
        {
          "protocol": "mcp",
          "version": "1.0",
          "available_actions": [
            { "name": "listMenu", ... },
            { "name": "placeOrder", ... }
          ]
        }
        ```

*   **`POST /mcp/actions/listMenu`**: Action endpoint to list menu items.
    *   **Request Body (Example):**
        ```json
        {
          "version": "1.0",
          "protocol": "mcp",
          "action_name": "listMenu",
          "parameters": {}
        }
        ```
    *   **Success Response (200 OK):**
        ```json
        {
          "success": true,
          "data": [
            { "id": "1", "name": "Espresso", "price": 2.50 },
            ...
          ]
        }
        ```
    *   **Error Response (400 Bad Request):** Invalid parameters.
    *   **Error Response (500 Internal Server Error):** Server error.

*   **`POST /mcp/actions/placeOrder`**: Action endpoint to place an order.
    *   **Request Body (Example):**
        ```json
        {
          "version": "1.0",
          "protocol": "mcp",
          "action_name": "placeOrder",
          "parameters": {
            "itemName": "Latte",
            "quantity": 1
          }
        }
        ```
    *   **Success Response (200 OK):**
        ```json
        {
          "success": true,
          "message": "Successfully ordered 1x Latte.",
          "orderId": "order_..."
        }
        ```
    *   **Error Response (404 Not Found):** Item not found on the menu.
    *   **Error Response (400 Bad Request):** Invalid parameters (e.g., missing `itemName`, non-positive `quantity`).
    *   **Error Response (500 Internal Server Error):** Server error during order processing.

## How to Interact (Example using curl)

1.  **List Menu:**
    ```bash
    curl -X POST -H "Content-Type: application/json" -d '{ "protocol": "mcp", "action_name": "listMenu" }' http://localhost:3000/mcp/actions/listMenu
    ```

2.  **Place Order:**
    ```bash
    curl -X POST -H "Content-Type: application/json" -d '{ "protocol": "mcp", "action_name": "placeOrder", "parameters": { "itemName": "Espresso", "quantity": 2 } }' http://localhost:3000/mcp/actions/placeOrder
    ```

3.  **Place Order (Item not found):**
    ```bash
    curl -X POST -H "Content-Type: application/json" -d '{ "protocol": "mcp", "action_name": "placeOrder", "parameters": { "itemName": "Tea", "quantity": 1 } }' http://localhost:3000/mcp/actions/placeOrder
    ``` 