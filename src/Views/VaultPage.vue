<script setup>
import { ref, computed, watch } from 'vue'

const apiSearchQuery = ref('')
const apiSearchResults = ref([])
const apiSearchLoading = ref(false)
const apiSearchError = ref('')

async function searchGameBrain() {
  const query = apiSearchQuery.value.trim()

  if (!query) {
    apiSearchError.value = 'Please enter a game name.'
    return
  }

  apiSearchLoading.value = true
  apiSearchError.value = ''
  apiSearchResults.value = []

  try {
    const response = await fetch(
      `/api/games?query=${encodeURIComponent(query)}`,
    )

    if (!response.ok) {
      throw new Error('Game search failed.')
    }

    const data = await response.json()
    apiSearchResults.value = data.results ?? []

    if (apiSearchResults.value.length === 0) {
      apiSearchError.value = 'No games found. Try another title.'
    }
  } catch (error) {
    apiSearchError.value = error.message
  } finally {
    apiSearchLoading.value = false
  }
}

function addApiGame(game) {
  const alreadyAdded = games.value.some(
    (savedGame) =>
      savedGame.gameBrainId === game.id ||
      savedGame.title.toLowerCase() === game.name.toLowerCase(),
  )

  if (alreadyAdded) {
    alert(`${game.name} is already in your ConQuest Vault!`)
    return
  }

  games.value.push({
    id: `gamebrain-${game.id}`,
    gameBrainId: game.id,
    title: game.name,
    status: 'Want to Play',
    image: game.image,
    genre: game.genre,
    year: game.year,
  })

  alert(`${game.name} was added to your ConQuest Vault!`)
}

const games = ref([
  {
    id: 1,
    title: 'Stardew Valley',
    status: 'Currently Playing',
  },
  {
    id: 2,
    title: 'The Legend of Zelda: Breath of the Wild',
    status: 'Completed',
  },
  {
    id: 3,
    title: 'Animal Crossing: New Horizons',
    status: 'Want to Play',
  },
])

const savedGames = localStorage.getItem('gameConquestVault')

if (savedGames !== null) {
  try {
    const parsedGames = JSON.parse(savedGames)

    if (Array.isArray(parsedGames)) {
      games.value = parsedGames
    }
  } catch (error) {
    console.error('Unable to load saved games:', error)
  }
}

watch(
  games,
  (updatedGames) => {
    localStorage.setItem('gameConquestVault', JSON.stringify(updatedGames))
  },
  { deep: true },
)

const searchQuery = ref('')

const showAddGameForm = ref(false)

const newGameTitle = ref('')
const newGameStatus = ref('Want to Play')

function addGame() {
  const title = newGameTitle.value.trim()

  if (!title) {
    alert('Please enter a game title.')
    return
  }

  const game = {
    id: Date.now(),
    title: title,
    status: newGameStatus.value,
  }

  games.value.push(game)

  newGameTitle.value = ''
  newGameStatus.value = 'Want to Play'
  selectedStatus.value = 'All Games'
  searchQuery.value = ''
  showAddGameForm.value = false
}

function removeGame(game) {
  const confirmed = window.confirm(
    `Are you sure you want to remove "${game.title}" from your ConQuest Vault?`,
  )

  if (confirmed) {
    games.value = games.value.filter((savedGame) => savedGame.id !== game.id)
  }
}

const selectedStatus = ref('All Games')

const filters = ['All Games', 'Want to Play', 'Currently Playing', 'Completed']

const filteredGames = computed(() => {
  return games.value.filter((game) => {
    const matchesStatus =
      selectedStatus.value === 'All Games' ||
      game.status === selectedStatus.value

    const matchesSearch = game.title
      .toLowerCase()
      .includes(searchQuery.value.trim().toLowerCase())

    return matchesStatus && matchesSearch
  })
})
</script>

