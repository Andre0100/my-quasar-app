<!-- pages/ProductPage.vue -->
<template>
  <q-page padding class="bg-grey-1">
    <div class="row q-col-gutter-xl">
      <!-- Image Gallery -->
      <div class="col-12 col-md-6">
        <q-card class="q-pa-md">
          <q-carousel
            v-model="activeSlide"
            animated
            infinite
            arrows
            navigation
            height="400px"
            class="rounded-borders"
          >
            <q-carousel-slide
              v-for="(img, index) in images"
              :key="index"
              :name="index"
              :img-src="img"
            />
          </q-carousel>

          <!-- Thumbnails -->
          <div class="row q-gutter-xs q-mt-md justify-center">
            <q-img
              v-for="(img, index) in images"
              :key="index"
              :src="img"
              style="width: 60px; height: 60px; cursor: pointer"
              class="rounded-borders"
              :class="{ 'thumbnail-active': activeSlide === index }"
              @click="activeSlide = index"
            />
          </div>
        </q-card>
      </div>

      <!-- Product Info -->
      <div class="col-12 col-md-6">
        <q-card class="q-pa-md">
          <div class="text-h4 text-weight-bold">{{ product.title }}</div>

          <div class="row items-center q-mt-sm">
            <q-rating v-model="rating" size="24px" color="orange" readonly />
            <div class="text-caption text-grey q-ml-sm">({{ rating }})</div>
          </div>

          <div class="text-h3 text-primary text-weight-bold q-mt-md">
            ${{ (product.price || 0).toFixed(2) }}
          </div>

          <q-badge
            :color="product.condition === 'Nuevo' ? 'positive' : 'orange'"
            class="q-mt-sm"
            size="lg"
          >
            {{ product.condition }}
          </q-badge>

          <q-separator class="q-my-lg" />

          <!-- Actions -->
          <div class="row q-gutter-md">
            <q-btn
              color="primary"
              size="lg"
              icon="shopping_cart"
              label="Añadir al Carrito"
              class="col-grow"
              @click="addToCart"
            />
            <q-btn color="secondary" size="lg" icon="favorite_border" class="col-auto" />
          </div>

          <!-- Quick Info -->
          <div class="row q-mt-xl q-col-gutter-md">
            <div class="col-6">
              <q-card flat class="bg-blue-1 text-center q-pa-md">
                <q-icon name="local_shipping" size="32px" color="primary" />
                <div class="text-caption q-mt-sm">Envío Gratis</div>
              </q-card>
            </div>
            <div class="col-6">
              <q-card flat class="bg-green-1 text-center q-pa-md">
                <q-icon name="verified_user" size="32px" color="positive" />
                <div class="text-caption q-mt-sm">Garantía 1 Año</div>
              </q-card>
            </div>
          </div>
        </q-card>

        <!-- Specifications -->
        <q-card class="q-mt-md q-pa-md">
          <div class="text-h6 q-mb-md">Especificaciones</div>

          <div class="row q-col-gutter-y-md">
            <div class="col-6" v-for="spec in specifications" :key="spec.label">
              <div class="text-caption text-grey">{{ spec.label }}</div>
              <div class="text-subtitle2">{{ spec.value || '—' }}</div>
            </div>
          </div>
        </q-card>
      </div>
    </div>

    <!-- Tabs Section -->
    <div class="row q-mt-xl">
      <div class="col-12">
        <q-card>
          <q-tabs
            v-model="activeTab"
            dense
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            narrow-indicator
          >
            <q-tab name="description" icon="description" label="Descripción" />
            <q-tab name="specs" icon="build" label="Especificaciones" />
            <q-tab name="seller" icon="person" label="Información del Vendedor" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="activeTab" animated>
            <q-tab-panel name="description">
              <div class="text-h6 q-mb-md">Descripción del Producto</div>
              <p class="text-body1">{{ product.description || 'Sin descripción disponible.' }}</p>
            </q-tab-panel>

            <q-tab-panel name="specs">
              <div class="text-h6 q-mb-md">Especificaciones Técnicas</div>
              <q-markup-table flat separator="cell">
                <tbody>
                  <tr v-for="spec in detailedSpecs" :key="spec.label">
                    <td class="text-weight-bold">{{ spec.label }}</td>
                    <td>{{ spec.value || '—' }}</td>
                  </tr>
                </tbody>
              </q-markup-table>
            </q-tab-panel>

            <q-tab-panel name="seller">
              <div class="text-h6 q-mb-md">Información del Vendedor</div>
              <div class="row items-center q-gutter-md">
                <q-avatar size="60px" color="primary" text-color="white" icon="person" />
                <div>
                  <div class="text-subtitle1">{{ product.seller || '—' }}</div>
                  <div class="text-caption text-grey">{{ product.phone || '—' }}</div>
                  <div class="text-caption text-grey">{{ product.location || '—' }}</div>
                </div>
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </div>
    </div>

    <!-- Floating Action Buttons -->
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-fab color="primary" icon="keyboard_arrow_up" direction="up" vertical-actions-align="right">
        <q-fab-action color="primary" icon="home" to="/" label="Inicio" />
        <q-fab-action
          color="secondary"
          icon="shopping_cart"
          @click="addToCart"
          label="Añadir al Carrito"
        />
      </q-fab>
    </q-page-sticky>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useProductsStore } from 'stores/products'
import { useCartStore } from 'stores/cart'
import { useQuasar } from 'quasar'

const route = useRoute()
const $q = useQuasar()
const store = useProductsStore()
const cart = useCartStore()

const product = store.getById(route.params.id) || {}
const activeSlide = ref(0)
const activeTab = ref('description')
const rating = ref(4.5)

const images = computed(() => {
  // Usar el array de imágenes si existe, sino usar la imagen individual
  return product.images || [product.img || 'https://via.placeholder.com/600x400?text=Imagen+No+Disponible']
})

const specifications = computed(() => [
  { label: 'Marca', value: product.brand },
  { label: 'Modelo', value: product.model },
  { label: 'Pantalla', value: product.screen ? `${product.screen}"` : null },
  { label: 'Sistema', value: product.system },
  { label: 'Almacenamiento', value: product.rom },
  { label: 'Memoria RAM', value: product.ram },
])

const detailedSpecs = computed(() => [
  { label: 'Marca', value: product.brand },
  { label: 'Modelo', value: product.model },
  { label: 'Estado', value: product.condition },
  { label: 'Tamaño de Pantalla', value: product.screen ? `${product.screen} pulgadas` : null },
  { label: 'Sistema Operativo', value: product.system },
  { label: 'Almacenamiento Interno', value: product.rom },
  { label: 'Memoria RAM', value: product.ram },
  { label: 'Color', value: product.color || 'Negro' },
])

function addToCart() {
  cart.add(product)
  $q.notify({
    message: 'Producto añadido al carrito',
    color: 'positive',
    icon: 'shopping_cart',
    position: 'top-right',
    timeout: 2000,
  })
}
</script>

<style scoped>
.thumbnail-active {
  border: 2px solid #1976d2;
}
</style>
