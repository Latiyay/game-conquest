<template>
  <header class="bg-sky-200 px-6 py-5">
    <nav
      class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4"
    >
      <RouterLink to="/" class="text-2xl font-bold text-slate-600">
        Game ConQuest
      </RouterLink>

      <div class="flex flex-wrap gap-5 text-sm text-slate-600">
        <RouterLink to="/" class="hover:text-pink-500"> Home </RouterLink>

        <RouterLink to="/vault" class="hover:text-pink-500">
          My ConQuest Vault
        </RouterLink>

        <RouterLink to="/find" class="hover:text-pink-500">
          Find My ConQuest
        </RouterLink>

        <RouterLink to="/stats" class="hover:text-pink-500">
          ConQuest Stats
        </RouterLink>
      </div>
    </nav>
  </header>
</template>
