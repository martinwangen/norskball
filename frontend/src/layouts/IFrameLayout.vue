<template>
  <q-layout
    view="hHh lpR fFf"
    container
    style="height: 100vh;overflow: hidden;"
  >

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="bg-transparent text-white">
      <q-toolbar>
        <q-toolbar-title>
          <div class="text-caption">
            <img src="@/assets/miles-logo.svg" alt="Miles logo" style="height: 30px;">
          </div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
// No setup needed - theme will be inherited from system
</script>

<style lang="scss">
.q-toolbar {
  min-height: 60px;
}

/* Hide scrollbar for Chrome, Safari and Opera */
::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
* {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>
