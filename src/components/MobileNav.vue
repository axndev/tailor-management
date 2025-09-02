<script setup>
import { ref, watch, onUnmounted } from "vue";

const open = ref(false);
const buttons = ref([
  "Dashboard",
  "Customers",
  "Add New Customer",
  "Settings",
]);

// Watch for menu state changes and lock/unlock body scroll
watch(open, (val) => {
  document.body.style.overflow = val ? "hidden" : "";
});

// Cleanup in case component is unmounted while menu is open
onUnmounted(() => {
  document.body.style.overflow = "";
});
</script>

<template>
  <header
    class="px-6 py-5 lg:hidden bg-white shadow-md flex items-center justify-between relative"
  >
    <!-- Logo -->
    <router-link to="/" class="text-xl font-bold text-indigo-500">
      One Promise Stichting
    </router-link>

    <!-- Toggle Button -->
    <button
      @click="open = !open"
      class="relative w-10 h-10 flex items-center justify-center focus:outline-none"
    >
      <svg
        class="w-8 h-8 transition-transform duration-300"
        viewBox="0 0 24 24"
        fill="none"
        stroke="black"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <!-- Hamburger -->
        <path
          :class="[
            'transition-all duration-300',
            open ? 'opacity-0' : 'opacity-100',
          ]"
          d="M4 8H20M4 12H20M4 16H12"
        />
        <!-- Close X -->
        <path
          :class="[
            'transition-all duration-300',
            open ? 'opacity-100' : 'opacity-0',
          ]"
          d="M6 6L18 18M6 18L18 6"
        />
      </svg>
    </button>

    <!-- Mobile Navigation -->
    <transition name="fade">
      <aside
        v-if="open"
        class="fixed top-[72px] left-0 w-full h-screen bg-gray-50 z-20 flex flex-col p-6 space-y-4"
      >
        <RouterLink
          v-for="(label, index) in buttons"
          :key="index"
          :to="
            label === 'Dashboard'
              ? '/'
              : label === 'Add New Customer'
              ? '/customer/create'
              : '/' + label.toLowerCase().replace(/ /g, '-')
          "
          class="sideBtn px-4 py-3 rounded-lg text-lg font-medium text-gray-700 hover:bg-indigo-100 hover:text-indigo-600 transition"
          @click="open = false"
        >
          {{ label }}
        </RouterLink>
      </aside>
    </transition>
  </header>
</template>

<style>
/* Smooth fade for dropdown */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
