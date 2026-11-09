<script setup>
import { ref, computed, watch } from 'vue'

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
          <div
            class="mb-3 flex h-44 items-center justify-center rounded-lg bg-sky-100"
          >
            Game Cover
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
