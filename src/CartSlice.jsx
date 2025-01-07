import { createSlice } from '@reduxjs/toolkit';

export const CartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [], // Array of cart items
    totalCost: 0, // Total cost of items in the cart
  },
  reducers: {
    // Add an item to the cart
    addItem: (state, action) => {
      const { name, image, cost } = action.payload;

      const itemCost = parseFloat(cost.replace('$', '')); // Convert cost to number
      const existingItem = state.items.find(item => item.name === name);

      if (existingItem) {
        existingItem.quantity++;
      } else {
        state.items.push({ name, image, cost, quantity: 1 });
      }

      // Update total cost
      state.totalCost += itemCost;
    },

    // Remove an item from the cart
    removeItem: (state, action) => {
      const itemToRemove = state.items.find(item => item.name === action.payload);

      if (itemToRemove) {
        state.totalCost -= itemToRemove.quantity * parseFloat(itemToRemove.cost.replace('$', ''));
        state.items = state.items.filter(item => item.name !== action.payload);
      }
    },

    // Update the quantity of an item in the cart
    updateQuantity: (state, action) => {
      const { name, quantity } = action.payload;

      const itemToUpdate = state.items.find(item => item.name === name);

      if (itemToUpdate) {
        const currentCost = itemToUpdate.quantity * parseFloat(itemToUpdate.cost.replace('$', ''));
        const updatedCost = quantity * parseFloat(itemToUpdate.cost.replace('$', ''));

        // Update total cost
        state.totalCost += updatedCost - currentCost;
        itemToUpdate.quantity = quantity;
      }
    },

    // Clear the cart
    clearCart: (state) => {
      state.items = [];
      state.totalCost = 0;
    },
  },
});

// Selector to calculate total quantity of items in the cart
export const selectTotalQuantity = (state) => {
  return state.cart.items.reduce((total, item) => total + item.quantity, 0);
};

export const { addItem, removeItem, updateQuantity, clearCart } = CartSlice.actions;
export default CartSlice.reducer;