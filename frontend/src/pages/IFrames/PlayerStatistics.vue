<template>
  <q-page class="q-pa-md">
    <div class="text-h4 q-mb-md">Player Statistics</div>

    <q-card>
      <q-card-section>
        <q-table
          :rows="players"
          :columns="columns"
          row-key="id"
          flat
          bordered
          :pagination="{
            rowsPerPage: 25,
            sortBy: 'goals',
            descending: true
          }"
          :sort-method="customSort"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Player {
  id: number;
  name: string;
  team: string;
  position: string;
  matches: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  avgRating: number;
}

const columns = [
  {
    name: 'name',
    label: 'Player',
    field: 'name',
    align: 'left' as const,
    sortable: true
  },
  {
    name: 'team',
    label: 'Team',
    field: 'team',
    align: 'left' as const,
    sortable: true
  },
  {
    name: 'position',
    label: 'Pos',
    field: 'position',
    align: 'center' as const,
    sortable: true
  },
  {
    name: 'matches',
    label: 'Matches',
    field: 'matches',
    align: 'center' as const,
    sortable: true
  },
  {
    name: 'goals',
    label: 'Goals',
    field: 'goals',
    align: 'center' as const,
    sortable: true
  },
  {
    name: 'assists',
    label: 'Assists',
    field: 'assists',
    align: 'center' as const,
    sortable: true
  },
  {
    name: 'yellowCards',
    label: 'Yellow Cards',
    field: 'yellowCards',
    align: 'center' as const,
    sortable: true
  },
  {
    name: 'redCards',
    label: 'Red Cards',
    field: 'redCards',
    align: 'center' as const,
    sortable: true
  },
  {
    name: 'avgRating',
    label: 'Avg Rating',
    field: 'avgRating',
    align: 'center' as const,
    sortable: true,
    format: (val: number) => val.toFixed(1)
  }
];

const players = ref<Player[]>([
  {
    id: 1,
    name: 'Erling Haaland',
    team: 'Manchester City',
    position: 'ST',
    matches: 28,
    goals: 25,
    assists: 5,
    yellowCards: 2,
    redCards: 0,
    avgRating: 8.2
  },
  {
    id: 2,
    name: 'Martin Ødegaard',
    team: 'Arsenal',
    position: 'CAM',
    matches: 29,
    goals: 8,
    assists: 12,
    yellowCards: 3,
    redCards: 0,
    avgRating: 7.8
  },
  {
    id: 3,
    name: 'Alexander Sørloth',
    team: 'Villarreal',
    position: 'ST',
    matches: 27,
    goals: 15,
    assists: 4,
    yellowCards: 4,
    redCards: 0,
    avgRating: 7.5
  },
  {
    id: 4,
    name: 'Fredrik Aursnes',
    team: 'Benfica',
    position: 'CM',
    matches: 26,
    goals: 3,
    assists: 6,
    yellowCards: 5,
    redCards: 1,
    avgRating: 7.2
  },
  {
    id: 5,
    name: 'Sander Berge',
    team: 'Burnley',
    position: 'CM',
    matches: 25,
    goals: 2,
    assists: 4,
    yellowCards: 6,
    redCards: 0,
    avgRating: 6.8
  },
  {
    id: 6,
    name: 'Kristian Thorstvedt',
    team: 'Sassuolo',
    position: 'CAM',
    matches: 24,
    goals: 6,
    assists: 3,
    yellowCards: 3,
    redCards: 0,
    avgRating: 7.0
  },
  {
    id: 7,
    name: 'Ole Selnæs',
    team: 'Rosenborg',
    position: 'CDM',
    matches: 22,
    goals: 1,
    assists: 2,
    yellowCards: 7,
    redCards: 1,
    avgRating: 6.9
  },
  {
    id: 8,
    name: 'Morten Thorsby',
    team: 'Genoa',
    position: 'CM',
    matches: 23,
    goals: 2,
    assists: 3,
    yellowCards: 8,
    redCards: 0,
    avgRating: 6.7
  }
]);

// Custom sort function to handle numeric values properly
const customSort = (rows: Player[], sortBy: string, descending: boolean) => {
  return [...rows].sort((a, b) => {
    const aValue = a[sortBy as keyof Player];
    const bValue = b[sortBy as keyof Player];

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return descending ? bValue - aValue : aValue - bValue;
    }

    return descending
      ? String(bValue).localeCompare(String(aValue))
      : String(aValue).localeCompare(String(bValue));
  });
};
</script>
