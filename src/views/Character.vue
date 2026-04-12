<script setup>
import { computed } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import characters from '../data/characters'
import { getRelic, getPlanar, getChar } from '../utils'

const includeSecond = defineModel('includeSecond')

const router = useRouter()
const route = useRoute()

const currentChar = computed({
  get: () => characters.some(char => char.id == route.params.id)
    ? route.params.id
    : '',
  set: newValue => router.push({
    name: 'characters', params: { id: newValue }
  }),
})

const charDetail = computed(() => {
  if (!currentChar.value) return null

  const id = currentChar.value
  const char = getChar(id)

  const name = char.name

  const relics = !includeSecond.value
    ? [char.relics[0].map(relicId => getRelic(relicId))]
    : char.relics.map(relicSet => relicSet.map(relicId => getRelic(relicId)))

  const planars = !includeSecond.value
    ? [getPlanar(char.planars[0])]
    : char.planars.map(planarId => getPlanar(planarId))

  const teams = {
    rnk: char.teams.rnk,
    dmg: char.teams.dmg.map(charId => getChar(charId)),
    sub: char.teams.sub.map(charId => getChar(charId)),
    amp: char.teams.amp.map(charId => getChar(charId)),
    sus: char.teams.sus.map(charId => getChar(charId)),
  }

  return {
    id,
    name,
    relics,
    planars,
    bodyStats: char.bodyStats,
    feetStats: char.feetStats,
    sphereStats: char.sphereStats,
    ropeStats: char.ropeStats,
    subStats: char.subStats,
    teams,
  }
})
</script>

<template>
  <div>
    <label class="block">
      <span>Item</span>
      <select v-model="currentChar" class="mt-1 block w-full">
        <option value="" disabled selected hidden>Select item</option>
        <option v-for="char in characters" :key="char.id" :value="char.id">
          {{ char.name }}
        </option>
      </select>
    </label>

    <label class="mt-2 inline-flex items-center">
      <input type="checkbox" v-model="includeSecond">
      <span class="ml-2">Include second option</span>
    </label>

    <div v-if="charDetail">
      <h2>{{ charDetail?.name }}</h2> 

      <div>
        <h3>Relics</h3>
        <ul>
          <li v-for="(relicSet, setIndex) in charDetail?.relics" :key="setIndex">
            <span v-for="(relic, index) in relicSet" :key="relic.id">
              <RouterLink :to="{ name: 'relics', params: { id: relic.id } }">
                {{ relic.name }}
              </RouterLink>
              <span v-if="index < relicSet.length - 1">, </span>
            </span>
          </li>
        </ul>
      </div>

      <div>
        <h3>Planars</h3>
        <ul>
          <li v-for="planar in charDetail?.planars" :key="planar.id">
            <RouterLink :to="{ name: 'planars', params: { id: planar.id } }">
              {{ planar.name }}
            </RouterLink>
          </li>
        </ul>
      </div>

      <div class="grid grid-cols-2">
        <div>
          <h3>Body</h3>
          <span v-for="(stat, index) in charDetail?.bodyStats" :key="index"
            class="uppercase">
            {{ stat }}<span v-if="index < charDetail?.bodyStats.length - 1">, </span>
          </span>
        </div>

        <div>
          <h3>Feet</h3>
          <span v-for="(stat, index) in charDetail?.feetStats" :key="index"
            class="uppercase">
            {{ stat }}<span v-if="index < charDetail?.feetStats.length - 1">, </span>
          </span>
        </div>

        <div>
          <h3>Planar Sphere</h3>
          <span v-for="(stat, index) in charDetail?.sphereStats" :key="index"
            class="uppercase">
            {{ stat }}<span v-if="index < charDetail?.sphereStats.length - 1">, </span>
          </span>
        </div>

        <div>
          <h3>Link Rope</h3>
          <span v-for="(stat, index) in charDetail?.ropeStats" :key="index"
            class="uppercase">
            {{ stat }}<span v-if="index < charDetail?.ropeStats.length - 1">, </span>
          </span>
        </div>

        <div class="col-span-2">
          <h3>Substats</h3>
          <span v-for="(stat, index) in charDetail?.subStats" :key="index"
            class="uppercase">
            {{ stat }}<span v-if="index < charDetail?.subStats.length - 1">, </span>
          </span>
        </div>
      </div>

      <div>
        <h3>Teams</h3>

        <span>Rank: {{ charDetail?.teams.rnk }}</span>

        <div class="grid grid-cols-2 gap-x-2">
          <div>
            <h4>Damagers</h4>
            <span v-for="(char, index) in charDetail?.teams.dmg" :key="char.id">
              <RouterLink v-if="char.id != route.params.id"
                :to="{ name: 'characters', params: { id: char.id } }">
                
                {{ char.name }}
              </RouterLink>
              <span v-else>{{ char.name }}</span>
              <span v-if="index < charDetail?.teams.dmg.length - 1">, </span>
            </span>
            <span v-if="charDetail?.teams.dmg.length < 1">-</span>
          </div>

          <div>
            <h4>Sub Damagers</h4>
            <span v-for="(char, index) in charDetail?.teams.sub" :key="char.id">
              <RouterLink v-if="char.id != route.params.id"
                :to="{ name: 'characters', params: { id: char.id } }">
                
                {{ char.name }}
              </RouterLink>
              <span v-else>{{ char.name }}</span>
              <span v-if="index < charDetail?.teams.sub.length - 1">, </span>
            </span>
            <span v-if="charDetail?.teams.sub.length < 1">-</span>
          </div>

          <div>
            <h4>Amplifiers</h4>
            <span v-for="(char, index) in charDetail?.teams.amp" :key="char.id">
              <RouterLink v-if="char.id != route.params.id"
                :to="{ name: 'characters', params: { id: char.id } }">
                
                {{ char.name }}
              </RouterLink>
              <span v-else>{{ char.name }}</span>
              <span v-if="index < charDetail?.teams.amp.length - 1">, </span>
            </span>
            <span v-if="charDetail?.teams.amp.length < 1">-</span>
          </div>

          <div>
            <h4>Sustainers</h4>
            <span v-for="(char, index) in charDetail?.teams.sus" :key="char.id">
              <RouterLink v-if="char.id != route.params.id"
                :to="{ name: 'characters', params: { id: char.id } }">
                
                {{ char.name }}
              </RouterLink>
              <span v-else>{{ char.name }}</span>
              <span v-if="index < charDetail?.teams.sus.length - 1">, </span>
            </span>
            <span v-if="charDetail?.teams.sus.length < 1">-</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>