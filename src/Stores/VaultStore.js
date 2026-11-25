import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useVaultStore = defineStore('vault', () => {
  const games = ref([])

  try {
    const savedGames = JSON.parse(
      localStorage.getItem('gameConquestVault') || '[]',
    )

    if (Array.isArray(savedGames)) {
      games.value = savedGames
    }
  } catch (error) {
    console.error('Unable to load Vault games:', error)
  }

  watch(
    games,
    (updatedGames) => {
      localStorage.setItem('gameConquestVault', JSON.stringify(updatedGames))
    },
    { deep: true },
  )

  function addGame(game) {
    const alreadyAdded = games.value.some(
      (savedGame) =>
        savedGame.id === game.id ||
        savedGame.title.toLowerCase() === game.title.toLowerCase(),
    )

    if (alreadyAdded) return false

    games.value.push(game)
    return true
  }

  function removeGame(gameId) {
    games.value = games.value.filter((game) => game.id !== gameId)
  }

  function updateStatus(gameId, status) {
    const game = games.value.find((game) => game.id === gameId)

    if (game) {
      game.status = status
    }
  }

  function updateGame(gameId, updatedDetails) {
    const game = games.value.find((item) => item.id === gameId)

    if (!game) return false

    Object.assign(game, {
      ...updatedDetails,
      id: game.id,
      status: game.status,
    })

    return true
  }

  return {
    games,
    addGame,
    removeGame,
    updateStatus,
    updateGame,
  }
})
