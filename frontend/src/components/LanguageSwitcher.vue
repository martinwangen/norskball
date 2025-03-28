<template>
  <div class="language-switcher">
    <div
      v-for="loc in availableLocales"
      :key="loc.value"
      class="flag-container"
      :class="{ selected: currentLocale.value === loc.value }"
      @click="changeLocale(loc)"
    >
      <country-flag :country="loc.country" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import CountryFlag from 'vue-country-flag-next'
const { locale, t, availableLocales: i18nLocales } = useI18n()

// Debug logging
onMounted(() => {
  console.log('Current locale:', locale.value)
  console.log('Available locales:', i18nLocales)
})

const availableLocales = computed(() => [
  {
    label: t('languages.english'),
    value: 'en-US',
    country: 'GB' as const
  },
  {
    label: t('languages.norwegian'),
    value: 'nb-NO',
    country: 'NO' as const
  }
])

const currentLocale = computed({
  get: () => {
    const current = availableLocales.value.find(l => l.value === locale.value)
    console.log('Getting current locale:', current)
    return current || availableLocales.value[0]
  },
  set: (val) => {
    console.log('Setting locale to:', val.value)
    locale.value = val.value
  }
})

// Watch for locale changes
watch(locale, (newLocale) => {
  console.log('Locale changed to:', newLocale)
})

const changeLocale = (loc: { value: string }) => {
  console.log('Changing locale to:', loc.value)
  locale.value = loc.value
}
</script>

<style scoped>
.language-switcher {
  display: flex;
  gap: 8px;
  align-items: center;
}

.flag-container {
  cursor: pointer;
}

.flag-container:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.flag-container.selected {
  background-color: rgba(0, 0, 0, 0.1);
  box-shadow: 0 0 0 2px var(--q-primary);
}
</style>
