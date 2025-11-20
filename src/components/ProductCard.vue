<!-- components/ProductCard.vue -->
<template>
  <q-card class="product-card cursor-pointer" @click="$router.push(`/product/${product.id}`)">
    <!-- Carrusel de imágenes -->
    <q-carousel
      v-model="currentImage"
      animated
      infinite
      arrows
      navigation
      height="200px"
      class="product-carousel"
      @mouseenter="pauseAutoPlay"
      @mouseleave="resumeAutoPlay"
    >
      <q-carousel-slide
        v-for="(img, index) in product.images || [product.img]"
        :key="index"
        :name="index"
        :img-src="img"
      />
    </q-carousel>

    <div class="absolute-top-right q-pa-sm">
      <q-badge :color="product.condition === 'Nuevo' ? 'positive' : 'orange'" class="q-mb-xs">
        {{ product.condition }}
      </q-badge>
    </div>

    <div class="absolute-bottom-left q-pa-sm">
      <q-badge color="primary" transparent>
        {{ product.brand }}
      </q-badge>
    </div>

    <q-card-section class="q-pb-none">
      <div class="text-subtitle2 text-weight-bold product-title two-lines">
        {{ product.title }}
      </div>
      <div class="text-h5 text-primary text-weight-bold q-mt-sm">
        ${{ (product.price || 0).toFixed(2) }}
      </div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <div class="row items-center q-gutter-xs">
        <q-icon name="memory" size="16px" color="grey-6" />
        <div class="text-caption text-grey-7">{{ product.ram }} RAM</div>

        <q-separator vertical />

        <q-icon name="storage" size="16px" color="grey-6" />
        <div class="text-caption text-grey-7">{{ product.rom }}</div>

        <q-separator vertical />

        <q-icon name="smartphone" size="16px" color="grey-6" />
        <div class="text-caption text-grey-7">{{ product.screen }}"</div>
      </div>

      <div class="text-caption text-grey-7 q-mt-xs">
        {{ product.system }}
      </div>
    </q-card-section>

    <q-separator />

    <q-card-actions align="between" class="q-pa-md">
      <q-btn
        flat
        dense
        color="primary"
        icon="visibility"
        label="Ver Detalles"
        @click.stop="$router.push(`/product/${product.id}`)"
      />
      <q-btn
        dense
        color="secondary"
        icon="add_shopping_cart"
        label="Añadir"
        @click.stop="addToCart"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useCartStore } from 'stores/cart'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

const $q = useQuasar()
const router = useRouter()
const props = defineProps({ product: Object })
const cart = useCartStore()

const currentImage = ref(0)
let autoPlayInterval = null

const pauseAutoPlay = () => {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval)
    autoPlayInterval = null
  }
}

const resumeAutoPlay = () => {
  if ((props.product.images || [props.product.img]).length > 1) {
    startAutoPlay()
  }
}

const startAutoPlay = () => {
  const images = props.product.images || [props.product.img]
  if (images.length > 1) {
    autoPlayInterval = setInterval(() => {
      currentImage.value = (currentImage.value + 1) % images.length
    }, 3000)
  }
}

function addToCart() {
  cart.add(props.product)
  $q.notify({
    message: 'Producto añadido al carrito',
    color: 'positive',
    icon: 'shopping_cart',
    position: 'top-right',
    timeout: 2000,
    actions: [
      {
        label: 'Ver Carrito',
        color: 'white',
        handler: () => {
          router.push('/cart')
        }
      }
    ]
  })
}

onMounted(() => {
  startAutoPlay()
})

onUnmounted(() => {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval)
  }
})
</script>

<style scoped>
.product-card {
  transition:
    transform 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;
  border-radius: 12px;
  overflow: hidden;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.product-carousel {
  border-radius: 8px 8px 0 0;
}

.product-title {
  min-height: 3em;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.two-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Estilos para las flechas del carrusel */
:deep(.q-carousel__arrow) {
  background: rgba(0, 0, 0, 0.5);
  color: white;
}

:deep(.q-carousel__navigation-inner) {
  background: rgba(0, 0, 0, 0.5);
  border-radius: 20px;
  padding: 4px 8px;
}
</style>
