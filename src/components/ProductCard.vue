<!-- components/ProductCard.vue -->
<template>
  <q-card class="product-card cursor-pointer" @click="$router.push(`/product/${product.id}`)">
    <!-- Carrusel de imágenes más pequeño -->
    <q-carousel
      v-model="currentImage"
      animated
      infinite
      arrows
      navigation
      height="150px"
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

    <div class="absolute-top-right q-pa-xs"> <!-- Cambiado a q-pa-xs para menos padding -->
      <q-badge :color="product.condition === 'Nuevo' ? 'positive' : 'orange'" class="q-mb-xs" style="font-size: 10px;">
        {{ product.condition }}
      </q-badge>
    </div>

    <div class="absolute-bottom-left q-pa-xs"> <!-- Cambiado a q-pa-xs para menos padding -->
      <q-badge color="primary" transparent style="font-size: 10px;">
        {{ product.brand }}
      </q-badge>
    </div>

    <q-card-section class="q-pb-none q-pt-sm"> <!-- Menos padding -->
      <div class="text-subtitle2 text-weight-bold product-title two-lines" style="font-size: 0.9rem;">
        {{ product.title }}
      </div>
      <div class="text-h6 text-primary text-weight-bold q-mt-xs"> <!-- Cambiado a h6 y menos margin -->
        ${{ (product.price || 0).toFixed(2) }}
      </div>
    </q-card-section>

    <q-card-section class="q-pt-none q-pb-sm"> <!-- Menos padding -->
      <div class="row items-center q-gutter-xs">
        <q-icon name="memory" size="14px" color="grey-6" /> <!-- Iconos más pequeños -->
        <div class="text-caption text-grey-7" style="font-size: 0.75rem;">{{ product.ram }} RAM</div>

        <q-separator vertical />

        <q-icon name="storage" size="14px" color="grey-6" />
        <div class="text-caption text-grey-7" style="font-size: 0.75rem;">{{ product.rom }}</div>

        <q-separator vertical />

        <q-icon name="smartphone" size="14px" color="grey-6" />
        <div class="text-caption text-grey-7" style="font-size: 0.75rem;">{{ product.screen }}"</div>
      </div>

      <div class="text-caption text-grey-7 q-mt-xs" style="font-size: 0.75rem;">
        {{ product.system }}
      </div>
    </q-card-section>

    <q-separator />

    <q-card-actions align="between" class="q-pa-sm"> <!-- Menos padding -->
      <q-btn
        flat
        dense
        color="primary"
        icon="visibility"
        label="Ver"
        size="sm"
        @click.stop="$router.push(`/product/${product.id}`)"
      />
      <q-btn
        dense
        color="secondary"
        icon="add_shopping_cart"
        label="Añadir"
        size="sm"
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
  border-radius: 8px; /* Bordes menos redondeados */
  overflow: hidden;
  height: 100%; /* Asegurar altura consistente */
}

.product-card:hover {
  transform: translateY(-2px); /* Efecto hover más sutil */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.product-carousel {
  border-radius: 8px 8px 0 0;
}

.product-title {
  min-height: 2.5em; /* Altura reducida */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.2; /* Interlineado más compacto */
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
  width: 24px !important; /* Flechas más pequeñas */
  height: 24px !important;
  min-height: 24px !important;
}

:deep(.q-carousel__navigation-inner) {
  background: rgba(0, 0, 0, 0.5);
  border-radius: 16px; /* Radio más pequeño */
  padding: 2px 6px; /* Padding reducido */
  bottom: 4px !important; /* Posicionado más cerca del borde */
}

:deep(.q-carousel__navigation-icon) {
  font-size: 8px !important; /* Puntos de navegación más pequeños */
  margin: 0 2px !important;
}
</style>
