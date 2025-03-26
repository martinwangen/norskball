<template>
  <q-layout
    view="hHh lpR fFf"
    container
    style="height: 100vh;"
  >
    <q-header class="bg-primary text-white">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Norskball
        </q-toolbar-title>

        <q-space />

        <!-- Dark Mode Toggle -->
        <q-btn
          flat
          round
          :icon="isDark ? 'dark_mode' : 'light_mode'"
          @click="toggleDarkMode"
          :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        >
          <q-tooltip>{{ isDark ? 'Switch to light mode' : 'Switch to dark mode' }}</q-tooltip>
        </q-btn>

        <div v-if="authStore.isAuthenticated" class="row items-center">
          <q-btn-dropdown flat :label="user?.name">
            <q-list>
              <q-item clickable v-close-popup @click="handleLogout">
                <q-item-section>
                  <q-item-label>Logout</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
        <q-btn v-else flat label="Login" @click="handleLogin" :loading="loading" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above :width="200" :breakpoint="500" bordered>
      <q-list>
        <q-item-label header class="text-grey-8">
          Navigation
        </q-item-label>

        <q-item clickable v-ripple to="/" exact>
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section>
            Home
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/teams" exact>
          <q-item-section avatar>
            <q-icon name="groups" />
          </q-item-section>
          <q-item-section>
            Teams
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/players" exact>
          <q-item-section avatar>
            <q-icon name="sports" />
          </q-item-section>
          <q-item-section>
            Players
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/matches" exact>
          <q-item-section avatar>
            <q-icon name="sports_soccer" />
          </q-item-section>
          <q-item-section>
            Matches
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/statistics" exact>
          <q-item-section avatar>
            <q-icon name="analytics" />
          </q-item-section>
          <q-item-section>
            Statistics
          </q-item-section>
        </q-item>

        <q-item v-if="authStore.isAuthenticated" clickable v-ripple to="/ratings" exact>
          <q-item-section avatar>
            <q-icon name="star" />
          </q-item-section>
          <q-item-section>
            Ratings
          </q-item-section>
        </q-item>

        <q-separator />

        <q-item-label header class="text-grey-8">
          Leagues
        </q-item-label>

        <q-item clickable v-ripple to="/leagues/eliteserien" exact>
          <q-item-section avatar>
            <q-icon name="emoji_events" />
          </q-item-section>
          <q-item-section>
            Eliteserien
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>
          <div class="text-caption">
            &copy; {{ new Date().getFullYear() }} Football Ratings App
          </div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { authService } from '../services/auth';
import { useAuthStore } from '../stores/auth';

const $q = useQuasar();
const authStore = useAuthStore();
const leftDrawerOpen = ref(false);
const loading = ref(false);
const { user } = authStore;
$q.dark.toggle();
const isDark = computed(() => $q.dark.isActive);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function toggleDarkMode() {
  $q.dark.toggle();
}

async function handleLogin() {
  loading.value = true;
  try {
    await authService.signIn();
  } catch (error) {
    console.error('Failed to sign in:', error);
    $q.notify({
      color: 'negative',
      message: error instanceof Error ? error.message : 'Failed to sign in',
      position: 'top',
      timeout: 5000,
    });
  } finally {
    loading.value = false;
  }
}

async function handleLogout() {
  await authService.signOut();
}

onMounted(async () => {
  try {
    await authService.initializeGoogleSignIn();
  } catch (error) {
    console.error('Failed to initialize Google Sign-In:', error);
    // Show error notification to user
    $q.notify({
      color: 'negative',
      message: error instanceof Error ? error.message : 'Failed to initialize Google Sign-In',
      position: 'top',
      timeout: 5000,
    });
  }
});
</script>

<style lang="scss">
.q-toolbar {
  min-height: 60px;
}
</style>
