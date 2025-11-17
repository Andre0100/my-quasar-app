import { defineStore } from 'pinia'

// Datos hardcodeados directamente en el store
const sampleData = [
  {
    id: 1,
    title: 'Samsung Galaxy J6, Pantalla de 5.5"',
    price: 132.0,
    rom: '64GB',
    ram: '2GB',
    brand: 'Samsung',
    system: 'Android',
    screen: '5.5',
    condition: 'Nuevo',
    color: 'Negro',
    img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
    description: 'Samsung J6 con 64GB de almacenamiento, 2GB RAM. Color negro. Incluye todos los accesorios originales.',
    seller: 'TecnoStore',
    phone: '2234-5678',
    location: 'San Salvador',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    title: 'iPhone 6 Plus 64GB, Pantalla 5.5"',
    price: 235.0,
    rom: '64GB',
    ram: '2GB',
    brand: 'iPhone',
    system: 'iOS',
    screen: '5.5',
    condition: 'Usado',
    color: 'Plateado',
    seller: 'Juan Perez',
    phone: '7374-2312',
    img: 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=400&h=300&fit=crop',
    description: `Teléfono en muy buenas condiciones, tiene dos cámaras, la caja está abierta pero con muy poco uso. Viene con su caja original y todos sus accesorios. Funciona solo con chip Tigo.`,
    location: 'Santa Tecla',
    createdAt: '2024-01-14T15:20:00Z'
  },
  {
    id: 3,
    title: 'Huawei P30 Lite 128GB Dual SIM',
    price: 189.0,
    rom: '128GB',
    ram: '4GB',
    brand: 'Huawei',
    system: 'Android',
    screen: '6.15',
    condition: 'Nuevo',
    color: 'Azul',
    img: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=300&fit=crop',
    description: 'Huawei P30 Lite nuevo en caja sellada. 128GB almacenamiento, 4GB RAM. Cámara triple de 48MP.',
    seller: 'MobileShop',
    phone: '2278-9012',
    location: 'San Miguel',
    createdAt: '2024-01-13T09:15:00Z'
  },
  {
    id: 4,
    title: 'Xiaomi Redmi Note 10 64GB',
    price: 156.0,
    rom: '64GB',
    ram: '4GB',
    brand: 'Xiaomi',
    system: 'Android',
    screen: '6.43',
    condition: 'Nuevo',
    color: 'Blanco',
    img: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=300&fit=crop',
    description: 'Xiaomi Redmi Note 10 con pantalla AMOLED de 6.43". Batería de 5000mAh. Cámara cuádruple.',
    seller: 'TecnoMundo',
    phone: '2345-6789',
    location: 'Soyapango',
    createdAt: '2024-01-12T14:45:00Z'
  },
  {
    id: 5,
    title: 'Nokia 5.3 64GB Triple Cámara',
    price: 145.0,
    rom: '64GB',
    ram: '4GB',
    brand: 'Nokia',
    system: 'Android',
    screen: '6.55',
    condition: 'Usado',
    color: 'Azul',
    img: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=400&h=300&fit=crop',
    description: 'Nokia 5.3 en excelente estado. Pantalla de 6.55". Cuádruple cámara. Batería de 2 días.',
    seller: 'Carlos Rodriguez',
    phone: '7123-4567',
    location: 'Mejicanos',
    createdAt: '2024-01-11T11:20:00Z'
  },
  {
    id: 6,
    title: 'Samsung Galaxy A32 128GB',
    price: 210.0,
    rom: '128GB',
    ram: '6GB',
    brand: 'Samsung',
    system: 'Android',
    screen: '6.4',
    condition: 'Nuevo',
    color: 'Violeta',
    img: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=300&fit=crop',
    description: 'Samsung Galaxy A32 nuevo. 128GB almacenamiento, 6GB RAM. Pantalla Super AMOLED.',
    seller: 'ElectroCenter',
    phone: '2256-7890',
    location: 'Antiguo Cuscatlán',
    createdAt: '2024-01-10T16:30:00Z'
  }
]

export const useProductsStore = defineStore('products', {
  state: () => ({
    items: sampleData,
  }),
  getters: {
    brands: (state) => [...new Set(state.items.map((p) => p.brand))].filter(Boolean),
    systems: (state) => [...new Set(state.items.map((p) => p.system))].filter(Boolean),
    screens: (state) => [...new Set(state.items.map((p) => p.screen))].filter(Boolean).sort(),
    maxPrice: (state) => Math.max(...state.items.map((p) => p.price || 0), 0),
  },
  actions: {
    addProduct(product) {
      const newId = Math.max(...this.items.map((p) => p.id), 0) + 1
      this.items.push({
        ...product,
        id: newId,
        createdAt: new Date().toISOString()
      })
    },
    getById(id) {
      return this.items.find((p) => p.id == id)
    },
    searchProducts(query) {
      if (!query) return this.items
      const q = query.toLowerCase()
      return this.items.filter(p =>
        (p.title || '').toLowerCase().includes(q) ||
        (p.brand || '').toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q)
      )
    }
  },
})
