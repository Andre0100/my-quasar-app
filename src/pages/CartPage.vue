<template>
  <q-page padding class="bg-grey-1">
    <div class="row justify-center">
      <div class="col-12 col-lg-10">
        <!-- Header -->
        <div class="row items-center q-mb-lg">
          <div class="col">
            <div class="text-h4 text-weight-bold">Carrito de Compras</div>
            <div class="text-subtitle1 text-grey">
              {{ cartItems.length }} producto(s) en tu carrito
            </div>
          </div>
          <div class="col-auto">
            <q-btn
              color="primary"
              icon="shopping_cart"
              label="Seguir Comprando"
              to="/"
            />
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="cartItems.length === 0" class="text-center q-pa-xl">
          <q-icon name="shopping_cart" size="100px" color="grey-4" class="q-mb-md" />
          <div class="text-h5 text-grey q-mb-md">Tu carrito está vacío</div>
          <div class="text-body1 text-grey q-mb-xl">
            Descubre nuestros productos y encuentra el teléfono perfecto para ti
          </div>
          <q-btn
            color="primary"
            size="lg"
            label="Explorar Productos"
            to="/"
            no-caps
          />
        </div>

        <!-- Cart Content -->
        <div v-else class="row q-col-gutter-lg">
          <!-- Product List -->
          <div class="col-12 col-md-8">
            <q-card class="q-pa-md">
              <div class="text-h6 q-mb-md">Productos Seleccionados</div>

              <div v-for="item in cartItems" :key="item.cartId" class="cart-item q-mb-lg">
                <div class="row items-center">
                  <!-- Product Image -->
                  <div class="col-3">
                    <q-img
                      :src="item.img"
                      ratio="1"
                      class="rounded-borders"
                      style="max-width: 120px"
                    />
                  </div>

                  <!-- Product Info -->
                  <div class="col-5">
                    <div class="text-subtitle1 text-weight-bold">{{ item.title }}</div>
                    <div class="text-caption text-grey q-mt-xs">
                      {{ item.brand }} • {{ item.ram }} • {{ item.rom }}
                    </div>
                    <div class="text-caption text-grey">
                      {{ item.condition }}
                    </div>
                  </div>

                  <!-- Quantity Controls -->
                  <div class="col-2">
                    <div class="text-caption text-grey q-mb-xs">Cantidad</div>
                    <div class="row items-center no-wrap">
                      <q-btn
                        round
                        dense
                        color="grey"
                        icon="remove"
                        size="sm"
                        :disable="item.quantity <= 1"
                        @click="updateQuantity(item, item.quantity - 1)"
                      />
                      <div class="q-mx-sm text-subtitle1">{{ item.quantity }}</div>
                      <q-btn
                        round
                        dense
                        color="primary"
                        icon="add"
                        size="sm"
                        @click="updateQuantity(item, item.quantity + 1)"
                      />
                    </div>
                  </div>

                  <!-- Price & Remove -->
                  <div class="col-2 text-right">
                    <div class="text-h6 text-primary">
                      ${{ (item.price * item.quantity).toFixed(2) }}
                    </div>
                    <div class="text-caption text-grey">
                      ${{ item.price.toFixed(2) }} c/u
                    </div>
                    <q-btn
                      flat
                      round
                      color="red"
                      icon="delete"
                      size="sm"
                      class="q-mt-xs"
                      @click="removeFromCart(item.cartId)"
                    >
                      <q-tooltip>Eliminar producto</q-tooltip>
                    </q-btn>
                  </div>
                </div>

                <q-separator class="q-mt-md" />
              </div>
            </q-card>
          </div>

          <!-- Order Summary -->
          <div class="col-12 col-md-4">
            <q-card class="q-pa-md sticky-summary">
              <div class="text-h6 q-mb-md">Resumen del Pedido</div>

              <!-- Price Breakdown -->
              <div class="q-mb-md">
                <div class="row justify-between items-center q-mb-sm">
                  <div class="text-body1">Subtotal</div>
                  <div class="text-body1">${{ subtotal.toFixed(2) }}</div>
                </div>

                <div class="row justify-between items-center q-mb-sm">
                  <div class="text-body1">Envío</div>
                  <div class="text-body1">
                    <span v-if="subtotal > 0">${{ shipping.toFixed(2) }}</span>
                    <span v-else class="text-green">Gratis</span>
                  </div>
                </div>

                <div class="row justify-between items-center q-mb-sm">
                  <div class="text-body1">Impuestos</div>
                  <div class="text-body1">${{ taxes.toFixed(2) }}</div>
                </div>

                <q-separator class="q-my-md" />

                <div class="row justify-between items-center">
                  <div class="text-h6 text-weight-bold">Total</div>
                  <div class="text-h5 text-primary text-weight-bold">
                    ${{ total.toFixed(2) }}
                  </div>
                </div>
              </div>

              <!-- Checkout Button -->
              <q-btn
                color="primary"
                size="lg"
                label="Proceder al Pago"
                class="full-width q-mb-md"
                @click="proceedToCheckout"
                no-caps
              />

              <!-- Security Info -->
              <div class="text-center">
                <div class="row items-center justify-center q-gutter-xs q-mb-sm">
                  <q-icon name="lock" size="16px" color="green" />
                  <div class="text-caption text-green">Compra 100% segura</div>
                </div>
                <div class="text-caption text-grey">
                  Tus datos están protegidos con encriptación SSL
                </div>
              </div>
            </q-card>
          </div>
        </div>

        <!-- Recommended Products -->
        <div v-if="cartItems.length > 0" class="q-mt-xl">
          <div class="text-h5 q-mb-md">Productos que podrían interesarte</div>
          <div class="row q-col-gutter-md">
            <div
              v-for="product in recommendedProducts"
              :key="product.id"
              class="col-12 col-sm-6 col-md-4 col-lg-3"
            >
              <product-card :product="product" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useCartStore } from 'stores/cart'
