<template>
  <q-page class="q-pa-md">
    <div v-if="loading" class="full-width full-height flex flex-center">
      <q-spinner color="primary" size="3em" />
    </div>
    <div v-else-if="!team" class="text-center q-pa-md">
      <p class="text-h5">Team not found</p>
    </div>
    <div v-else>
      <!-- Team Header -->
      <div class="row items-center q-mb-lg">
        <q-avatar size="100px" class="q-mr-md">
          <img :src="team.logo" :alt="team.name">
        </q-avatar>
        <div>
          <h1 class="text-h4 q-mb-sm">{{ team.name }}</h1>
        </div>
      </div>

      <!-- Team Stats -->
      <div class="row q-col-gutter-md q-mb-lg">
        <div class="col-12 col-sm-4">
          <q-card>
            <q-card-section>
              <div class="text-h6">Squad Size</div>
              <div class="text-h4">{{ players.length }}</div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Squad Section -->
      <div class="q-mb-lg">
        <h2 class="text-h5 q-mb-md">Squad</h2>
        <q-table
          :rows="players"
          :columns="[
            { name: 'name', label: 'Name', field: 'name', align: 'left' },
            { name: 'position', label: 'Position', field: 'position', align: 'center' },
            { name: 'rating', label: 'Rating', field: 'rating', align: 'center' }
          ]"
          row-key="id"
          flat
          bordered
        >
          <template v-slot:body-cell-name="props">
            <q-td :props="props">
              <div class="row items-center">
                <q-avatar size="32px" class="q-mr-sm">
                  <img :src="props.row.image_url" :alt="props.row.name">
                </q-avatar>
                {{ props.row.name }}
              </div>
            </q-td>
          </template>
          <template v-slot:body-cell-rating="props">
            <q-td :props="props">
              <q-chip
                :color="(props.row.rating || 0) >= 7 ? 'positive' : (props.row.rating || 0) >= 6 ? 'warning' : 'negative'"
                text-color="white"
                size="sm"
              >
                {{ (props.row.rating || 0).toFixed(1) }}
              </q-chip>
            </q-td>
          </template>
        </q-table>
      </div>

    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTeamStore } from '../stores/teams';

const route = useRoute();
const router = useRouter();
const teamStore = useTeamStore();

const team_id = computed(() => route.params.id as string);
const team = computed(() => teamStore.getTeamById(team_id.value));
const players = computed(() => team.value?.players || []);
const loading = computed(() => teamStore.isLoading);

async function loadData() {
  try {
    await teamStore.fetchTeamById(team_id.value);
  } catch (err) {
    console.error('Error loading data:', err);
    void router.push('/404');
  }
}

// Fetch data when component mounts
onMounted(() => {
  void loadData();
});
</script>

<style scoped>

.team-detail {
  animation: fade-in 0.5s ease-in-out;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
