import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    shipping: 5.00
  }),

  getters: {
    count: (state) => state.items.reduce((total, item) => total + item.quantity, 0),
    total: (state) => state.items.reduce((acc, item) => acc + (item.price || 0) * item.quantity, 0),
    totalWithShipping: (state) => {
      const subtotal = state.items.reduce((acc, item) => acc + (item.price || 0) * item.quantity, 0)
      return subtotal + (subtotal > 0 ? state.shipping : 0)
    },
    itemCount: (state) => state.items.length,
    isEmpty: (state) => state.items.length === 0
  },

  actions: {
    add(product) {
      // Verificar si el producto ya está en el carrito
      const existingItem = this.items.find(item => item.id === product.id)

      if (existingItem) {
        // Si ya existe, aumentar la cantidad
        existingItem.quantity += 1
      } else {
        // Si no existe, agregarlo
        this.items.push({
          ...product,
          cartId: Date.now() + Math.random(), // Esto genera el cartId único
          addedAt: new Date().toISOString(),
          quantity: 1
        })
      }

      this.persistCart()
    },

    remove(cartId) {
      console.log('🔄 Intentando eliminar producto con cartId:', cartId)
      console.log('📦 Productos antes de eliminar:', this.items)

      const index = this.items.findIndex(item => item.cartId === cartId)
      console.log('🔍 Índice encontrado:', index)

      if (index > -1) {
        this.items.splice(index, 1)
        this.persistCart()
        console.log('✅ Producto eliminado. Productos después:', this.items)
        return true
      }

      console.log('❌ No se encontró el producto para eliminar')
      return false
    },

    updateQuantity(cartId, quantity) {
      const item = this.items.find(item => item.cartId === cartId)
      if (item && quantity > 0) {
        item.quantity = quantity
        this.persistCart()
      }
    },

    clear() {
      this.items = []
      this.persistCart()
    },

    persistCart() {
      if (typeof window !== 'undefined') {
        localStorage.setItem('cellphone-cart', JSON.stringify(this.items))
      }
    },

    loadCart() {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('cellphone-cart')
        if (saved) {
          this.items = JSON.parse(saved)
        }
      }
    }
  }
})
