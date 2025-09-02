<script setup>
import axios from 'axios';
import { onMounted, ref, computed } from 'vue';

const customers = ref([]);
const trashCustomers = ref({});
const trash = ref(false);

const bulkAction = ref(""); // current action from dropdown
const selectedCustomers = ref([]); // track selected customers

const API_URL = "https://tailor-management.onrender.com";


const savedCustomer = async () => {
    try {
        const response = await axios.get(`${API_URL}/customers?isDeleted=false`);
        customers.value = response.data;

        const trashData = await axios.get(`${API_URL}/customers?isDeleted=true`)
        trashCustomers.value = trashData.data;
    } catch (e) {
        console.log(e);
    }
}

async function trashCustomer(id) {
    try {
        const customer = customers.value.find(c => c.id === id);
        if (!customer) return;
        await axios.patch(`${API_URL}/customers/${id}`, {
            isDeleted: true
        });;

        customers.value = customers.value.filter(customer => customer.id !== id);
        trashCustomers.value = customers.value.filter(customer => customer.isDeleted == true);
    } catch (e) {
        console.error("Failed to delete", e);
    }
}

async function restoreCustomer(id) {
    try {
        const customer = trashCustomers.value.find(c => c.id === id);
        if (!customer) return;
        await axios.patch(`${API_URL}/customers/${id}`, {
            isDeleted: false
        });;

        customers.value = customers.value.filter(customer => customer.id !== id);
        trashCustomers.value = customers.value.filter(customer => customer.isDeleted == true);
    } catch (e) {
        console.error("Failed to delete", e);
    }
}


async function deleteCustomer(id) {
    const confirmDelete = confirm("Are you sure you want to delete this customer?");
    if (!confirmDelete) return; // if user clicks cancel, stop here

    try {
        await axios.delete(`${API_URL}/customers/${id}`);
        console.log("Customer deleted successfully");
    } catch (e) {
        console.error("Failed to delete", e);
    }
}


function toggleTrash() {
    trash.value = !trash.value;
    bulkAction.value = ""
}

setInterval(savedCustomer, 100);
onMounted(savedCustomer);


function applyBulkAction() {
    if (!bulkAction.value) return;

    if (bulkAction.value === "selectAllCustomers") {
        selectedCustomers.value = customers.value.map(c => c.id);
        console.log(selectedCustomers.value);
    } else if (bulkAction.value === "selectAllTrash") {
        selectedCustomers.value = trashCustomers.value.map(c => c.id);
        console.log(selectedCustomers.value);
    } else if (bulkAction.value === "clearSelection") {
        selectedCustomers.value = [];
    } else if (bulkAction.value === "restore") {
        selectedCustomers.value.forEach(id => restoreCustomer(id));
        selectedCustomers.value = [];
    } else if (bulkAction.value === "delete") {
        selectedCustomers.value.forEach(id => trashCustomer(id));
        selectedCustomers.value = [];
    } else if (bulkAction.value === "permanentDelete") {
        selectedCustomers.value.forEach(id => deleteCustomer(id));
        selectedCustomers.value = [];
    }

}

