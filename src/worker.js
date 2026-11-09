export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (url.pathname === '/api/health') {
      return Response.json({
        status: 'ok',
        message: 'Game ConQuest API is working!',
        gameBrainConfigured: Boolean(env.GAMEBRAIN_API_KEY),
      })
    }

    if (url.pathname === '/api/games') {
      const query = url.searchParams.get('query')?.trim()

      if (!query) {
        return Response.json(
          { error: 'Please enter a game name.' },
          { status: 400 },
        )
      }

      const gameBrainUrl = new URL('https://api.gamebrain.co/v1/games')
      gameBrainUrl.searchParams.set('query', query)
      gameBrainUrl.searchParams.set('limit', '10')

      try {
        const response = await fetch(gameBrainUrl, {
          headers: {
            'x-api-key': env.GAMEBRAIN_API_KEY,
          },
        })

        if (!response.ok) {
          return Response.json(
            { error: 'GameBrain search failed.' },
            { status: 502 },
          )
        }

        const data = await response.json()
        return Response.json(data)
      } catch {
        return Response.json(
          { error: 'Unable to connect to GameBrain.' },
          { status: 502 },
        )
      }
    }

    return env.ASSETS.fetch(request)
  },
}
