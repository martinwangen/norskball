<template>
  <q-page class="q-pa-md">
    <div class="text-h4 q-mb-md">Team Statistics</div>

    <q-card class="q-mb-md">
      <q-card-section>
        <div class="row items-center">
          <div class="col-auto">
            <q-avatar size="100px">
              <img src="https://cdn.quasar.dev/img/avatar.png">
            </q-avatar>
          </div>
          <div class="col q-ml-md">
            <div class="text-h6">Manchester City</div>
            <div class="text-subtitle1">Premier League 2023/24</div>
            <div class="text-caption">Current Position: 1st</div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">League Statistics</div>
            <q-table
              :rows="leagueStats"
              :columns="leagueColumns"
              row-key="id"
              flat
              bordered
              :pagination="{ rowsPerPage: 0 }"
            />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">Form Guide</div>
            <q-table
              :rows="formGuide"
              :columns="formColumns"
              row-key="id"
              flat
              bordered
              :pagination="{ rowsPerPage: 0 }"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const leagueColumns = [
  { name: 'metric', label: 'Metric', field: 'metric', align: 'left' as const },
  { name: 'value', label: 'Value', field: 'value', align: 'center' as const }
];

const leagueStats = ref([
  {
    id: 1,
    metric: 'Matches Played',
    value: '29'
  },
  {
    id: 2,
    metric: 'Wins',
    value: '21'
  },
  {
    id: 3,
    metric: 'Draws',
    value: '5'
  },
  {
    id: 4,
    metric: 'Losses',
    value: '3'
  },
  {
    id: 5,
    metric: 'Goals Scored',
    value: '68'
  },
  {
    id: 6,
    metric: 'Goals Conceded',
    value: '24'
  },
  {
    id: 7,
    metric: 'Clean Sheets',
    value: '12'
  }
]);

const formColumns = [
  { name: 'opponent', label: 'Opponent', field: 'opponent', align: 'left' as const },
  { name: 'result', label: 'Result', field: 'result', align: 'center' as const },
  { name: 'score', label: 'Score', field: 'score', align: 'center' as const }
];

const formGuide = ref([
  {
    id: 1,
    opponent: 'Arsenal',
    result: 'W',
    score: '3-1'
  },
  {
    id: 2,
    opponent: 'Manchester United',
    result: 'W',
    score: '3-0'
  },
  {
    id: 3,
    opponent: 'Liverpool',
    result: 'D',
    score: '1-1'
  },
  {
    id: 4,
    opponent: 'Brighton',
    result: 'W',
    score: '2-0'
  },
  {
    id: 5,
    opponent: 'Aston Villa',
    result: 'W',
    score: '4-1'
  }
]);
</script>
