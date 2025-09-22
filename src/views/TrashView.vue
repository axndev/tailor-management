<script setup>
import { ref, computed, onMounted } from 'vue';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";

const customers = ref([]);
const loading = ref(true);

const customersCollection = collection(db, "customers");

// ✅ Fetch customers from Firestore
const savedCustomer = async () => {
    loading.value = true;
    try {
        const snapshot = await getDocs(customersCollection);
        const allCustomers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        customers.value = allCustomers
            .filter(c => c.isDeleted)
            .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    } catch (e) {
        console.log(e);
    } finally {
        loading.value = false;
    }
};

async function restoreCustomer(id) {
    try {
        const customerRef = doc(db, "customers", id);
        await updateDoc(customerRef, { isDeleted: false });
        await savedCustomer();
    } catch (e) {
        console.error("Error restoring customer:", e);
    }
}

async function deleteCustomer(id) {
    try {
        const customerRef = doc(db, "customers", id);
        await deleteDoc(customerRef);
        await savedCustomer();
    } catch (e) {
        console.error("Error deleting customer:", e);
    }
}

//  Searching & Filtering
const searchQuery = ref("");

const filteredCustomers = computed(() => {
    if (!searchQuery.value) return customers.value;
    return customers.value.filter(c =>
        c.name?.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});


// ✅ Pagination
const page = ref(1);
const perPage = 10;


const paginatedCustomers = computed(() => {
    const start = (page.value - 1) * perPage;
    return filteredCustomers.value.slice(start, start + perPage);
});

const totalPages = computed(() => Math.ceil(customers.value.length / perPage));
function nextPage() { if (page.value < totalPages.value) page.value++; }
function prevPage() { if (page.value > 1) page.value--; }

onMounted(savedCustomer);
</script>

<template>
    <div class="lg:p-10  p-5 w-full lg:w-[80vw] bg-gray-50 overflow-auto">

        <!-- Preloader -->
        <div v-if="loading" class="flex items-center justify-center h-screen w-full">
            <div class="loader border-4 border-blue-600 border-dashed rounded-full w-10 h-10 animate-spin"></div>
        </div>

        <!-- Main content -->
        <div v-else>
            <div class="flex items-center mb-5 lg:gap-10">
                <router-link to="/settings" class="z-10">
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
                <h2 class="lg:text-2xl text-xl text-gray-900 font-bold text-center w-full lg:w-auto -ml-5">Trash
                </h2>
            </div>
            <header
                class="lg:bg-white lg:p-3 rounded-lg flex justify-between items-center border-2 border-gray-100 gap-5">
                <div class="bg-gray-100 p-3 rounded flex-1 flex items-center justify-start gap-3 text-gray-600">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <input type="text" placeholder="Search customers in Trash"
                        class="outline-none w-full font-medium placeholder:text-gray-600" v-model="searchQuery">
                </div>
            </header>
            <div class="lg:mt-4">
                <div class="pt-5 ">
                    <div v-if="filteredCustomers.length > 0" class="flex flex-col gap-3">
                        <div class="flex justify-between flex-col lg:flex-row gap-4 bg-white text-gray-900 font-semibold p-4 rounded border-2 border-gray-100 cursor-pointer"
                            v-for="(customer, idx) in paginatedCustomers" :id="idx">
                            <span class="flex items-center gap-2">
                                <span
                                    class="bg-blue-600 text-white text-2xl w-11 h-11 flex justify-center items-center rounded-full">
                                    {{ customer.name.charAt(0).toUpperCase() }}
                                </span>
                                <span class="flex flex-col">
                                    <span :for="customer.id" class="md:text-lg text-md font-semibold">{{ customer.name
                                    }}{{
                                        }}</span>
                                    <span class="text-gray-600 text-sm">{{ customer.phone }}</span>
                                </span>
                            </span>
                            <div class="flex items-center justify-end gap-3">
                                <span @click="restoreCustomer(customer.id)"
                                    class="border-gray-200 border text-blue-600 w-8 h-8 text-[16px] hover:text-blue-700 flex rounded justify-center items-center">
                                    <i class="fa-solid fa-clock-rotate-left"></i>
                                </span>
                                <span @click="deleteCustomer(customer.id)"
                                    class="border-gray-200 border text-red-600 hover:text-red-700 w-8 h-8 text-[16px] flex rounded justify-center items-center"><i
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
            <div v-if="filteredCustomers.length > 10" class="flex justify-center items-center gap-3 mt-7">
                <button @click="prevPage" :disabled="page === 1"
                    class="cursor-pointer disabled:cursor-not-allowed disabled:opacity-30 flex justify-center items-center">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-7 h-7">
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                        <g id="SVGRepo_iconCarrier">
                            <path d="M15 6L9 12L15 18" stroke="#000" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                            </path>
                        </g>
                    </svg>
                </button>
                <span class="font-semibold text-gray-700">
                    {{ page }} of {{ totalPages }}
                </span>
                <button @click="nextPage" :disabled="page === totalPages"
                class="cursor-pointer disabled:cursor-not-allowed disabled:opacity-30 flex justify-center items-center">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-7 h-7">
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                        <g id="SVGRepo_iconCarrier">
                            <path d="M9 6L15 12L9 18" stroke="#000000" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                            </path>
                        </g>
                    </svg>
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
