<template>
  <div class="row no-wrap">
    <q-input ref="pickerDate" :rules="[validateDateTime]" :disable="disable"
      :class="[(hideBottomSlot ? 'hide-bottom-slot' : ''), (hideTimePart ? 'col-12' : 'col-7')]" stack-label
      :label="propsTs.label" v-model="datePart" :dense=isDense type="date" @focus="emit('hasFocus')" :readonly=readOnly
      :hint=datePartHint>
      <q-tooltip v-if="hideBottomSlot && pickerDate?.hasError == true" class="errorTooltip text-body2">{{ $t('common.error') }}</q-tooltip>
    </q-input>
    <q-input ref="pickerTime" stack-label class="col-5" :label="(propsTs.label == undefined ? undefined : '')" :disable="disable"
      :class="[hideBottomSlot ? 'hide-bottom-slot' : '']" v-model="timePart" :rules="[validateDateTime]" :dense=isDense
      type="time" v-if="!hideTimePart" @focus="emit('hasFocus')" :readonly=readOnly>
      <q-tooltip v-if="hideBottomSlot && pickerTime?.hasError == true" class="errorTooltip text-body2">{{ $t('common.error') }}</q-tooltip>
    </q-input>
  </div>
</template>


<style lang="scss">
.errorTooltip {
  background-color: red;
}

.hide-bottom-slot {
  .q-field__bottom {
    display: none;
  }

  padding: 0em;
}
</style>

<script setup lang="ts">
import type { PropType } from 'vue';
import { computed, ref } from 'vue';
import { QInput, date } from 'quasar';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const propsTs = defineProps({
  modelValue: {
    type: [String, Object] as PropType<string | null | undefined>,
    default: undefined
  },
  hideTimePart: {
    type: Boolean,
    default: false
  },
  preserveTimePrecision: {
    type: Boolean,
    default: false
  },
  debounceDelayMs: {
    type: Number,
    default: 0
  },
  label: {
    type: String,
    default: undefined
  },
  datePartHint: {
    type: String,
    default: undefined
  },
  supressValiation: {
    type: Boolean,
    default: false
  },
  isDense: {
    type: Boolean,
    default: true
  },
  readOnly: {
    type: Boolean,
    default: false
  },
  hideBottomSlot: {
    type: Boolean,
    default: false
  },
  disable: {
    type: Boolean,
    default: false
  }
});

const useSecondPrecision = false;

const emit = defineEmits<{
  (e: 'update:modelValue', val: string): void,
  (e: 'hasFocus'): void,
}>();

const pickerDate = ref<InstanceType<typeof QInput>>();
const pickerTime = ref<InstanceType<typeof QInput>>();

const validateComponent = () => {
  if (!pickerDate.value?.validate())
    return false;
  if (!propsTs.hideTimePart && !pickerTime.value?.validate())
    return false;
  return true;
};

defineExpose({
  validateComponent
});

function validateDateTime(value: string) {
  if (propsTs.supressValiation) return true;
  if (value == null || value == undefined)
    return t('common.error');
  const result = Date.parse(value);
  if (result == null || result == undefined)
    return t('common.error');
  return true;
}

const modelValue = computed({
  get() {
    if (propsTs.modelValue != undefined && propsTs.modelValue != null) {
      return propsTs.modelValue;
    }
    return "";
  },
  set(value) {
    if (value != undefined && value != null) {
      const dateStr = date.formatDate(Date.parse(value), 'YYYY-MM-DDTHH:mm:ss.SSSZ');
      emit('update:modelValue', dateStr);
    }
    else {
      emit('update:modelValue', "");
    }
  }
});

const timePart = computed({
  get() {
    if (modelValue.value != null && modelValue.value != undefined)
      return date.formatDate(Date.parse(modelValue.value), 'HH:mm');
    else
      return "";
  },
  set(value) {
    const dp = datePart.value == undefined ? date.formatDate(Date.now(), 'YYYY-MM-DD') : datePart.value;
    if (modelValue.value != null && modelValue.value != undefined && modelValue.value != '') {
      if (useSecondPrecision)
        modelValue.value = date.formatDate(Date.parse(dp + 'T' + value + date.formatDate(Date.parse(modelValue.value), ':ss.SSSZ')), 'YYYY-MM-DDTHH:mm:ss.SSSZ')
      else
        modelValue.value = date.formatDate(Date.parse(dp + 'T' + value + ':00.000' + date.formatDate(Date.parse(modelValue.value), 'Z')), 'YYYY-MM-DDTHH:mm:ss.SSSZ')
    }
    else {
      modelValue.value = date.formatDate(Date.parse(dp + 'T' + value + ':00.000Z'), 'YYYY-MM-DDTHH:mm:ss.SSSZ')
    }
  }
});

const datePart = computed({
  get() {
    if (modelValue.value != null && modelValue.value != undefined)
      return date.formatDate(Date.parse(modelValue.value), 'YYYY-MM-DD');
    else
      return date.formatDate(Date.parse(modelValue.value), 'YYYY-MM-DD');
  },
  set(value) {
    let tp = "";
    if (timePart.value == undefined) {
      if (propsTs.hideTimePart && !propsTs.preserveTimePrecision)
        tp = "00:00";
      else
        tp = date.formatDate(Date.now(), 'HH:mm');
    }
    else {
      tp = timePart.value;
    }

    if (modelValue.value != null && modelValue.value != undefined && modelValue.value != '') {
      if (useSecondPrecision)
        modelValue.value = date.formatDate(Date.parse(value + 'T' + tp + date.formatDate(Date.parse(modelValue.value), ':ss.SSSZ')), 'YYYY-MM-DDTHH:mm:ss.SSSZ')
      else
        modelValue.value = date.formatDate(Date.parse(value + 'T' + tp + ':00.000' + date.formatDate(Date.parse(modelValue.value), 'Z')), 'YYYY-MM-DDTHH:mm:ss.SSSZ')
    }
    else {
      modelValue.value = date.formatDate(Date.parse(value + 'T' + tp + ':00.000Z'), 'YYYY-MM-DDTHH:mm:ss.SSSZ')
    }
  }
});

</script>
