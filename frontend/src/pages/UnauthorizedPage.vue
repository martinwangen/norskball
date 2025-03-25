<template>
  <q-page padding class="flex flex-center">
    <div class="text-center">
      <q-icon name="lock" size="100px" color="negative" />
      <h4 class="q-mt-md q-mb-sm">Unauthorized Access</h4>
      <p class="text-grey-8 q-mb-lg">
        You don't have permission to access this page.
        Please contact an administrator if you believe this is an error.
      </p>
      <q-btn color="primary" label="Go to Home" to="/" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
// No additional logic needed
</script>
