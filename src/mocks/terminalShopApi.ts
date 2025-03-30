// Mock data for the coffee menu
const mockMenu = [
  { id: '1', name: 'Espresso', price: 2.50 },
  { id: '2', name: 'Latte', price: 3.50 },
  { id: '3', name: 'Cappuccino', price: 3.50 },
  { id: '4', name: 'Americano', price: 3.00 },
  { id: '5', name: 'Mocha', price: 4.00 },
];

// Mock function to get the menu items
export const getMenuItems = async (): Promise<typeof mockMenu> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));
  console.log('[Mock API] Fetching menu items...');
  return mockMenu;
};

// Mock function to submit an order
export const submitOrder = async (itemName: string, quantity: number): Promise<{ success: boolean; message: string; orderId?: string }> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 200));
  console.log(`[Mock API] Attempting to order ${quantity}x ${itemName}...`);

  const itemExists = mockMenu.some(item => item.name.toLowerCase() === itemName.toLowerCase());

  if (itemExists) {
    const orderId = `order_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    console.log(`[Mock API] Order placed successfully! Order ID: ${orderId}`);
    return {
      success: true,
      message: `Successfully ordered ${quantity}x ${itemName}.`,
      orderId: orderId,
    };
  } else {
    console.error(`[Mock API] Order failed: Item '${itemName}' not found on the menu.`);
    return {
      success: false,
      message: `Sorry, '${itemName}' is not available on the menu.`,
    };
  }
}; 