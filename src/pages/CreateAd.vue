<!-- pages/CreateAd.vue -->
<template>
  <q-page padding class="bg-grey-1">
    <div class="row justify-center">
      <div class="col-12 col-lg-8">
        <q-card>
          <q-card-section class="bg-primary text-white">
            <div class="text-h4 text-center">Crear Nuevo Anuncio</div>
            <div class="text-subtitle1 text-center">Vende tu teléfono de forma rápida y segura</div>
          </q-card-section>

          <q-stepper v-model="step" ref="stepper" color="primary" animated class="q-pa-md">
            <!-- Step 1: Información Básica -->
            <q-step :name="1" title="Información Básica" icon="info" :done="step > 1">
              <div class="row q-col-gutter-md">
                <div class="col-12">
                  <q-input
                    v-model="form.title"
                    label="Título del anuncio *"
                    placeholder="Ej: iPhone 6 64GB en perfecto estado"
                    filled
                    :rules="[(val) => !!val || 'El título es obligatorio']"
                  />
                </div>

                <div class="col-12">
                  <q-input
                    v-model="form.description"
                    label="Descripción detallada *"
                    type="textarea"
                    filled
                    rows="4"
                    :rules="[(val) => !!val || 'La descripción es obligatoria']"
                  />
                </div>

                <div class="col-6">
                  <q-input
                    v-model.number="form.price"
                    label="Precio ($) *"
                    type="number"
                    filled
                    prefix="$"
                    :rules="[(val) => val > 0 || 'El precio debe ser mayor a 0']"
                  />
                </div>

                <div class="col-6">
                  <q-select
                    v-model="form.condition"
                    :options="conditionOptions"
                    label="Condición *"
                    filled
                    :rules="[(val) => !!val || 'Selecciona una condición']"
                  />
                </div>
              </div>
            </q-step>

            <!-- Step 2: Especificaciones -->
            <q-step :name="2" title="Especificaciones" icon="build" :done="step > 2">
              <div class="row q-col-gutter-md">
                <div class="col-6">
                  <q-input
                    v-model="form.brand"
                    label="Marca *"
                    filled
                    :rules="[(val) => !!val || 'La marca es obligatoria']"
                  />
                </div>

                <div class="col-6">
                  <q-input v-model="form.model" label="Modelo" filled />
                </div>

                <div class="col-4">
                  <q-input v-model="form.screen" label="Pantalla (pulgadas)" filled suffix='"' />
                </div>

                <div class="col-4">
                  <q-input v-model="form.system" label="Sistema Operativo" filled />
                </div>

                <div class="col-4">
                  <q-input v-model="form.color" label="Color" filled />
                </div>

                <div class="col-6">
                  <q-input v-model="form.rom" label="Almacenamiento (ROM)" filled />
                </div>

                <div class="col-6">
                  <q-input v-model="form.ram" label="Memoria (RAM)" filled />
                </div>
              </div>
            </q-step>

            <!-- Step 3: Información del Vendedor -->
            <q-step :name="3" title="Información de Contacto" icon="person" :done="step > 3">
              <div class="row q-col-gutter-md">
                <div class="col-6">
                  <q-input
                    v-model="form.seller"
                    label="Nombre del Vendedor *"
                    filled
                    :rules="[(val) => !!val || 'El nombre es obligatorio']"
                  />
                </div>

                <div class="col-6">
                  <q-input
                    v-model="form.phone"
                    label="Teléfono de Contacto *"
                    filled
                    mask="####-####"
                    :rules="[(val) => !!val || 'El teléfono es obligatorio']"
                  />
                </div>

                <div class="col-12">
                  <q-input v-model="form.email" label="Email" filled type="email" />
                </div>

                <div class="col-12">
                  <q-input v-model="form.location" label="Ubicación" filled />
                </div>
              </div>
            </q-step>

            <!-- Step 4: Imágenes -->
            <q-step :name="4" title="Imágenes" icon="photo">
              <div class="row q-col-gutter-md">
                <div class="col-12">
                  <div class="text-subtitle2 q-mb-sm">Sube imágenes de tu producto (Máx. 4)</div>
                  <q-uploader
                    multiple
                    accept="image/*"
                    :max-files="4"
                    :max-file-size="5000000"
                    @added="onFilesAdded"
                    @removed="onFilesRemoved"
                    style="width: 100%"
                  />
                </div>

                <div class="col-12 q-mt-md">
                  <div class="text-subtitle2 q-mb-sm">Vista previa:</div>
                  <div class="row q-gutter-sm">
                    <div v-for="(preview, index) in previews" :key="index" class="col-3">
                      <q-img :src="preview" style="height: 100px" class="rounded-borders">
                        <q-btn
                          flat
                          round
                          dense
                          icon="close"
                          color="white"
                          class="absolute-top-right"
                          @click="removeImage(index)"
                        />
                      </q-img>
                    </div>
                  </div>
                </div>
              </div>
            </q-step>

            <!-- Navigation -->
            <template v-slot:navigation>
              <q-stepper-navigation class="row justify-between">
                <q-btn
                  v-if="step > 1"
                  flat
                  color="primary"
                  @click="$refs.stepper.previous()"
                  label="Atrás"
                  class="q-ml-sm"
                />

                <q-space />

                <q-btn
                  v-if="step < 4"
                  @click="$refs.stepper.next()"
                  color="primary"
                  :label="step === 4 ? 'Finalizar' : 'Continuar'"
                />

                <q-btn
                  v-else
                  @click="onSubmit"
                  color="positive"
                  icon="check"
                  label="Publicar Anuncio"
                  :loading="loading"
                />
              </q-stepper-navigation>
            </template>
          </q-stepper>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useProductsStore } from 'stores/products'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const router = useRouter()
