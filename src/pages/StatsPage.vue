<template>
  <q-page padding class="bg-grey-1">
    <div class="row q-col-gutter-md">
      <!-- Header Stats -->
      <div class="col-12">
        <div class="text-h4 q-mb-md">Estadísticas de la Tienda</div>
      </div>

      <!-- Quick Stats -->
      <div class="col-12 row q-col-gutter-md">
        <div class="col-6 col-sm-3">
          <q-card class="text-center q-pa-md bg-primary text-white">
            <q-icon name="inventory_2" size="48px" class="q-mb-sm" />
            <div class="text-h5">{{ totalProducts }}</div>
            <div class="text-caption">Productos Totales</div>
          </q-card>
        </div>

        <div class="col-6 col-sm-3">
          <q-card class="text-center q-pa-md bg-secondary text-white">
            <q-icon name="store" size="48px" class="q-mb-sm" />
            <div class="text-h5">{{ brands.length }}</div>
            <div class="text-caption">Marcas Diferentes</div>
          </q-card>
        </div>

        <div class="col-6 col-sm-3">
          <q-card class="text-center q-pa-md bg-positive text-white">
            <q-icon name="attach_money" size="48px" class="q-mb-sm" />
            <div class="text-h5">${{ averagePrice }}</div>
            <div class="text-caption">Precio Promedio</div>
          </q-card>
        </div>

        <div class="col-6 col-sm-3">
          <q-card class="text-center q-pa-md bg-orange text-white">
            <q-icon name="new_releases" size="48px" class="q-mb-sm" />
            <div class="text-h5">{{ newProducts }}</div>
            <div class="text-caption">Productos Nuevos</div>
          </q-card>
        </div>
      </div>

      <!-- Charts -->
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">Distribución por Marca</div>
          </q-card-section>
          <q-card-section>
            <canvas ref="barCanvas" height="250"></canvas>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">Sistemas Operativos</div>
          </q-card-section>
          <q-card-section>
            <canvas ref="pieCanvas" height="250"></canvas>
          </q-card-section>
        </q-card>
      </div>

      <!-- Additional Stats -->
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">Distribución por Condición</div>
          </q-card-section>
          <q-card-section>
            <canvas ref="conditionCanvas" height="200"></canvas>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">Rango de Precios</div>
          </q-card-section>
          <q-card-section>
            <q-range
              :model-value="priceRange"
              :min="0"
              :max="maxPrice"
              label-always
              color="primary"
              readonly
            />
            <div class="row justify-between q-mt-sm">
              <div class="text-caption">Mín: ${{ minPrice }}</div>
              <div class="text-caption">Máx: ${{ maxPrice }}</div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Products Table -->
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="text-h6">Últimos Productos Agregados</div>
          </q-card-section>
          <q-card-section>
            <q-table :rows="recentProducts" :columns="productColumns" row-key="id" flat bordered>
              <template v-slot:body-cell-price="props">
                <q-td :props="props">
                  <div class="text-weight-bold text-primary">${{ props.row.price.toFixed(2) }}</div>
                </q-td>
              </template>

              <template v-slot:body-cell-condition="props">
                <q-td :props="props">
                  <q-badge :color="props.row.condition === 'Nuevo' ? 'positive' : 'orange'">
                    {{ props.row.condition }}
                  </q-badge>
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { Chart, registerables } from 'chart.js'
import { useProductsStore } from 'stores/products'

Chart.register(...registerables)

const store = useProductsStore()
const barCanvas = ref(null)
const pieCanvas = ref(null)
const conditionCanvas = ref(null)

// Computed values
const totalProducts = computed(() => store.items.length)
const brands = computed(() => store.brands)
const averagePrice = computed(() => {
  const total = store.items.reduce((sum, item) => sum + (item.price || 0), 0)
  return (total / store.items.length || 0).toFixed(2)
})
const newProducts = computed(() => store.items.filter((item) => item.condition === 'Nuevo').length)
const minPrice = computed(() => Math.min(...store.items.map((item) => item.price || 0)))
const maxPrice = computed(() => store.maxPrice)
const priceRange = computed(() => [minPrice.value, maxPrice.value])

const recentProducts = computed(() =>
  [...store.items].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5),
)

const productColumns = [
  { name: 'title', label: 'Producto', field: 'title', align: 'left', sortable: true },
  { name: 'brand', label: 'Marca', field: 'brand', align: 'center', sortable: true },
  { name: 'price', label: 'Precio', field: 'price', align: 'center', sortable: true },
  { name: 'condition', label: 'Condición', field: 'condition', align: 'center', sortable: true },
  { name: 'system', label: 'Sistema', field: 'system', align: 'center', sortable: true },
]

onMounted(() => {
  // Prepare data for charts
  const items = store.items

  // Brand distribution
  const byBrand = items.reduce((acc, item) => {
    acc[item.brand] = (acc[item.brand] || 0) + 1
    return acc
  }, {})

  // System distribution
  const bySystem = items.reduce((acc, item) => {
    acc[item.system] = (acc[item.system] || 0) + 1
    return acc
  }, {})

  // Condition distribution
  const byCondition = items.reduce((acc, item) => {
    acc[item.condition] = (acc[item.condition] || 0) + 1
    return acc
  }, {})

  // Brand chart
  new Chart(barCanvas.value.getContext('2d'), {
    type: 'bar',
    data: {
      labels: Object.keys(byBrand),
      datasets: [
        {
          label: 'Productos por Marca',
          data: Object.values(byBrand),
          backgroundColor: [
            '#1976d2',
            '#2196f3',
            '#64b5f6',
            '#90caf9',
            '#bbdefb',
            '#ff9800',
            '#ffb74d',
            '#ffcc80',
            '#4caf50',
            '#81c784',
          ],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
      },
    },
  })

  // System chart
  new Chart(pieCanvas.value.getContext('2d'), {
    type: 'doughnut',
    data: {
      labels: Object.keys(bySystem),
      datasets: [
        {
          data: Object.values(bySystem),
          backgroundColor: ['#1976d2', '#4caf50', '#ff9800', '#f44336', '#9c27b0'],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  })

  // Condition chart
  new Chart(conditionCanvas.value.getContext('2d'), {
    type: 'pie',
    data: {
      labels: Object.keys(byCondition),
      datasets: [
        {
          data: Object.values(byCondition),
          backgroundColor: ['#4caf50', '#ff9800', '#f44336'],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  })
})
</script>
