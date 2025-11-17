<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat round dense icon="menu" class="q-mr-sm" @click="toggleLeftDrawer" />

        <q-toolbar-title class="row items-center no-wrap">
          <q-icon name="smartphone" size="28px" class="q-mr-sm" />
          <div>
            <div class="text-h6">Tienda CellPhone</div>
            <div class="text-caption">ventascelulares</div>
          </div>
        </q-toolbar-title>

        <q-space />

        <!-- Search Bar -->
        <div class="search-container">
          <q-input
            rounded
            dense
            v-model="searchQuery"
            placeholder="Buscar teléfonos..."
            class="search-input"
            bg-color="white"
            @keyup.enter="doSearch"
          >
            <template v-slot:append>
              <q-btn flat round dense icon="search" @click="doSearch" />
            </template>
          </q-input>
        </div>

        <q-space />

        <!-- Navigation Buttons -->
        <div class="row items-center q-gutter-sm">
          <q-btn flat round dense icon="home" to="/">
            <q-tooltip>Inicio</q-tooltip>
          </q-btn>

          <q-btn flat round dense icon="analytics" to="/stats">
            <q-tooltip>Estadísticas</q-tooltip>
          </q-btn>

          <q-btn flat round dense icon="add" to="/create" color="positive">
            <q-tooltip>Nuevo Anuncio</q-tooltip>
          </q-btn>

          <q-btn flat round dense icon="shopping_cart" @click="openCart" class="relative-position">
            <q-badge v-if="cartCount > 0" color="red" floating rounded>{{ cartCount }}</q-badge>
            <q-tooltip>Carrito</q-tooltip>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" side="left" bordered>
      <q-scroll-area class="fit">
        <q-list padding>
          <q-item-label header>Filtros Rápidos</q-item-label>

          <q-item clickable v-ripple to="/" exact>
            <q-item-section avatar>
              <q-icon name="home" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Inicio</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/stats">
            <q-item-section avatar>
              <q-icon name="analytics" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Estadísticas</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/create">
            <q-item-section avatar>
              <q-icon name="add" color="positive" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Nuevo Anuncio</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="q-my-md" />

          <q-item-label header>Marcas Populares</q-item-label>

          <q-item v-for="brand in quickBrands" :key="brand" clickable v-ripple>
            <q-item-section>
              <q-item-label>{{ brand }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-badge color="primary">{{ getBrandCount(brand) }}</q-badge>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title class="text-center">
          <div>© 2024 Tienda CellPhone - Todos los derechos reservados</div>
          <div class="text-caption">La mejor selección de teléfonos móviles</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCartStore } from 'stores/cart'
import { useProductsStore } from 'stores/products'

const router = useRouter()
const route = useRoute()
const cart = useCartStore()
const productsStore = useProductsStore()

const leftDrawerOpen = ref(false)
const searchQuery = ref('')

const cartCount = computed(() => cart.count)
const quickBrands = computed(() => productsStore.brands.slice(0, 5))

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function doSearch() {
  router.push({
    path: '/',
    query: searchQuery.value ? { q: searchQuery.value } : {}
  })
}

function openCart() {
  router.push('/cart')
}

function getBrandCount(brand) {
  return productsStore.items.filter(p => p.brand === brand).length
}

// Inicializar search query desde URL
onMounted(() => {
  if (route.query.q) {
    searchQuery.value = route.query.q
  }
})
</script>

<style scoped>
.search-container {
  max-width: 400px;
  width: 100%;
}

.search-input {
  min-width: 300px;
}

@media (max-width: 600px) {
  .search-input {
    min-width: 200px;
  }
}
</style>
