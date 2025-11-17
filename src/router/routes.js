import IndexPage from 'pages/IndexPage.vue'
import ProductPage from 'pages/ProductPage.vue'
import CreateAd from 'pages/CreateAd.vue'
import StatsPage from 'pages/StatsPage.vue'
import CartPage from 'pages/CartPage.vue' // ← Añadir esta importación

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: IndexPage },
      { path: 'product/:id', component: ProductPage, props: true },
      { path: 'create', component: CreateAd },
      { path: 'stats', component: StatsPage },
      { path: 'cart', component: CartPage } // ← Añadir esta ruta
    ],
  },

  // fallback
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