const $q = useQuasar()
const store = useProductsStore()

const step = ref(1)
const loading = ref(false)
const previews = ref([])
const uploadedFiles = ref([])

const conditionOptions = ['Nuevo', 'Usado - Como nuevo', 'Usado - Buen estado', 'Usado - Aceptable']

const form = reactive({
  title: '',
  description: '',
  price: 0,
  condition: 'Nuevo',
  brand: '',
  model: '',
  screen: '',
  system: '',
  rom: '',
  ram: '',
  color: '',
  seller: '',
  phone: '',
  email: '',
  location: '',
  images: [],
})

function onFilesAdded(files) {
  uploadedFiles.value = files
  previews.value = files.map((file) => URL.createObjectURL(file))
  form.images = previews.value
}

function onFilesRemoved() {
  // Handle file removal if needed
}

function removeImage(index) {
  previews.value.splice(index, 1)
  uploadedFiles.value.splice(index, 1)
  form.images.splice(index, 1)
}

async function onSubmit() {
  loading.value = true

  try {
    // Validación final
    if (!form.title || !form.description || !form.price || !form.seller || !form.phone) {
      $q.notify({
        type: 'warning',
        message: 'Por favor completa todos los campos obligatorios',
      })
      loading.value = false
      return
    }

    // Crear el producto
    const newProduct = {
      title: form.title,
      description: form.description,
      price: Number(form.price),
      condition: form.condition,
      brand: form.brand,
      model: form.model,
      screen: form.screen,
      system: form.system,
      rom: form.rom,
      ram: form.ram,
      color: form.color,
      seller: form.seller,
      phone: form.phone,
      email: form.email,
      location: form.location,
      images: form.images.length > 0 ? form.images : ['https://via.placeholder.com/600x400?text=Imagen+del+Producto'],
      createdAt: new Date().toISOString(),
    }

    store.addProduct(newProduct)

    $q.notify({
      type: 'positive',
      message: '¡Anuncio creado exitosamente!',
      caption: 'Tu producto ya está disponible en la tienda',
      icon: 'check_circle',
      timeout: 3000,
      position: 'top',
    })

    // Redirigir al inicio después de un breve delay
    setTimeout(() => {
      router.push('/')
    }, 2000)
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Error al crear el anuncio',
      caption: 'Por favor intenta nuevamente',
    })
  } finally {
    loading.value = false
  }
}
</script>
