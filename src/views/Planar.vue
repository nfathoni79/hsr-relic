<script setup>
import { computed } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import planars from '../data/planars'
import characters from '../data/characters'
import { groupStats } from '../utils'

const includeSecond = defineModel('includeSecond')

const router = useRouter()
const route = useRoute()

const currentPlanar = computed({
  get: () => planars.some(planar => planar.id == route.params.id)
    ? route.params.id
    : '',
  set: newValue => router.push({ name: 'planars', params: { id: newValue } }),
})

const planarDetail = computed(() => {
  if (!currentPlanar.value) return null

  const id = currentPlanar.value
  const planar = planars.find(planar => planar.id == id)
  const name = planar?.name
  const effect = planar?.effect

  const chars = characters.filter(char => !includeSecond.value
    ? char.planars[0] == id
    : char.planars.includes(id)
  )

  let sphereStatCharPairs = []
  let ropeStatCharPairs = []
  let subStatCharPairs = []
  
  for (const char of chars) {
    for (const stat of char.sphereStats) {
      sphereStatCharPairs.push([stat, char.id])
    }

    for (const stat of char.ropeStats) {
      ropeStatCharPairs.push([stat, char.id])
    }

    for (const stat of char.subStats) {
      subStatCharPairs.push([stat, char.id])
    }
  }

  const sphereStats = groupStats(sphereStatCharPairs.sort())
  const ropeStats = groupStats(ropeStatCharPairs.sort())
  const subStats = groupStats(subStatCharPairs.sort())

  return {
    id,
    name,
    effect,
    chars,
    sphereStats,
    ropeStats,
    subStats,
  }
})
</script>

<template>
  <div>
    <label class="block">
      <span>Item</span>
      <select v-model="currentPlanar" class="mt-1 block w-full">
        <option value="" disabled selected hidden>Select item</option>
        <option v-for="planar in planars" :key="planar.id" :value="planar.id">
          {{ planar.name }}
        </option>
      </select>
    </label>

    <label class="mt-2 inline-flex items-center">
      <input type="checkbox" v-model="includeSecond">
      <span class="ml-2">Include second option</span>
    </label>

    <div v-if="planarDetail">
      <h2>{{ planarDetail?.name }}</h2>

      <p>{{ planarDetail?.effect }}</p>

      <h3>Characters</h3>
      <span v-for="(char, index) in planarDetail?.chars" :key="char.id">
        <RouterLink :to="{ name: 'characters', params: { id: char.id } }">
          {{ char.name }}
        </RouterLink>
        <span v-if="index < planarDetail?.chars.length - 1">, </span>
      </span>
      <p v-if="planarDetail?.chars.length < 1">-</p>
    
      <div class="flex">
        <div class="grow">
          <h3>Planar Sphere</h3>
          <ul>
            <Disclosure as="li"
              v-for="stat in planarDetail?.sphereStats" :key="stat.stat">
              <DisclosureButton class="uppercase">
                {{ stat.stat }} ({{ stat.chars.length }})
              </DisclosureButton>
              <DisclosurePanel as="ul">
                <li v-for="char in stat.chars" :key="char.id">
                  <RouterLink :to="{ name: 'characters', params: { id: char.id } }">
                    {{ char.name }}
                  </RouterLink>
                </li>
              </DisclosurePanel>
            </Disclosure>
          </ul>
          <p v-if="planarDetail?.sphereStats.length < 1">-</p>
        </div>
        
        <div class="grow">
          <h3>Link Rope</h3>
          <ul>
            <Disclosure as="li"
              v-for="stat in planarDetail?.ropeStats" :key="stat.stat">
              <DisclosureButton class="uppercase">
                {{ stat.stat }} ({{ stat.chars.length }})
              </DisclosureButton>
              <DisclosurePanel as="ul">
                <li v-for="char in stat.chars" :key="char.id">
                  <RouterLink :to="{ name: 'characters', params: { id: char.id } }">
                    {{ char.name }}
                  </RouterLink>
                </li>
              </DisclosurePanel>
            </Disclosure>
          </ul>
          <p v-if="planarDetail?.ropeStats.length < 1">-</p>
        </div>
      </div>

      <div>
        <h3>Substats</h3>
        <ul>
          <Disclosure as="li"
            v-for="stat in planarDetail?.subStats" :key="stat.stat">
            <DisclosureButton class="uppercase">
              {{ stat.stat }} ({{ stat.chars.length }})
            </DisclosureButton>
            <DisclosurePanel as="ul">
              <li v-for="char in stat.chars" :key="char.id">
                <RouterLink :to="{ name: 'characters', params: { id: char.id } }">
                  {{ char.name }}
                </RouterLink>
              </li>
            </DisclosurePanel>
          </Disclosure>
        </ul>
        <p v-if="planarDetail?.subStats.length < 1">-</p>
      </div>
    </div>
  </div>
</template>