<template>
  <div class="row items-center justify-between">
    <div class="col-auto">
      <match-badge :color="getStatusColor(status)">
        {{ getStatusText(status) }}
      </match-badge>
      <match-badge v-if="status === Status.InProgress" color="red" class="q-ml-xs">
        {{ $t('matches.live') }}
      </match-badge>
    </div>

    <div v-if="isAdmin && editable" class="col-auto">
      <q-btn
        v-if="!isEditing"
        flat
        round
        color="primary"
        icon="edit"
        @click="startEditing"
      >
        <q-tooltip>{{ $t('matches.editDetails') }}</q-tooltip>
      </q-btn>

      <div v-else class="row items-center q-gutter-sm">
        <q-select
          v-model="editedStatus"
          :options="statusOptions"
          dense
          outlined
          class="col-auto"
          @update:model-value="updateStatus"
        />
        <q-btn
          flat
          round
          color="positive"
          icon="check"
          @click="saveChanges"
        >
          <q-tooltip>{{ $t('common.save') }}</q-tooltip>
        </q-btn>
        <q-btn
          flat
          round
          color="negative"
          icon="close"
          @click="cancelEditing"
        >
          <q-tooltip>{{ $t('common.cancel') }}</q-tooltip>
        </q-btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Status } from '../../gql/__generated__/graphql';
import MatchBadge from '../atoms/MatchBadge.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps<{
  status: Status;
  isAdmin?: boolean;
  editable?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:status', status: Status): void;
}>();

const isEditing = ref(false);
const editedStatus = ref(props.status);

// Get status text
const getStatusText = (status: Status): string => {
  switch (status) {
    case Status.Scheduled: return t('matches.status.scheduled');
    case Status.InProgress: return t('matches.status.live');
    case Status.Completed: return t('matches.status.finished');
    case Status.Postponed: return t('matches.status.postponed');
    case Status.Cancelled: return t('matches.status.cancelled');
    default: return t('common.unknown');
  }
};

// Get status color
const getStatusColor = (status: Status): string => {
  switch (status) {
    case Status.Scheduled: return 'blue';
    case Status.InProgress: return 'red';
    case Status.Completed: return 'green';
    case Status.Postponed: return 'orange';
    case Status.Cancelled: return 'grey';
    default: return 'grey';
  }
};

const statusOptions = computed(() =>
  Object.values(Status).map(status => ({
    label: getStatusText(status),
    value: status
  }))
);

const startEditing = () => {
  if (!props.editable) return;
  isEditing.value = true;
  editedStatus.value = props.status;
};

const saveChanges = () => {
  emit('update:status', editedStatus.value);
  isEditing.value = false;
};

const cancelEditing = () => {
  editedStatus.value = props.status;
  isEditing.value = false;
};

const updateStatus = (newStatus: Status) => {
  editedStatus.value = newStatus;
};
</script>

<style scoped>
.match-header {
  width: 100%;
}
</style>
