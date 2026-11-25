<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useVaultStore } from '../Stores/VaultStore.js'

const route = useRoute()
const vaultStore = useVaultStore()

const selectedTime = route.query.time || ''
const selectedMood = route.query.mood || ''
const selectedSource = route.query.source || 'vault'

const { games: vaultGames } = storeToRefs(vaultStore)
const recommendedGame = ref(null)

const matchingGames = ref([])
const currentGameIndex = ref(0)

const isLoading = ref(false)
const apiError = ref('')

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

async function getApiRecommendations() {
  isLoading.value = true
  apiError.value = ''

  try {
    const genres = moodGenres[selectedMood] || []
    const query = genres[0] || ''

    const response = await fetch(
      `/api/games?query=${encodeURIComponent(query)}`,
    )

    if (!response.ok) {
      throw new Error('Unable to find game recommendations.')
    }

    const data = await response.json()

    matchingGames.value = (data.results || [])
      .filter((game) => {
        const genre = (game.genre || '').toLowerCase()

        const matchesMood = genres.some((item) =>
          genre.includes(item.toLowerCase()),
        )

        const alreadyInVault = vaultGames.value.some(
          (savedGame) =>
            savedGame.gameBrainId === game.id ||
            savedGame.title.toLowerCase() === game.name.toLowerCase(),
        )

        return matchesMood && !alreadyInVault
      })

      .map((game) => ({
        id: `gamebrain-${game.id}`,
        gameBrainId: game.id,
        title: game.name,
        image: game.image,
        genre: game.genre,
        link: game.link,
        year: game.year,
        status: 'Want to Play',
      }))

    currentGameIndex.value = 0
    recommendedGame.value = matchingGames.value[0] || null
  } catch (error) {
    apiError.value = error.message
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  if (selectedSource === 'api') {
    await getApiRecommendations()
    return
  }

  matchingGames.value = vaultGames.value.filter((game) => {
    const genre = (game.genre || '').toLowerCase()

    const matchingGenres = moodGenres[selectedMood] || []

    return matchingGenres.some((item) => genre.includes(item.toLowerCase()))
  })

  currentGameIndex.value = 0
  recommendedGame.value = matchingGames.value[0] || null
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

  vaultStore.updateStatus(game.id, 'Currently Playing')

  recommendedGame.value = game

  alert(`${game.title} is now marked as Currently Playing!`)
}

function addToVault() {
  if (!recommendedGame.value) return

  const game = recommendedGame.value

  const added = vaultStore.addGame({
    ...game,
    status: 'Want to Play',
  })

  if (!added) {
    alert(`${game.title} is already in your ConQuest Vault!`)
    return
  }

  alert(`${game.title} was added to your ConQuest Vault!`)

  matchingGames.value = matchingGames.value.filter(
    (item) => item.id !== game.id,
  )

  currentGameIndex.value = 0

  recommendedGame.value = matchingGames.value[0] || null
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
            isLoading
              ? 'Finding Your Next ConQuest...'
              : apiError
                ? 'Something Went Wrong'
                : recommendedGame
                  ? `Your Next Game: ${recommendedGame.title}`
                  : 'No Matching ConQuest Found'
          }}
        </h2>

        <p v-if="isLoading" class="mb-6">
          Searching GameBrain for your next adventure...
        </p>

        <p v-if="apiError" class="mb-6 text-red-600">
          {{ apiError }}
        </p>

        <!-- Game Cover -->
        <div v-if="recommendedGame" class="mx-auto mb-6 max-w-sm">
          <img
            v-if="recommendedGame.image"
            :src="recommendedGame.image"
            :alt="`${recommendedGame.title} cover`"
            class="h-64 w-full rounded-lg bg-sky-100 object-contain shadow-sm"
          />

          <div
            v-else
            class="mx-auto flex h-64 max-w-48 flex-col items-center justify-center gap-3 rounded-lg bg-sky-100 p-4 shadow-sm"
          >
            <span class="text-5xl">🎮</span>
            <span class="font-semibold">
              {{ recommendedGame.title }}
            </span>
          </div>
        </div>

        <p v-if="recommendedGame" class="mx-auto mb-4 max-w-xl">
          <strong>Why this game?</strong>
          You selected {{ selectedMood }} and have
          {{ selectedTime.toLowerCase() }} to play.

          {{ recommendedGame.title }} is recommended based on its genre.

          {{
            selectedSource === 'vault'
              ? 'This game is already saved in your ConQuest Vault!'
              : 'This game was discovered through GameBrain!'
          }}
        </p>

        <p v-else-if="!isLoading && !apiError" class="mx-auto mb-4 max-w-xl">
          {{
            selectedSource === 'vault'
              ? 'No games in your ConQuest Vault match your selected mood. Try changing your answers or adding more games to your Vault!'
              : 'No matching games were found through GameBrain. Try changing your answers!'
          }}
        </p>

        <div class="flex flex-wrap justify-center gap-4">
          <button
            type="button"
            @click="selectedSource === 'vault' ? playThisGame() : addToVault()"
            :disabled="!recommendedGame || isLoading"
            class="rounded-lg bg-pink-300 px-6 py-3 font-semibold hover:bg-pink-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {{ selectedSource === 'vault' ? 'Play This Game' : 'Add to Vault' }}
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
