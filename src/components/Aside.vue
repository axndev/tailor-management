<script setup>
import { ref } from 'vue';

const buttons = ref([]);
buttons.value = ["Dashboard", "Customers", "Add New Customer", "Settings"]

</script>
<template>
    <aside
        class="flex flex-col bg-white h-screen border-r border-gray-200 text-gray-700 w-[20vw] justify-start items-start ">
        <h2 class="text-[22px] text-center font-bold bg-indigo-500 p-3 text-indigo-50 w-full">
            One Promise Stichting
        </h2>
        <div class="flex justify-start items-start  flex-col w-full border-t border-indigo-600 ">
            <RouterLink :to="label === 'Dashboard'
            ? '/'
            : label === 'Add New Customer'
                ? '/customer/create'
                : '/' + label" v-for="(label, index) in buttons" :key="index" class="sideBtn">
            {{ label }}
        </RouterLink>
        </div>
    </aside>
</template>
