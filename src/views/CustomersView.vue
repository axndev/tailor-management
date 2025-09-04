<script setup>
import { ref, computed, onMounted } from 'vue';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";

const customers = ref([]);
const trashCustomers = ref([]);
const trash = ref(false);

const loading = ref(true); // ✅ Preloader state

const bulkAction = ref("");
const selectedCustomers = ref([]);

const customersCollection = collection(db, "customers");

const savedCustomer = async () => {
    loading.value = true; // show loader
    try {
        const snapshot = await getDocs(customersCollection);
        const allCustomers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        customers.value = allCustomers
            .filter(c => !c.isDeleted)
            .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

        trashCustomers.value = allCustomers
            .filter(c => c.isDeleted)
            .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    } catch (e) {
        console.log(e);
    } finally {
        loading.value = false; // hide loader
    }
};

// other functions remain unchanged
async function trashCustomer(id) { /* ... */ }
async function restoreCustomer(id) { /* ... */ }
async function deleteCustomer(id) { /* ... */ }
function toggleTrash() { /* ... */ }
function applyBulkAction() { /* ... */ }

const searchQuery = ref("");
const filteredCustomers = computed(() => customers.value.filter(c =>
    c.name.toLowerCase().includes(searchQuery.value.toLowerCase())
));
const filteredTrashCustomers = computed(() => trashCustomers.value.filter(c =>
    c.name.toLowerCase().includes(searchQuery.value.toLowerCase())
));

const page = ref(1);
const perPage = 10;

const activeList = computed(() => trash.value ? filteredTrashCustomers.value : filteredCustomers.value);
const selectedFilter = ref("all");

const filteredActiveList = computed(() => {
    const now = new Date();
    return activeList.value.filter(cust => {
        if (!cust.created_at) return true;
        const created = new Date(cust.created_at);
        switch (selectedFilter.value) {
            case "today": return created.toDateString() === now.toDateString();
            case "week": const weekAgo = new Date(); weekAgo.setDate(now.getDate() - 7); return created >= weekAgo;
            case "month": return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
            case "new": const threeDaysAgo = new Date(); threeDaysAgo.setDate(now.getDate() - 3); return created >= threeDaysAgo;
            default: return true;
        }
    });
});

const paginatedCustomers = computed(() => {
    const start = (page.value - 1) * perPage;
    return filteredActiveList.value.slice(start, start + perPage);
});

const totalPages = computed(() => Math.ceil(filteredActiveList.value.length / perPage));
function nextPage() { if (page.value < totalPages.value) page.value++; }
function prevPage() { if (page.value > 1) page.value--; }

onMounted(savedCustomer);
</script>

