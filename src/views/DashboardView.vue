<script setup>
import axios from 'axios';
import { onMounted, ref, computed } from 'vue';

const totalCustomers = ref([]);
const customers = ref([]);
const trashCustomers = ref({});
const API_URL = "https://tailor-management.onrender.com/";

const savedCustomer = async () => {
    try {
        const all = await axios.get(`${API_URL}/customers`);
        totalCustomers.value = all.data;

        const response = await axios.get(`${API_URL}/customers?isDeleted=false`);
        customers.value = response.data;

        const trashData = await axios.get(`${API_URL}/customers?isDeleted=true`)
        trashCustomers.value = trashData.data;
    } catch (e) {
        console.log(e);
    }
}

const monthlyCustomers = computed(() => {
  const now = new Date();
  return totalCustomers.value.filter(cust => {
    if (!cust.created_at) return false;
    const created = new Date(cust.created_at);
    return (
      created.getMonth() === now.getMonth() &&
      created.getFullYear() === now.getFullYear()
    );
  });
});


setInterval(savedCustomer, 100);
onMounted(savedCustomer);
</script>
<template>

    <div class="w-full lg:w-[80vw] md:p-10 p-5">
        <h2 class="text-2xl text-gray-600 font-bold">Dashboard</h2>
        <div class="flex justify-center items-center h-full w-full">
            <div class="grid grid-cols-1 md:grid-cols-2 w-full gap-6 p-6">

                <!-- Total Customers -->
                <div class="bg-white p-5 border-l-4 border-sky-500 rounded-lg shadow">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-600 text-sm font-medium">Total Customers</p>
                            <h3 class="text-3xl font-bold text-gray-800 my-5">{{ totalCustomers.length }}</h3>
                            <p class="text-green-500 text-xs font-medium mt-1">↑ {{monthlyCustomers.length}} this month</p>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 text-sky-500" fill="currentColor"
                            viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 
               0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                    </div>
                </div>

                <!-- Active Customers -->
                <div class="bg-white p-5 border-l-4 border-green-500 rounded-lg shadow">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-600 text-sm font-medium">Active Customers</p>
                            <h3 class="text-3xl font-bold text-gray-800 my-5">{{ customers.length }}</h3>
                            <p class="text-green-500 text-xs font-medium mt-1">✔ Stable</p>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 text-green-500" fill="currentColor"
                            viewBox="0 0 24 24">
                            <path d="M20.285 6.709l-11.606 11.607-5.657-5.657 
               1.414-1.414 4.243 4.243 10.192-10.192z" />
                        </svg>
                    </div>
                </div>

                <!-- Trashed Customers -->
                <div class="bg-white p-5 border-l-4 border-red-500 rounded-lg shadow">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-600 text-sm font-medium">Trashed Customers</p>
                            <h3 class="text-3xl font-bold text-gray-800 my-5">{{ trashCustomers.length }}</h3>
                            <p class="text-red-500 text-xs font-medium mt-1">🗑 Needs review</p>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 text-red-500" fill="currentColor"
                            viewBox="0 0 24 24">
                            <path fill-rule="evenodd"
                                d="M9 3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1h5a1 1 0 1 1 0 2h-1v15a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5H4a1 1 0 0 1 0-2h5zm-1 4a1 1 0 0 1 2 0v10a1 1 0 1 1-2 0V7zm6 0a1 1 0 0 1 2 0v10a1 1 0 1 1-2 0V7z"
                                clip-rule="evenodd" />
                        </svg>

                    </div>
                </div>

                <!-- New This Month -->
                <div class="bg-white p-5 border-l-4 border-indigo-500 rounded-lg shadow">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-600 text-sm font-medium">New This Month</p>
                            <h3 class="text-3xl font-bold text-gray-800 my-5">{{monthlyCustomers.length}}</h3>
                            <p class="text-green-500 text-xs font-medium mt-1">↑ Growing</p>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 text-indigo-500" fill="currentColor"
                            viewBox="0 0 24 24">
                            <path d="M3 17h2v-6H3v6zm4 0h2v-10H7v10zm4 0h2v-14h-2v14zm4 0h2v-8h-2v8zm4 
               0h2v-12h-2v12z" />
                        </svg>
                    </div>
                </div>

            </div>

        </div>
    </div>
</template>