<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const selectedTime = route.query.time || ''
const selectedMood = route.query.mood || ''
const selectedSource = route.query.source || 'vault'

const vaultGames = ref([])
const recommendedGame = ref(null)

const matchingGames = ref([])
const currentGameIndex = ref(0)

const moodGenres = {
  'Relaxing & Cozy': ['Simulation', 'Casual', 'Puzzle', 'Farming'],
  'Adventure & Exploration': ['Adventure', 'Role Playing', 'RPG', 'Open World'],
  'Action & Challenge': [
    'Action',
    'Shooter',
    'Fighting',
    'Platformer',
    'Arcade',
  ],
}

onMounted(() => {
  const savedGames = localStorage.getItem('gameConquestVault')

  if (savedGames) {
    vaultGames.value = JSON.parse(savedGames)
  }

  matchingGames.value = vaultGames.value.filter((game) => {
    const genre = (game.genre || '').toLowerCase()

    const matchingGenres = moodGenres[selectedMood] || []

    return matchingGenres.some((item) => genre.includes(item.toLowerCase()))
  })

  if (matchingGames.value.length > 0) {
    recommendedGame.value = matchingGames.value[0]
  } else {
    recommendedGame.value = null
  }
})

function tryAnotherGame() {
  if (matchingGames.value.length <= 1) {
    return
  }

  currentGameIndex.value =
    (currentGameIndex.value + 1) % matchingGames.value.length

  recommendedGame.value = matchingGames.value[currentGameIndex.value]
}

function playThisGame() {
  if (!recommendedGame.value) return

  const game = vaultGames.value.find(
    (item) => item.id === recommendedGame.value.id,
  )

  if (!game) return

  game.status = 'Currently Playing'

  localStorage.setItem('gameConquestVault', JSON.stringify(vaultGames.value))

  recommendedGame.value = game

  alert(`${game.title} is now marked as Currently Playing!`)
}
</script>

<template>
  <main class="min-h-screen bg-[#FFF8FB] px-6 py-10 text-[#475569]">
    <div class="mx-auto max-w-4xl">
      <RouterLink
        to="/find"
        class="mb-6 inline-block rounded-lg bg-sky-100 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-sky-200"
      >
        ← Back to Questions
      </RouterLink>

      <h1 class="mb-4 text-3xl font-bold">My Next ConQuest</h1>

      <p class="mb-10 text-lg">Your next adventure is waiting!</p>

      <div class="rounded-xl bg-purple-100 p-8 text-center">
        <h2 class="mb-6 text-2xl font-bold">
          {{
            recommendedGame
              ? `Your Next Game: ${recommendedGame.title}`
              : 'No Matching ConQuest Found'
          }}
        </h2>

        <!-- Game Cover Placeholder -->

        <div
          v-if="recommendedGame"
          class="mx-auto mb-6 flex h-64 max-w-48 flex-col items-center justify-center gap-3 rounded-lg bg-sky-100 p-4 text-center shadow-sm"
        >
          <span class="text-5xl">🎮</span>
          <span class="font-semibold">
            {{ recommendedGame.title }}
          </span>
        </div>

        <p v-if="recommendedGame" class="mx-auto mb-4 max-w-xl">
          <strong>Why this game?</strong>
          You selected {{ selectedMood }} and have
          {{ selectedTime.toLowerCase() }} to play.
          {{ recommendedGame.title }} is recommended based on its genre and is
          already saved in your ConQuest Vault!
        </p>

        <p v-else class="mx-auto mb-4 max-w-xl">
          No games in your ConQuest Vault match your selected mood. Try changing
          your answers or adding more games to your Vault to discover your next
          adventure!
        </p>

        <div class="flex flex-wrap justify-center gap-4">
          <button
            type="button"
            @click="playThisGame"
            :disabled="!recommendedGame"
            class="rounded-lg bg-pink-300 px-6 py-3 font-semibold hover:bg-pink-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Play This Game
          </button>

          <button
            type="button"
            @click="tryAnotherGame"
            :disabled="matchingGames.length <= 1"
            class="rounded-lg bg-sky-200 px-6 py-3 font-semibold hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Try Another Game
          </button>
        </div>
      </div>
    </div>
  </main>
</template>