import { useProductsStore } from 'stores/products'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import ProductCard from 'components/ProductCard.vue'

const $q = useQuasar()
const router = useRouter()
const cartStore = useCartStore()
const productsStore = useProductsStore()

// Computed properties
const cartItems = computed(() => cartStore.items)
const subtotal = computed(() => cartStore.total)
const shipping = computed(() => subtotal.value > 0 ? cartStore.shipping : 0)
const taxes = computed(() => subtotal.value * 0.13) // 13% de impuestos
const total = computed(() => subtotal.value + shipping.value + taxes.value)

// Recommended products (excluir productos ya en el carrito)
const recommendedProducts = computed(() => {
  const cartProductIds = cartItems.value.map(item => item.id)
  return productsStore.items
    .filter(product => !cartProductIds.includes(product.id))
    .slice(0, 4)
})

// Methods
function updateQuantity(item, newQuantity) {
  if (newQuantity < 1) return
  cartStore.updateQuantity(item.cartId, newQuantity)
}

function removeFromCart(cartId) {
  $q.dialog({
    title: 'Eliminar producto',
    message: '¿Estás seguro de que quieres eliminar este producto del carrito?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    cartStore.remove(cartId)
    $q.notify({
      type: 'positive',
      message: 'Producto eliminado del carrito',
      position: 'top-right'
    })
  })
}

function proceedToCheckout() {
  $q.notify({
    message: 'Procediendo al proceso de pago...',
    color: 'primary',
    icon: 'credit_card',
    position: 'top'
  })

  // Aquí podrías redirigir a una página de checkout real
  // Por ahora simulamos el proceso
  setTimeout(() => {
    $q.dialog({
      title: '¡Compra Exitosa!',
      message: 'Tu pedido ha sido procesado correctamente. Recibirás un correo de confirmación.',
      ok: {
        label: 'Continuar',
        color: 'positive'
      }
    }).onOk(() => {
      cartStore.clear()
      router.push('/')
    })
  }, 2000)
}

// Lifecycle
onMounted(() => {
  cartStore.loadCart()
})
</script>

<style scoped>
.sticky-summary {
  position: sticky;
  top: 20px;
}

.cart-item {
  transition: background-color 0.3s ease;
}

.cart-item:hover {
  background-color: #f8f9fa;
  border-radius: 8px;
}

@media (max-width: 768px) {
  .sticky-summary {
    position: static;
  }
}
</style>
