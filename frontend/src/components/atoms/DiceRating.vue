<template>
  <div class="dice-rating">
    <q-icon
      :name="`casino`"
      :color="color"
      size="24px"
      :class="{ 'cursor-pointer': editable }"
      @click="toggleRating"
    >
      <q-tooltip>
        {{ rating || 'Click to rate' }}
      </q-tooltip>
    </q-icon>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  modelValue?: number;
  editable?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void;
}>();

const rating = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const color = computed(() => {
  if (!rating.value) return 'grey';
  return 'primary';
});

const toggleRating = () => {
  if (!props.editable) return;
  if (!rating.value) {
    rating.value = 1;
  } else if (rating.value < 6) {
    rating.value++;
  } else {
    rating.value = 1;
  }
};
</script>

<style scoped>
.dice-rating {
  display: inline-flex;
  align-items: center;
}
</style>
