<script setup>
import { computed } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import relics from '../data/relics'
import characters from '../data/characters'
import { groupStats } from '../utils'

const includeSecond = defineModel('includeSecond')

const router = useRouter()
const route = useRoute()

const currentRelic = computed({
  get: () => relics.some(relic => relic.id == route.params.id)
    ? route.params.id
    : '',
  set: newValue => router.push({ name: 'relics', params: { id: newValue } }),
})

const relicDetail = computed(() => {
  if (!currentRelic.value) return null

  const id = currentRelic.value
  const relic = relics.find(relic => relic.id == id)
  const name = relic?.name
  const effects = relic?.effects
  
  const chars = characters.filter(char => !includeSecond.value
    ? char.relics[0].includes(id)
    : char.relics[0].includes(id) || char.relics[1].includes(id)
  )

  let bodyStatCharPairs = []
  let feetStatCharPairs = []
  let subStatCharPairs = []
  
  for (const char of chars) {
    for (const stat of char.bodyStats) {
      bodyStatCharPairs.push([stat, char.id])
    }

    for (const stat of char.feetStats) {
      feetStatCharPairs.push([stat, char.id])
    }

    for (const stat of char.subStats) {
      subStatCharPairs.push([stat, char.id])
    }
  }

  const bodyStats = groupStats(bodyStatCharPairs.sort())
  const feetStats = groupStats(feetStatCharPairs.sort())
  const subStats = groupStats(subStatCharPairs.sort())

  return {
    id,
    name,
    effects,
    chars,
    bodyStats,
    feetStats,
    subStats,
  }
})
</script>

<template>
  <div>
    <label class="block">
      <span>Item</span>
      <select v-model="currentRelic" class="mt-1 block w-full">
        <option value="" disabled selected hidden>Select item</option>
        <option v-for="relic in relics" :key="relic.id" :value="relic.id">
          {{ relic.name }}
        </option>
      </select>
    </label>

    <label class="mt-2 inline-flex items-center">
      <input type="checkbox" v-model="includeSecond">
      <span class="ml-2">Include second option</span>
    </label>

    <div v-if="relicDetail">
      <h2>{{ relicDetail?.name }}</h2>

      <ul>
        <li v-for="effect in relicDetail?.effects">{{ effect }}</li>
      </ul>

      <h3>Characters</h3>
      <span v-for="(char, index) in relicDetail?.chars" :key="char.id">
        <RouterLink :to="{ name: 'characters', params: { id: char.id } }">
          {{ char.name }}
        </RouterLink>
        <span v-if="index < relicDetail?.chars.length - 1">, </span>
      </span>
      <p v-if="relicDetail?.chars.length < 1">-</p>
      
      <div class="flex">
        <div class="grow">
          <h3>Body</h3>
          <ul>
            <Disclosure as="li"
              v-for="stat in relicDetail?.bodyStats" :key="stat.stat">
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
          <p v-if="relicDetail?.bodyStats.length < 1">-</p>
        </div>
        
        <div class="grow">
          <h3>Feet</h3>
          <ul>
            <Disclosure as="li"
              v-for="stat in relicDetail?.feetStats" :key="stat.stat">
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
          <p v-if="relicDetail?.feetStats.length < 1">-</p>
        </div>
      </div>

      <div>
        <h3>Substats</h3>
        <ul>
          <Disclosure as="li"
            v-for="stat in relicDetail?.subStats" :key="stat.stat">
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
        <p v-if="relicDetail?.subStats.length < 1">-</p>
      </div>
    </div>
  </div>
</template>