<template>
    <div class="lg:p-10  p-5 w-full lg:w-[80vw] flex flex-col gap-5 bg-gray-50">

        <!-- Preloader -->
        <div v-if="loading" class="flex items-center justify-center h-screen w-full">
            <div class="loader border-4 border-blue-600 border-dashed rounded-full w-10 h-10 animate-spin"></div>
        </div>

        <!-- Main content -->
        <div v-else>
            <div class="flex items-center mb-5 lg:gap-10">
                <router-link to="/" class="z-10">
                    <span>
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                        class="lg:w-6 lg:h-6 h-5 w-5 cursor-pointer">
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                        <g id="SVGRepo_iconCarrier">
                            <path d="M15 20L7 12L15 4" stroke="#000000" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round"></path>
                        </g>
                    </svg>
                    </span>
                </router-link>
                <h2 class="lg:text-2xl text-xl text-gray-900 font-bold text-center w-full lg:w-auto -ml-5">Customers
                </h2>
            </div>
            <header
                class="lg:bg-white lg:p-3 rounded-lg flex justify-between items-center border-2 border-gray-100 gap-5">
                <!-- <div class="items-center gap-3 hidden lg:flex">
                <label for="filter" class="font-medium text-gray-700">Filter by:</label>
                <select id="filter" v-model="selectedFilter"
                    class="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                    <option value="all">All</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="new">New (last 3 days)</option>
                </select>
            </div> -->
                <div class="bg-gray-100 p-3 rounded flex-1 flex items-center justify-start gap-3 text-gray-600">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <input type="text" placeholder="Search customers"
                        class="outline-none w-full font-medium placeholder:text-gray-600" v-model="searchQuery">
                </div>


                <div class="items-center gap-5 hidden lg:flex">
                    <router-link to="/customer/create" class="pr-btn hidden md:flex">Add New Customer</router-link>
                    <!-- <span @click="toggleTrash"
                    class=" text-indigo-500 text-xl relative w-7 h-7 flex justify-center items-center rounded-full cursor-pointer "><i
                        class="fa fa-trash">
                    </i>
                    <span
                        class="absolute -top-2 -right-2 bg-white shadow-lg  text-red-500 w-5 h-5 rounded-full flex justify-center items-center text-[10px] !font-extrabold">{{
                            trashCustomers.length
                                > 0 ? trashCustomers.length : 0 }}</span>

                </span> -->
                </div>
            </header>
            <div class="lg:mt-10">
                <!-- <div class="flex justify-between items-center mb-3 flex-col md:flex-row gap-5">
                    <div class="gap-2 items-center hidden lg:flex">
                        <select v-model="bulkAction" class="border rounded-lg p-2 text-sm">
                            <option value="">Select Action</option>
                            <option v-if="trash" value="selectAllTrash">Select All</option>
                            <option v-else value="selectAllCustomers">Select All</option>
                            <option value="clearSelection">Clear Selection</option>
                            <option v-if="trash" value="restore">Restore Selected</option>
                            <option v-else value="delete">Delete Selected</option>
                            <option v-if="trash" value="permanentDelete">Delete Permanently</option>
                        </select>
                        <button @click="applyBulkAction"
                            class="bg-indigo-500 cursor-pointer hover:bg-indigo-600 text-white px-4 py-2 rounded-lg">
                            Apply
                        </button>
                    </div>
                </div> -->
                <div v-if="trash == true" class="flex flex-col gap-3 overflow-y-auto h-full pt-5 ">
                    <div class="flex justify-between bg-white lg:bg-gray-100 text-gray-700 font-semibold hover:bg-gray-50 p-3 rounded shadow border border-transparent hover:border-indigo-500 cursor-pointer"
                        v-for="(customer, idx) in paginatedCustomers" :id="idx">
                        <span class="flex items-center gap-2">
                            <input type="checkbox" :checked="bulkAction == 'selectAllTrash'"
                                v-if="bulkAction !== '' && bulkAction !== 'clearSelection'" v-model="selectedCustomers"
                                :value="customer.id" class="h-4 w-4 text-indigo-500 rounded" :id="customer.id" />
                            <span class="md:text-lg text-md text-indigo-600">{{ idx + 1 }}. </span>
                            <label :for="customer.id" class="md:text-lg text-md font-semibold">{{ customer.name }}{{
                                }}</label>
                        </span>
                        <div class="flex gap-3 items-center">
                            <svg @click="restoreCustomer(customer.id)"
                                class="w-8 h-8 group stroke-green-500 group-hover:stroke-green-700" viewBox="0 0 25 25"
                                fill="none" xmlns="http://www.w3.org/2000/svg" stroke="">
                                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                <g id="SVGRepo_iconCarrier">
                                    <path class="stroke-green-500 group-hover:stroke-green-700"
                                        d="M5.88468 17C7.32466 19.1128 9.75033 20.5 12.5 20.5C16.9183 20.5 20.5 16.9183 20.5 12.5C20.5 8.08172 16.9183 4.5 12.5 4.5C8.08172 4.5 4.5 8.08172 4.5 12.5V13.5M12.5 8V12.5L15.5 15.5"
                                        stroke="" stroke-width="1.2"></path>
                                    <path d="M7 11L4.5 13.5L2 11" stroke="" stroke-width="1.2"></path>
                                </g>
                            </svg>
                            <span @click="deleteCustomer(customer.id)" :id="customer.isDeleted"
                                class="bg-red-500 hover:bg-red-600 w-7 h-7 flex justify-center items-center rounded-full cursor-pointer text-white"><i
                                    class="fa fa-trash"></i>
                            </span>
                        </div>
                    </div>
                    <span class="text-center flex justify-center items-center md:text-lg text-md"
                        v-if="trashCustomers.length < 1">Trash is Empty</span>
                </div>
                <div v-else class="overflow-y-auto h-full pt-5 ">
                    <div v-if="customers.length > 0" class="flex flex-col gap-3">
                        <div class="flex justify-between flex-col gap-4 bg-white text-gray-900 font-semibold p-4 rounded border-2 border-gray-100 cursor-pointer"
                            v-for="(customer, idx) in paginatedCustomers" :id="idx">
                            <span class="flex items-center gap-2">
                                <input :checked="bulkAction == 'selectAllCustomers'"
                                    v-if="bulkAction !== '' && bulkAction !== 'clearSelection'" type="checkbox"
                                    v-model="selectedCustomers" :value="customer.id"
                                    class="h-4 w-4 text-indigo-500 rounded" :id="customer.id" />
                                <span
                                    class="bg-blue-600 text-white text-2xl w-11 h-11 flex justify-center items-center rounded-full">
                                    {{ customer.name.charAt(0).toUpperCase() }}
                                </span>
                                <span class="flex flex-col">
                                    <label :for="customer.id" class="md:text-lg text-md font-semibold">{{ customer.name
                                        }}{{
                                        }}</label>
                                    <span class="text-gray-600 text-sm">{{ customer.phone }}</span>
                                </span>
                            </span>
                            <div class="flex items-center justify-end gap-3">
                                <router-link :to="`customer/${customer.id}/view`"
                                    class="border-gray-200 border text-blue-600 w-8 h-8 flex justify-center items-center rounded">
                                    <i class="fa-solid fa-eye"></i>
                                </router-link>
                                <router-link :to="`customer/${customer.id}/edit`"
                                    class="border-gray-200 border text-blue-600 w-8 h-8 text-[13px] flex rounded justify-center items-center">
                                    <i class="fa-solid fa-pencil"></i>
                                </router-link>
                                <span @click="trashCustomer(customer.id)"
                                    class="border-gray-200 border text-blue-600 w-8 h-8 text-[13px] flex rounded justify-center items-center"><i
                                        class="fa fa-trash"></i>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div v-else class="text-center flex justify-center items-center md:text-lg text-md">
                        Nothing Found
                    </div>
                </div>
            </div>
            <!-- Pagination controls -->
            <div v-if="activeList.length > 10" class="flex justify-center items-center gap-3 ">
                <button @click="prevPage" :disabled="page === 1"
                    class="px-3 py-1 rounded bg-gray-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50">
                    Prev
                </button>
                <span class="font-semibold">
                    Page {{ page }} of {{ totalPages }}
                </span>
                <button @click="nextPage" :disabled="page === totalPages"
                    class="px-3 py-1 rounded bg-gray-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50">
                    Next
                </button>
            </div>
        </div>
    </div>
</template>

<style>
/* Simple spinning loader */
.loader {
    border-top-color: transparent;
}
</style>
