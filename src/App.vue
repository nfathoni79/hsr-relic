<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'

const router = useRouter()
const route = useRoute()

const categories = [
  {
    id: 'relics',
    name: 'Relics',
  },
  {
    id: 'planars',
    name: 'Planars',
  },
  {
    id: 'characters',
    name: 'Characters',
  },
]

const includeSecond = ref(false)

const currentCategory = computed({
  get: () => categories.some(cat => cat.id == route.name)
    ? route.name
    : '',
  set: newValue => router.push({ name: newValue }),
})
</script>

<template>
  <div class="mx-auto max-w-screen-sm min-h-screen 
    bg-purple-50 px-4 py-2 prose">
    <RouterLink to="/"><h1>HSR Relic</h1></RouterLink>
    <p>Honkai Star Rail Relics Management Helper (HSR v3.6)</p>

    <label class="block">
      <span>Category</span>
      <select v-model="currentCategory" class="mt-1 block w-full">
        <option value="" disabled selected hidden>Select Category</option>
        <option v-for="category in categories" :key="category.id"
          :value="category.id">
          {{ category.name }}
        </option>
      </select>
    </label>

    <RouterView v-model:includeSecond="includeSecond" />
  </div>
</template>
