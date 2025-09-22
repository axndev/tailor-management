<script setup>
import { ref, computed, onMounted } from "vue";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
import { app } from "@/firebase";
import { useRouter } from "vue-router";


const auth = getAuth(app);
const db = getFirestore(app);
const router = useRouter();

const loading = ref(true);
const totalCustomers = ref([]);
const customers = ref([]);
const trashCustomers = ref([]);




const logout = async () => {
    try {
        await signOut(auth);
        localStorage.removeItem("user");
        router.push("/login");
    } catch (error) {
        console.error("Logout failed", error);
    }
};

onMounted(async () => {
    try {
        const customersCollection = collection(db, "customers");

        const snapshot = await getDocs(customersCollection);
        totalCustomers.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const activeQuery = query(customersCollection, where("isDeleted", "==", false));
        const activeSnapshot = await getDocs(activeQuery);
        customers.value = activeSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const trashQuery = query(customersCollection, where("isDeleted", "==", true));
        const trashSnapshot = await getDocs(trashQuery);
        trashCustomers.value = trashSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    } catch (error) {
        console.error("Error fetching data:", error);
    } finally {
        loading.value = false;
    }
});

const monthlyCustomers = computed(() => {
    const now = new Date();
    return totalCustomers.value.filter(cust => {
        if (!cust.created_at) return false;
        const created = new Date(cust.created_at);
        return created.getMonth() === now.getMonth() &&
            created.getFullYear() === now.getFullYear();
    });
});
</script>

<template>
    <div class="w-full lg:w-[80vw] bg-gray-50 overflow-auto h-full lg:p-10  p-5 pb-20">
        <!-- Preloader -->
        <div v-if="loading" class="flex items-center justify-center h-screen w-full">
            <div class="loader border-4 border-blue-600 border-dashed rounded-full w-10 h-10 animate-spin"></div>
        </div>

        <!-- Dashboard Content -->
        <div v-else>
            <h2 class="text-xl lg:text-2xl text-gray-900 font-bold mb-5">Dashboard</h2>
            <div class="flex justify-start flex-col items-center w-full gap-5">
                <!-- Total Customers -->
                <div class="bg-white overflow-hidden  border-2 relative border-gray-100 rounded-lg w-full">
                    <div class="flex items-center justify-between p-5 mb-15">
                        <div>
                            <p class="text-gray-600 text-lg font-medium">Total Customers</p>
                            <h3 class="text-5xl font-bold text-gray-800 my-5">{{ totalCustomers.length }}</h3>

                            <p class="text-gray-600 text-lg font-medium mt-1">{{ monthlyCustomers.length }} this month</p>

                        </div>
                    </div>

                    <!-- Sparkline (no Chart.js, just SVG) -->
                    <div class="absolute bottom-0 left-0 w-full lg:h-50">
                        <svg viewBox="0 0 200 60" class=" text-blue-600" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stop-color="currentColor" stop-opacity="0.2" />
                                    <stop offset="100%" stop-color="currentColor" stop-opacity="0" />
                                </linearGradient>
                            </defs>

                            <!-- Fill -->
                            <path d="M0 40
           C40 10, 80 50, 120 20
           S160 30, 200 15
           L200 60 L0 60 Z" fill="url(#sparkFill)" transform="scale(1)" />

                            <!-- Line -->
                            <path d="M0 40
           C40 10, 80 50, 120 20
           S160 30, 200 15" fill="none" stroke="currentColor" stroke-width=".4" transform="scale(1)" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>

                    </div>
                </div>


                <div class="grid grid-cols-1 lg:grid-cols-2 w-full gap-5 ">

                    <!-- Active Customers -->
                    <div class="bg-white p-5 border-2 border-gray-100 rounded-lg ">
                        <div class="flex items-center justify-between">
                            <div class="flex justify-center items-center gap-3">
                                <span class="p-3 bg-blue-600 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-white"
                                        fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 
0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                    </svg>
                                </span>
                                <div>
                                    <router-link to="/customers"
                                        class="text-gray-900 font-semibold hover:underline">Active
                                        Customers</router-link>
                                    <p class="text-gray-600 font-medium mt-1">Stable</p>
                                </div>
                            </div>
                            <h3 class="text-3xl font-bold text-gray-800 my-5">{{ customers.length }}</h3>
                        </div>
                    </div>

                    <!-- Trashed Customers -->
                    <div class="bg-white p-5 border-2 border-gray-100 rounded-lg ">
                        <div class="flex items-center justify-between">
                            <div class="flex justify-center items-center gap-3">
                                <span class="p-3 bg-red-600 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-white"
                                        fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M9 3V4H4V6H5V20C5 21.1 5.9 22 7 22H17C18.1 22 
    19 21.1 19 20V6H20V4H15V3H9ZM7 6H17V20H7V6ZM9 8V18H11V8H9ZM13 
    8V18H15V8H13Z" />
                                    </svg>

                                </span>
                                <div>
                                    <router-link to="/trash" class="text-gray-900 font-semibold hover:underline">Trashed
                                        Customers</router-link>
                                    <p class="text-gray-600 font-medium mt-1">Needs review</p>
                                </div>
                            </div>
                            <h3 class="text-3xl font-bold text-gray-800 my-5">{{ trashCustomers.length }}</h3>
                        </div>
                    </div>

                    <!-- 
                    <div class="dashboard-header flex justify-end p-4">
                        <button @click="logout" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                            Logout
                        </button>
                    </div> -->
                </div>
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
