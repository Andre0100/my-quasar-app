<template>
  <q-page class="q-pa-md">
    <!-- Hero Section -->
    <div class="hero-section q-mb-lg">
      <q-card class="bg-primary text-white">
        <q-card-section class="text-center">
          <div class="text-h4 q-mb-sm">Encuentra tu teléfono perfecto</div>
          <div class="text-h6">Las mejores marcas al mejor precio</div>
        </q-card-section>
      </q-card>
    </div>

    <div class="row">
      <!-- Filters Sidebar -->
      <div class="col-12 col-md-3 q-pr-md">
        <q-card class="sticky-filters">
          <q-card-section>
            <div class="text-h6">Filtros</div>
          </q-card-section>

          <q-separator />

          <q-card-section>
            <div class="text-subtitle2 q-mb-sm">Condición</div>
            <q-option-group
              v-model="filter.condition"
              :options="conditionOptions"
              color="primary"
              inline
            />
          </q-card-section>

          <q-separator />

          <q-card-section>
            <div class="text-subtitle2 q-mb-sm">Marca</div>
            <q-option-group
              v-model="filter.brand"
              :options="brandOptions"
              type="checkbox"
              color="primary"
            />
          </q-card-section>

          <q-separator />

          <q-card-section>
            <div class="text-subtitle2 q-mb-sm">Sistema Operativo</div>
            <q-option-group
              v-model="filter.system"
              :options="systemOptions"
              type="checkbox"
              color="primary"
            />
          </q-card-section>

          <q-separator />

          <q-card-section>
            <div class="text-subtitle2 q-mb-sm">Tamaño de Pantalla</div>
            <q-option-group
              v-model="filter.screen"
              :options="screenOptions"
              type="checkbox"
              color="primary"
            />
          </q-card-section>

          <q-separator />

          <q-card-section>
            <div class="text-subtitle2 q-mb-sm">
              Precio: ${{ priceRange[0] }} - ${{ priceRange[1] }}
            </div>
            <q-range
              v-model="priceRange"
              :min="0"
              :max="maxPrice"
              :step="10"
              color="primary"
              label-always
            />
          </q-card-section>

          <q-card-actions vertical>
            <q-btn color="primary" label="Aplicar Filtros" @click="applyFilters" class="q-mb-sm" />
            <q-btn flat color="grey" label="Limpiar Filtros" @click="resetFilters" />
          </q-card-actions>
        </q-card>
      </div>

      <!-- Products Grid -->
      <div class="col-12 col-md-9">
        <!-- Results Header -->
        <div class="row items-center q-mb-md">
          <div class="col">
            <div class="text-h5">
              {{ filtered.length }} producto(s) encontrado(s)
              <span v-if="searchQuery" class="text-caption">para "{{ searchQuery }}"</span>
            </div>
          </div>
          <div class="col-auto row items-center q-gutter-md">
            <div class="text-caption">Ordenar por:</div>
            <q-select
              v-model="sortBy"
              :options="sortOptions"
              dense
              outlined
              style="min-width: 160px"
            />
            <div class="text-caption">Mostrar:</div>
            <q-select
              v-model="perPage"
              :options="perPageOptions"
              dense
              outlined
              style="min-width: 100px"
            />
          </div>
        </div>

        <!-- Products Grid -->
        <div v-if="paged.length > 0" class="row q-col-gutter-md">
          <div v-for="product in paged" :key="product.id" class="col-12 col-sm-6 col-lg-4">
            <product-card :product="product" />
          </div>
        </div>

        <!-- No Results -->
        <div v-else class="text-center q-pa-xl">
          <q-icon name="search_off" size="64px" color="grey" class="q-mb-md" />
          <div class="text-h6 text-grey">No se encontraron productos</div>
          <div class="text-caption text-grey q-mt-sm">
            Intenta ajustar tus filtros o términos de búsqueda
          </div>
          <q-btn color="primary" label="Limpiar Filtros" @click="resetFilters" class="q-mt-md" />
        </div>

        <!-- Pagination -->
        <div v-if="pageCount > 1" class="row justify-center q-mt-xl">
          <q-pagination
            v-model="page"
            :max="pageCount"
            :max-pages="6"
            direction-links
            boundary-links
            color="primary"
            active-color="secondary"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProductsStore } from 'stores/products'
