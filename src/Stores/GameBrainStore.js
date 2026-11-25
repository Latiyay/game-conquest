import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGameBrainStore = defineStore('gameBrain', () => {
  const gameDetails = ref({})
  const isLoading = ref(false)
  const apiError = ref('')

  function normalizeGame(game) {
    return {
      id: `gamebrain-${game.id}`,
      gameBrainId: game.id,
      source: 'gamebrain',
      title: game.name,
      status: 'Want to Play',
      image: game.image || '',
      link: game.link || '',
      genre: game.genre || '',
      genres: game.genres?.map((item) => item.value) || [],
      platforms: game.platforms?.map((item) => item.value) || [],
      themes: game.themes?.map((item) => item.value) || [],
      tags: game.tags?.map((item) => item.value) || [],
      playModes: game.play_modes?.map((item) => item.value) || [],
      playtime: game.playtime?.median ?? null,
      energyLevel: '',
      experiences: [],
      description: game.short_description || game.description || '',
      rating: game.rating?.mean ?? null,
      year: game.release_date?.slice(0, 4) || game.year || '',
      detailsLoaded: true,
    }
  }

  async function getGameDetails(gameId) {
    if (!gameId) return null

    // Return cached details if they already exist
    if (gameDetails.value[gameId]) {
      return gameDetails.value[gameId]
    }

    isLoading.value = true
    apiError.value = ''

    try {
      const response = await fetch(
        `/api/game-detail?id=${encodeURIComponent(gameId)}`,
      )

      if (!response.ok) {
        throw new Error('Unable to retrieve game details.')
      }

      const data = await response.json()

      const normalizedGame = normalizeGame(data)

      gameDetails.value[gameId] = normalizedGame

      return normalizedGame
    } catch (error) {
      apiError.value = error.message
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    gameDetails,
    isLoading,
    apiError,
    getGameDetails,
    normalizeGame,
  }
})
