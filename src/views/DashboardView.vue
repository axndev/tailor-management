<script setup>
import { ref, computed, onMounted } from "vue";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
import { app } from "@/firebase"; // your initialized firebase app

const auth = getAuth(app);
const db = getFirestore(app);
import { useRouter } from 'vue-router';
import { signOut } from "firebase/auth";

const router = useRouter();

const logout = async () => {
    try {
        await signOut(auth);
        localStorage.removeItem('user'); // remove local storage
        router.push('/login'); // redirect to login page
    } catch (error) {
        console.error("Logout failed", error);
    }
};
const totalCustomers = ref([]);
const customers = ref([]);
const trashCustomers = ref([]);

// ✅ Sign in and fetch customers from Firebase
onMounted(async () => {
    try {
        // 2️⃣ Reference the "customers" collection
        const customersCollection = collection(db, "customers");

        // 3️⃣ Fetch all customers
        const snapshot = await getDocs(customersCollection);
        totalCustomers.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // 4️⃣ Separate active and trashed customers
        const activeQuery = query(customersCollection, where("isDeleted", "==", false));
        const activeSnapshot = await getDocs(activeQuery);
        customers.value = activeSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const trashQuery = query(customersCollection, where("isDeleted", "==", true));
        const trashSnapshot = await getDocs(trashQuery);
        trashCustomers.value = trashSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    } catch (error) {
        console.error("Error signing in or fetching data:", error);
    }
});

// ✅ Compute new customers this month
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
</script>

<template>

    <div class="w-full lg:w-[80vw] md:p-10 p-5 bg-indigo-gray-50 pb-20 lg:pb-5">
        <h2 class="text-2xl text-gray-600 font-bold hidden lg:block">Dashboard</h2>
        <div class="flex justify-center items-center h-full w-full">
            <div class="grid grid-cols-1 lg:grid-cols-2 w-full gap-6 ">

                <!-- Total Customers -->
                <div class="bg-white p-5 border-l-4 border-sky-500 rounded-lg shadow">
                    <div class="flex items-center justify-between ">
                        <div>
                            <p class="text-gray-600 text-sm font-medium">Total Customers</p>
                            <h3 class="text-3xl font-bold text-gray-800 my-5">{{ totalCustomers.length }}</h3>
                            <p class="text-green-500 text-xs font-medium mt-1">↑ {{ monthlyCustomers.length }} this month
                            </p>
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
                            <h3 class="text-3xl font-bold text-gray-800 my-5">{{ monthlyCustomers.length }}</h3>
                            <p class="text-green-500 text-xs font-medium mt-1">↑ Growing</p>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 text-indigo-500" fill="currentColor"
                            viewBox="0 0 24 24">
                            <path d="M3 17h2v-6H3v6zm4 0h2v-10H7v10zm4 0h2v-14h-2v14zm4 0h2v-8h-2v8zm4 
               0h2v-12h-2v12z" />
                        </svg>
                    </div>
                </div>

                    <div class="dashboard-header flex justify-end p-4">
                        <button @click="logout" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                            Logout
                        </button>
                    </div>
            </div>

        </div>
    </div>
</template>