import ProductCard from 'components/ProductCard.vue'

const route = useRoute()
const store = useProductsStore()

// Estado de la UI
const filter = ref({
  condition: 'all',
  brand: [],
  system: [],
  screen: [],
})
const priceRange = ref([0, store.maxPrice || 500])
const sortBy = ref('price-asc')
const page = ref(1)
const perPage = ref(12)
const searchQuery = ref('')

// Opciones
const conditionOptions = [
  { label: 'Todos', value: 'all' },
  { label: 'Nuevo', value: 'Nuevo' },
  { label: 'Usado', value: 'Usado' },
]

const sortOptions = [
  { label: 'Precio: Menor a Mayor', value: 'price-asc' },
  { label: 'Precio: Mayor a Menor', value: 'price-desc' },
  { label: 'Más Recientes', value: 'date-desc' },
  { label: 'Nombre A-Z', value: 'name-asc' },
]

const perPageOptions = [12, 24, 36, 48]

const brandOptions = computed(() =>
  store.brands.map((brand) => ({
    label: `${brand} (${store.items.filter((p) => p.brand === brand).length})`,
    value: brand,
  })),
)

const systemOptions = computed(() =>
  store.systems.map((system) => ({
    label: `${system} (${store.items.filter((p) => p.system === system).length})`,
    value: system,
  })),
)

const screenOptions = computed(() =>
  store.screens.map((screen) => ({
    label: `${screen}"`,
    value: screen,
  })),
)

const maxPrice = computed(() => store.maxPrice || 500)

// Computed
const filtered = computed(() => {
  let results = store.items

  // Búsqueda por texto
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    results = results.filter(
      (p) =>
        (p.title || '').toLowerCase().includes(q) ||
        (p.brand || '').toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q),
    )
  }

  // Filtros
  if (filter.value.condition !== 'all') {
    results = results.filter((p) => p.condition === filter.value.condition)
  }

  if (filter.value.brand.length > 0) {
    results = results.filter((p) => filter.value.brand.includes(p.brand))
  }

  if (filter.value.system.length > 0) {
    results = results.filter((p) => filter.value.system.includes(p.system))
  }

  if (filter.value.screen.length > 0) {
    results = results.filter((p) => filter.value.screen.includes(p.screen))
  }

  // Filtro de precio
  results = results.filter((p) => p.price >= priceRange.value[0] && p.price <= priceRange.value[1])

  // Ordenamiento
  if (sortBy.value === 'price-asc') {
    results.sort((a, b) => a.price - b.price)
  } else if (sortBy.value === 'price-desc') {
    results.sort((a, b) => b.price - a.price)
  } else if (sortBy.value === 'date-desc') {
    results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  } else if (sortBy.value === 'name-asc') {
    results.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
  }

  return results
})

const pageCount = computed(() => Math.max(1, Math.ceil(filtered.value.length / perPage.value)))

const paged = computed(() => {
  const start = (page.value - 1) * perPage.value
  return filtered.value.slice(start, start + perPage.value)
})

// Métodos
function applyFilters() {
  page.value = 1
}

function resetFilters() {
  filter.value = {
    condition: 'all',
    brand: [],
    system: [],
    screen: [],
  }
  priceRange.value = [0, maxPrice.value]
  sortBy.value = 'price-asc'
  searchQuery.value = ''
  page.value = 1
}

// Watchers
watch(
  () => route.query.q,
  (newQuery) => {
    searchQuery.value = newQuery || ''
    page.value = 1
  },
)

// Inicialización
onMounted(() => {
  if (route.query.q) {
    searchQuery.value = route.query.q
  }
})
</script>

<style scoped>
.sticky-filters {
  position: sticky;
  top: 20px;
}

.hero-section {
  border-radius: 12px;
  overflow: hidden;
}

@media (max-width: 768px) {
  .sticky-filters {
    position: static;
    margin-bottom: 20px;
  }
}
</style>
