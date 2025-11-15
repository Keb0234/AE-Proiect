import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  totalPrice: 0,
  totalQuantity: 0,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action) {
      const product = action.payload
      const existing = state.items.find(p => p.id === product.id)

      if (existing) {
        existing.quantity++
      } else {
        state.items.push({ ...product, quantity: 1 })
      }

      state.totalQuantity++
      state.totalPrice += product.price
    },

    increaseQuantity(state, action) {
      const item = state.items.find(p => p.id === action.payload)
      if (item) {
        item.quantity++
        state.totalQuantity++
        state.totalPrice += item.price
      }
    },

    decreaseQuantity(state, action) {
      const item = state.items.find(p => p.id === action.payload)
      if (item && item.quantity > 1) {
        item.quantity--
        state.totalQuantity--
        state.totalPrice -= item.price
      }
    },

    removeFromCart(state, action) {
      const id = action.payload
      const item = state.items.find(p => p.id === id)

      state.totalQuantity -= item.quantity
      state.totalPrice -= item.price * item.quantity
      state.items = state.items.filter(p => p.id !== id)
    },

    clearCart(state) {
      state.items = []
      state.totalPrice = 0
      state.totalQuantity = 0
    }
  },
})

export const {addToCart,increaseQuantity,decreaseQuantity,removeFromCart,clearCart} = cartSlice.actions

export default cartSlice.reducer
