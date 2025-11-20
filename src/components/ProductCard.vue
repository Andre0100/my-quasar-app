<template>
  <q-card class="product-card cursor-pointer" @click="$router.push(`/product/${product.id}`)">
    <q-img
      :src="product.img"
      ratio="4/3"
      class="product-image"
      placeholder-src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZWVlZWVlIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuKKojwvdGV4dD48L3N2Zz4="
    >
      <template v-slot:loading>
        <q-spinner-gears color="primary" />
      </template>

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
    </q-img>

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
import { useCartStore } from 'stores/cart'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router' // <- Agregar esta importación

const $q = useQuasar()
const router = useRouter() // <- Agregar esta línea
const props = defineProps({ product: Object })
const cart = useCartStore()

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

.product-image {
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
</style>