<template>
  <main class="min-h-screen bg-[#FFF8FB] px-6 py-10 text-[#475569]">
    <div class="mx-auto max-w-5xl">
      <h1 class="mb-10 text-3xl font-bold">My ConQuest Vault</h1>

      <!-- Search GameBrain -->
      <div class="mb-8 rounded-xl bg-sky-100 p-6">
        <h2 class="mb-3 text-xl font-bold">Discover New Games</h2>

        <p class="mb-4 text-sm">
          Search for games to add to your ConQuest Vault!
        </p>

        <form class="flex flex-wrap gap-3" @submit.prevent="searchGameBrain">
          <input
            v-model="apiSearchQuery"
            type="text"
            placeholder="Search GameBrain..."
            class="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-3"
          />

          <button
            type="submit"
            :disabled="apiSearchLoading"
            class="rounded-lg bg-pink-300 px-6 py-3 font-semibold hover:bg-pink-400 disabled:opacity-50"
          >
            {{ apiSearchLoading ? 'Searching...' : 'Find Games' }}
          </button>
        </form>

        <p v-if="apiSearchError" class="mt-3 text-sm text-red-600">
          {{ apiSearchError }}
        </p>

        <p v-if="apiSearchResults.length > 0" class="mt-3 text-sm">
          Found {{ apiSearchResults.length }} games!
        </p>

        <!-- GameBrain Search Results -->
        <div
          v-if="apiSearchResults.length > 0"
          class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <div
            v-for="game in apiSearchResults"
            :key="game.id"
            class="overflow-hidden rounded-xl bg-white p-4 shadow-sm"
          >
            <img
              v-if="game.image"
              :src="game.image"
              :alt="game.name"
              class="mb-4 h-40 w-full rounded-lg object-cover"
            />

            <h3 class="mb-2 font-bold">
              {{ game.name }}
            </h3>

            <p class="mb-1 text-sm">Genre: {{ game.genre || 'Unknown' }}</p>

            <p class="mb-4 text-sm">Year: {{ game.year || 'Unknown' }}</p>

            <button
              type="button"
              class="rounded-lg bg-pink-300 px-4 py-2 font-semibold hover:bg-pink-400"
              @click="addApiGame(game)"
            >
              Add to Vault
            </button>
          </div>
        </div>
      </div>

      <div class="mb-4 flex flex-wrap gap-3">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search for a game..."
          class="min-w-0 flex-1 rounded-lg border border-sky-200 bg-white px-5 py-3 outline-none focus:border-pink-300"
        />

        <button
          type="button"
          class="rounded-lg bg-sky-200 px-6 py-3 font-semibold hover:bg-sky-300"
        >
          Search
        </button>

        <button
          type="button"
          @click="showAddGameForm = !showAddGameForm"
          class="rounded-lg bg-purple-200 px-6 py-3 font-semibold hover:bg-purple-300"
        >
          Add Game
        </button>
      </div>

      <div
        v-if="showAddGameForm"
        class="mb-8 rounded-xl border border-purple-200 bg-white p-6"
      >
        <h2 class="mb-4 text-xl font-bold">Add a Game to Your Vault</h2>

        <div class="mb-4">
          <label for="gameTitle" class="mb-2 block font-semibold">
            Game Title
          </label>

          <input
            id="gameTitle"
            v-model="newGameTitle"
            type="text"
            placeholder="Enter a game title..."
            class="w-full rounded-lg border border-sky-200 bg-white px-4 py-3 outline-none focus:border-pink-300"
          />
        </div>

        <div class="mb-4">
          <label for="gameStatus" class="mb-2 block font-semibold">
            Game Status
          </label>

          <select
            id="gameStatus"
            v-model="newGameStatus"
            class="w-full rounded-lg border border-sky-200 bg-white px-4 py-3"
          >
            <option value="Want to Play">Want to Play</option>
            <option value="Currently Playing">Currently Playing</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <button
          type="button"
          @click="addGame"
          class="mr-3 rounded-lg bg-sky-200 px-5 py-2 font-semibold hover:bg-sky-300"
        >
          Save Game
        </button>

        <button
          type="button"
          @click="showAddGameForm = false"
          class="rounded-lg bg-pink-300 px-5 py-2 hover:bg-pink-400"
        >
          Close
        </button>
      </div>

      <div class="mb-8 flex flex-wrap gap-3">
        <button
          v-for="filter in filters"
          :key="filter"
          type="button"
          @click="selectedStatus = filter"
          :aria-pressed="selectedStatus === filter"
          class="rounded-lg px-5 py-2 transition hover:opacity-80"
          :class="[
            {
              'All Games': 'bg-sky-200',
              'Want to Play': 'bg-pink-300',
              'Currently Playing': 'bg-sky-100',
              Completed: 'bg-purple-200',
            }[filter],
            selectedStatus === filter
              ? 'ring-2 ring-slate-500 ring-offset-2'
              : '',
          ]"
        >
          {{ filter }}
        </button>
      </div>

      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="game in filteredGames"
          :key="game.id"
          class="rounded-xl border border-pink-200 bg-white p-3"
        >
          <div class="mb-4">
            <img
              v-if="game.image"
              :src="game.image"
              :alt="`${game.title} cover`"
              class="h-44 w-full rounded-lg object-cover"
            />

            <div
              v-else
              class="flex h-44 items-center justify-center rounded-lg bg-sky-100"
            >
              Game Cover
            </div>
          </div>

          <h2 class="mb-3 min-h-12 font-bold">
            {{ game.title }}
          </h2>

          <label
            :for="`status-${game.id}`"
            class="mb-2 block text-sm font-semibold"
          >
            Game Status
          </label>

          <select
            :id="`status-${game.id}`"
            v-model="game.status"
            class="mb-4 w-full rounded-lg border border-sky-200 px-3 py-2 text-sm outline-none"
            :class="{
              'bg-sky-100': game.status === 'Currently Playing',
              'bg-pink-300': game.status === 'Want to Play',
              'bg-purple-200': game.status === 'Completed',
            }"
          >
            <option value="Want to Play">Want to Play</option>
            <option value="Currently Playing">Currently Playing</option>
            <option value="Completed">Completed</option>
          </select>

          <button
            type="button"
            class="block w-full rounded-lg bg-pink-300 px-4 py-3 hover:bg-pink-400"
          >
            View Details
          </button>

          <button
            type="button"
            @click="removeGame(game)"
            class="mt-3 block w-full rounded-lg border border-pink-300 bg-white px-4 py-3 font-semibold text-pink-600 transition hover:bg-pink-100"
          >
            Remove Game
          </button>
        </div>
      </div>
    </div>
  </main>
</template>
