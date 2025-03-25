<template>
  <q-page padding>
    <div class="q-pa-md">
      <div class="text-h4 q-mb-md">Teams</div>

      <div v-if="loading" class="flex justify-center q-pa-xl">
        <q-spinner color="primary" size="3em" />
      </div>

      <div v-else-if="error" class="text-negative q-pa-md">
        {{ error }}
      </div>

      <div v-else>
        <q-table
          :rows="tableRows"
          :columns="columns"
          :loading="loadingMore"
          row-key="id"
          :pagination="{
            rowsPerPage: 16,
            rowsNumber: totalCount
          }"
          @row-click="onRowClick"
        >
          <template v-slot:body-cell-team="props">
            <q-td :props="props">
              <div class="row items-center">
                <q-avatar hight="32px" class="q-mr-sm">
                  <img :src="props.row.logo" :alt="props.row.name">
                </q-avatar>
                <div>{{ props.row.name }}</div>
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-avgRating="props">
            <q-td :props="props">
              <q-chip
                :color="getRatingColor(props.value)"
                text-color="white"
                size="sm"
              >
                {{ props.value }}
              </q-chip>
            </q-td>
          </template>

          <template v-slot:bottom>
            <div v-if="hasNextPage" class="full-width text-center q-pa-sm">
              <q-btn
                color="primary"
                label="Load More"
                :loading="loadingMore"
                @click="loadMore"
              />
            </div>
          </template>
        </q-table>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import type { Team } from '../gql/__generated__/graphql';
import { teamService } from '../services/teamService';

const router = useRouter();
const loadingMore = ref(false);
const error = ref<string | null>(null);

// Use the teams query composable
const { teams, loading, refetch } = teamService.useTeams(16);

const tableRows = computed(() => teams.value?.teams.nodes || []);
const hasNextPage = computed(() => teams.value?.teams.pageInfo.hasNextPage || false);
const totalCount = computed(() => teams.value?.teams.totalCount || 0);

const columns = [
  {
    name: 'team',
    label: 'Team',
    field: 'name',
    align: 'left' as const,
    sortable: true
  },
  {
    name: 'league',
    label: 'League',
    field: 'league',
    align: 'left' as const,
    sortable: true
  }
];

const loadMore = async () => {
  if (!hasNextPage.value || loadingMore.value) return;

  loadingMore.value = true;
  try {
    await refetch({
      first: 20,
      after: teams.value?.teams.pageInfo.endCursor
    });
  } finally {
    loadingMore.value = false;
  }
};

const getRatingColor = (rating: number) => {
  if (rating >= 7) return 'positive';
  if (rating >= 6) return 'warning';
  return 'negative';
};

const onRowClick = (evt: Event, row: Team) => {
  void router.push(`/teams/${row.id}`);
};
</script>

<style scoped>
.q-table__card {
  box-shadow: none;
  border: 1px solid rgba(0, 0, 0, 0.12);
}
</style>
