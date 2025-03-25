<template>
  <q-table
    :rows="props.players"
    :columns="columns"
    row-key="playerId"
    flat
    bordered
    :pagination="pagination"
    :loading="false"
    :rows-per-page-options="[10, 25, 50]"
    class="statistics-table"
  >
    <template v-slot:body-cell-averageRating="props">
      <q-td :props="props">
        <div class="row items-center justify-center">
          <q-rating
            v-model="props.row.averageRating"
            size="sm"
            :max="10"
            color="amber"
            icon="star_border"
            icon-selected="star"
            readonly
            class="q-mr-sm"
          />
          <span>{{ props.row.averageRating.toFixed(1) }}</span>
        </div>
      </q-td>
    </template>
  </q-table>
</template>

<script setup lang="ts">
interface PlayerStats {
  playerId: string
  playerName: string
  averageRating: number
  ratingCount: number
  matchesPlayed: number
}

const props = defineProps<{
  players: PlayerStats[]
}>()

const columns = [
  {
    name: 'playerName',
    required: true,
    label: 'Player',
    align: 'left' as const,
    field: 'playerName',
    sortable: true
  },
  {
    name: 'averageRating',
    required: true,
    label: 'Rating',
    align: 'center' as const,
    field: 'averageRating',
    sortable: true
  },
  {
    name: 'ratingCount',
    required: true,
    label: 'Ratings',
    align: 'center' as const,
    field: 'ratingCount',
    sortable: true
  },
  {
    name: 'matchesPlayed',
    required: true,
    label: 'Matches',
    align: 'center' as const,
    field: 'matchesPlayed',
    sortable: true
  }
]

const pagination = {
  rowsPerPage: 10,
  sortBy: 'averageRating',
  descending: true
}
</script>

<style lang="scss">
.statistics-table {
  .q-table__card {
    box-shadow: none;
  }

  .q-table__top {
    background-color: $grey-2;
  }

  .q-table__bottom {
    background-color: $grey-2;
  }
}
</style>
