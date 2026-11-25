<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const playTime = ref('')
const gameMood = ref('')
const gameSource = ref('vault')

const router = useRouter()

function findMyConQuest() {
  if (!playTime.value || !gameMood.value) {
    alert('Please answer both questions first!')
    return
  }

  router.push({
    path: '/result',
    query: {
      time: playTime.value,
      mood: gameMood.value,
      source: gameSource.value,
    },
  })
}
</script>

<template>
  <main class="min-h-screen bg-[#FFF8FB] px-6 py-10 text-[#475569]">
    <div class="mx-auto max-w-4xl">
      <h1 class="mb-4 text-3xl font-bold">Find My ConQuest</h1>

      <p class="mb-10 text-lg">
        Not sure what to play? Just answer a few questions, and we'll help you
        find your next adventure!
      </p>

      <div class="rounded-xl bg-sky-100 p-8">
        <!-- Recommendation Source -->
        <h2 class="mb-5 text-xl font-bold">
          Where should we find your next game?
        </h2>

        <div class="mb-4 flex flex-wrap gap-4">
          <button
            type="button"
            @click="gameSource = 'vault'"
            :aria-pressed="gameSource === 'vault'"
            class="rounded-lg px-5 py-3 font-semibold transition"
            :class="
              gameSource === 'vault'
                ? 'bg-pink-300 ring-2 ring-slate-500'
                : 'bg-white hover:bg-pink-100'
            "
          >
            My ConQuest Vault
          </button>

          <button
            type="button"
            @click="gameSource = 'api'"
            :aria-pressed="gameSource === 'api'"
            class="rounded-lg px-5 py-3 font-semibold transition"
            :class="
              gameSource === 'api'
                ? 'bg-pink-300 ring-2 ring-slate-500'
                : 'bg-white hover:bg-pink-100'
            "
          >
            Discover New Games
          </button>
        </div>

        <p class="mb-10">
          {{
            gameSource === 'vault'
              ? 'Find your next adventure from games already in your Vault.'
              : 'Discover games through GameBrain based on your preferences.'
          }}
        </p>
        <!-- Question 1 -->
        <h2 class="mb-5 text-xl font-bold">
          1. How much time do you have to play?
        </h2>

        <div class="mb-10 flex flex-wrap gap-4">
          <button
            v-for="option in [
              'Under 30 minutes',
              '30–60 minutes',
              'Over 1 hour',
            ]"
            :key="option"
            type="button"
            @click="playTime = option"
            class="rounded-lg px-5 py-3 transition"
            :class="
              playTime === option
                ? 'bg-pink-300 ring-2 ring-slate-500'
                : 'bg-white hover:bg-pink-100'
            "
          >
            {{ option }}
          </button>
        </div>

        <!-- Question 2 -->
        <h2 class="mb-5 text-xl font-bold">
          2. What type of game are you in the mood for?
        </h2>

        <div class="mb-10 flex flex-wrap gap-4">
          <button
            v-for="option in [
              'Relaxing & Cozy',
              'Adventure & Exploration',
              'Action & Challenge',
            ]"
            :key="option"
            type="button"
            @click="gameMood = option"
            class="rounded-lg px-5 py-3 transition"
            :class="
              gameMood === option
                ? 'bg-pink-300 ring-2 ring-slate-500'
                : 'bg-white hover:bg-pink-100'
            "
          >
            {{ option }}
          </button>
        </div>

        <button
          type="button"
          @click="findMyConQuest"
          class="rounded-lg bg-pink-300 px-8 py-4 font-semibold hover:bg-pink-400"
        >
          Find My Next ConQuest
        </button>
      </div>
    </div>
  </main>
</template>
