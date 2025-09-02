<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import Aside from './components/Aside.vue';
import MobileNav from './components/MobileNav.vue';
import LoginView from './views/LoginView.vue';

const route = useRoute();

// Compute whether we are on the login page
const isLoginPage = computed(() => route.path === '/login'); // assuming your route name is 'login'
</script>

<template>
  <main class="flex lg:flex-row flex-col lg:h-screen overflow-hidden">

    <!-- Always show login view -->
    <LoginView v-if="isLoginPage"/>

    <!-- Only show other components if NOT login page -->
    <template v-else>
      <MobileNav />
      <Aside class="hidden lg:flex"/>
      <router-view/>
      <Aside class="hidden lg:hidden"/>
    </template>

  </main>
</template>
