<script setup>
import Aside from './components/Aside.vue'
import MobileNav from './components/MobileNav.vue';
</script>


<template>
  <main class="flex lg:flex-row flex-col lg:h-screen  overflow-hidden">
    <MobileNav />
    <Aside class="hidden lg:flex"/>
    <router-view/>
    <Aside class="hidden lg:hidden"/>
  </main>
</template>


<style scoped></style>