const searchQuery = ref("");
// Filter customers list
const filteredCustomers = computed(() =>
    customers.value.filter(c =>
        c.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
);

// Filter trash customers list
const filteredTrashCustomers = computed(() =>
    trashCustomers.value.filter(c =>
        c.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
);

const page = ref(1); // current page
const perPage = 10; // items per page

const activeList = computed(() =>
    trash.value ? filteredTrashCustomers.value : filteredCustomers.value
);

const selectedFilter = ref("all");

const filteredActiveList = computed(() => {
    const now = new Date();

    return activeList.value.filter(cust => {
        if (!cust.created_at) return true; // skip if missing

        const created = new Date(cust.created_at);

        switch (selectedFilter.value) {
            case "today":
                return created.toDateString() === now.toDateString();

            case "week":
                const weekAgo = new Date();
                weekAgo.setDate(now.getDate() - 7);
                return created >= weekAgo;

            case "month":
                return (
                    created.getMonth() === now.getMonth() &&
                    created.getFullYear() === now.getFullYear()
                );

            case "new": // last 3 days
                const threeDaysAgo = new Date();
                threeDaysAgo.setDate(now.getDate() - 3);
                return created >= threeDaysAgo;

            default: // "all"
                return true;
        }
    });
});

// ✅ Use filteredActiveList instead of activeList
const paginatedCustomers = computed(() => {
    const start = (page.value - 1) * perPage;
    const end = start + perPage;
    return filteredActiveList.value.slice(start, end);
});

// ✅ Same for totalPages
const totalPages = computed(() =>
    Math.ceil(filteredActiveList.value.length / perPage)
);

// Actions
function nextPage() {
    if (page.value < totalPages.value) page.value++;
}
function prevPage() {
    if (page.value > 1) page.value--;
}

</script>

<template>
    <div class="lg:px-10 lg:py-5 p-5 w-full lg:w-[80vw] flex flex-col gap-5 bg-gray-50 ">
        <header class="bg-white p-3 rounded-lg flex justify-between items-center shadow gap-5">
            <span class="hidden lg:block">Total Customers: <strong>{{ customers.length }}</strong></span>
            <div class="flex items-center gap-3">
                <label for="filter" class="font-medium text-gray-700">Filter by:</label>
                <select id="filter" v-model="selectedFilter"
                    class="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                    <option value="all">All</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="new">New (last 3 days)</option>
                </select>
            </div>
            <div class="bg-indigo-50 p-2  border border-indigo-500 rounded flex-1 max-w-100 hover:shadow-lg">
                <input type="text" placeholder="Search customers..." class="outline-none w-full" v-model="searchQuery">
            </div>
            

            <div class="flex items-center gap-5">
                <router-link to="/customer/create" class="pr-btn hidden md:flex">Add New Customer</router-link>
                <span @click="toggleTrash"
                    class=" text-indigo-500 text-xl relative w-7 h-7 flex justify-center items-center rounded-full cursor-pointer "><i
                        class="fa fa-trash">
                    </i>
                    <span
                        class="absolute -top-2 -right-2 bg-white shadow-lg  text-red-500 w-5 h-5 rounded-full flex justify-center items-center text-[10px] !font-extrabold">{{
                            trashCustomers.length
                                > 0 ? trashCustomers.length : 0 }}</span>

                </span>
            </div>
        </header>
        <div class="bg-white rounded-2xl shadow p-6 overflow-hidden">
            <div class="flex justify-between items-center mb-3 flex-col md:flex-row gap-5">
                <h3 class="text-2xl font-semibold">{{ trash ? 'Recycle Bin' : 'Customers' }}</h3>
                <div class="flex gap-2 items-center">
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
            </div>
            <div v-if="trash == true" class="flex flex-col gap-3 overflow-y-auto h-full pt-5 lg:pb-13 ">
                <div class="flex justify-between bg-gray-100 text-gray-700 font-semibold hover:bg-gray-50 p-3 rounded shadow border border-transparent hover:border-indigo-500 cursor-pointer"
                    v-for="(customer, idx) in paginatedCustomers" :id="idx">
                    <span class="flex items-center gap-2">
                        <input type="checkbox" :checked="bulkAction == 'selectAllTrash'"
                            v-if="bulkAction !== '' && bulkAction !== 'clearSelection'" v-model="selectedCustomers"
                            :value="customer.id" class="h-4 w-4 text-indigo-500 rounded" :id="customer.id" />
                        <span class="md:text-lg text-md">{{ idx + 1 }}. </span>
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
            <div v-else class="overflow-y-auto h-full pt-5 lg:pb-13 ">
                <div v-if="customers.length > 0" class="flex flex-col gap-3">
                    <div class="flex justify-between bg-gray-100 text-gray-700 font-semibold hover:bg-gray-50 p-3 rounded shadow border border-transparent hover:border-indigo-500 cursor-pointer"
                        v-for="(customer, idx) in paginatedCustomers" :id="idx">
                        <span class="flex items-center gap-2">
                            <input :checked="bulkAction == 'selectAllCustomers'"
                                v-if="bulkAction !== '' && bulkAction !== 'clearSelection'" type="checkbox"
                                v-model="selectedCustomers" :value="customer.id" class="h-4 w-4 text-indigo-500 rounded"
                                :id="customer.id" />

                            <span class="md:text-lg text-md">{{ (page - 1) * perPage + idx + 1 }}.</span>
                            <label :for="customer.id" class="md:text-lg text-md font-semibold">{{ customer.name }}{{
                                }}</label>
                        </span>
                        <div class="flex items-center gap-3">
                            <router-link :to="`customer/${customer.id}/view`"
                                class="bg-indigo-500 hover:bg-indigo-600 text-white w-7 h-7 flex justify-center items-center rounded-full cursor-pointer">
                                <i class="fa-solid fa-eye"></i>
                            </router-link>
                            <router-link :to="`customer/${customer.id}/edit`"
                                class="bg-yellow-600 hover:bg-yellow-700 text-[13px] text-white w-7 h-7 flex justify-center items-center rounded-full cursor-pointer">
                                <i class="fa-solid fa-pencil"></i>
                            </router-link>
                            <span @click="trashCustomer(customer.id)"
                                class="bg-red-500 hover:bg-red-600  w-7 h-7 flex justify-center items-center rounded-full cursor-pointer text-white"><i
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
</template>