
<script setup>
import { RouterLink } from "vue-router";

const buttons = [
  { label: "Dashboard", path: "/", icon: "fas fa-tachometer-alt" },
  { label: "Add New", path: "/customer/create", icon: "fas fa-user-plus" },
  { label: "Customers", path: "/customers", icon: "fas fa-users" },
  { label: "Settings", path: "/settings", icon: "fas fa-cog" },
];
</script>
<template>
  <aside class="bg-white border-gray-200 text-gray-700">
    <!-- Desktop Sidebar -->
    <div class="hidden lg:flex flex-col lg:h-screen lg:w-[20vw] justify-start items-start">
      <h2 class="text-[22px] text-center font-bold bg-indigo-500 p-3 text-indigo-50 w-full">
        One Promise Stichting
      </h2>
      <div class="flex flex-col w-full border-t border-indigo-600">
        <RouterLink
          v-for="(item, index) in buttons"
          :key="index"
          :to="item.path"
          class="sideBtn flex items-center gap-2 px-4 py-3 hover:bg-indigo-100 transition rounded"
        >
          <i :class="item.icon"></i>
          {{ item.label }}
        </RouterLink>
      </div>
    </div>

    <!-- Mobile Bottom Nav -->
    <div class="fixed bottom-0 left-0 w-full lg:hidden bg-white border-t border-gray-300 grid  grid-cols-4   shadow-lg z-50">
      <RouterLink
        v-for="(item, index) in buttons"
        :key="index"
        :to="item.path"
        class="flex sideBtn flex-col items-center transition p-3"
      >
        <i :class="item.icon + ' text-xl'"></i>
        <span class="text-xs mt-1">{{ item.label }}</span>
      </RouterLink>
    </div>
  </aside>
</template>



