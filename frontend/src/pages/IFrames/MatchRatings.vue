<template>
  <q-page class="q-pa-md">
    <div class="text-h4 q-mb-md">Match Ratings</div>

    <q-card class="q-mb-md">
      <q-card-section>
        <div class="row items-center justify-between">
          <div class="col-auto">
            <div class="text-h6">Manchester City</div>
            <div class="text-subtitle1">Home</div>
          </div>
          <div class="col-auto text-center">
            <div class="text-h4">3 - 1</div>
            <div class="text-caption">Premier League - Matchday 29</div>
          </div>
          <div class="col-auto text-right">
            <div class="text-h6">Arsenal</div>
            <div class="text-subtitle1">Away</div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-card>
      <q-card-section>
        <div class="text-h6">Player Ratings</div>
        <q-table
          :rows="ratings"
          :columns="columns"
          row-key="id"
          flat
          bordered
          :pagination="{ rowsPerPage: 0 }"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const columns = [
  { name: 'player', label: 'Player', field: 'player', align: 'left' as const },
  { name: 'position', label: 'Pos', field: 'position', align: 'center' as const },
  { name: 'rating', label: 'Rating', field: 'rating', align: 'center' as const },
  { name: 'minutes', label: 'Min', field: 'minutes', align: 'center' as const },
  { name: 'comment', label: 'Comment', field: 'comment', align: 'left' as const }
];

const ratings = ref([
  {
    id: 1,
    player: 'Erling Haaland',
    position: 'ST',
    rating: 9.0,
    minutes: 90,
    comment: 'Scored two goals and provided an assist. Dominant performance.'
  },
  {
    id: 2,
    player: 'Martin Ødegaard',
    position: 'CAM',
    rating: 7.5,
    minutes: 90,
    comment: 'Created several chances but couldn\'t convert them.'
  },
  {
    id: 3,
    player: 'Kevin De Bruyne',
    position: 'CAM',
    rating: 8.5,
    minutes: 85,
    comment: 'Masterful in midfield, assisted two goals.'
  },
  {
    id: 4,
    player: 'Bukayo Saka',
    position: 'RW',
    rating: 7.0,
    minutes: 90,
    comment: 'Scored Arsenal\'s only goal but was quiet otherwise.'
  },
  {
    id: 5,
    player: 'Rodri',
    position: 'CDM',
    rating: 8.0,
    minutes: 90,
    comment: 'Controlled the midfield and scored the winner.'
  }
]);
</script>
