<template>
  <main class="min-h-screen bg-[#FFF8FB] px-6 py-16 text-[#475569]">
    <div class="mx-auto max-w-5xl text-center">
      <h1 class="mb-8 text-4xl font-bold md:text-5xl">
        Your Next Adventure Starts Here!
      </h1>

      <p class="mx-auto mb-10 max-w-2xl text-lg">
        Can't decide what to play? Game ConQuest can help you organize your game
        library, find your next adventure, and make the most of the games you
        have at home!
      </p>

      <div class="mb-16 flex flex-wrap justify-center gap-8">
        <RouterLink
          to="/vault"
          class="rounded-xl bg-sky-200 px-8 py-4 font-semibold transition hover:bg-sky-300"
        >
          My ConQuest Vault
        </RouterLink>

        <RouterLink
          to="/find"
          class="rounded-xl bg-pink-300 px-8 py-4 font-semibold transition hover:bg-pink-400"
        >
          Find My ConQuest
        </RouterLink>
      </div>

      <h2 class="mb-8 text-2xl font-bold">How Game ConQuest Works</h2>

      <div class="grid gap-6 md:grid-cols-3">
        <div class="rounded-xl bg-sky-200 p-6">
          <h3 class="mb-3 font-bold">1. Build Your Vault</h3>
          <p>Store and organize your games.</p>
        </div>

        <div class="rounded-xl bg-pink-300 p-6">
          <h3 class="mb-3 font-bold">2. Choose Your Quest</h3>
          <p>Tell us what you're in the mood for.</p>
        </div>

        <div class="rounded-xl bg-purple-200 p-6">
          <h3 class="mb-3 font-bold">3. Start Playing</h3>
          <p>Get a recommendation from your library.</p>
        </div>
      </div>
    </div>
  </main>
</template>
