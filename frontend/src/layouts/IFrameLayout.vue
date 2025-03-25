<template>
  <q-layout
    view="hHh lpR fFf"
    container
    style="height: 100vh;"
  >

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>
          <div class="text-caption">
            &copy; {{ new Date().getFullYear() }} Football Ratings App
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
</style>
