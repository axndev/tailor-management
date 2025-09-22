<script setup>
import { reactive, onMounted, ref } from "vue";
import { auth } from "@/firebase"; // adjust path
import {
    onAuthStateChanged,
    updatePassword,
    updateEmail,
    EmailAuthProvider,
    reauthenticateWithCredential,
} from "firebase/auth";

const user = reactive({
    shop: "",
    name: "",
    email: "",
    phone: "",
    password: "",
    currentPassword: "",
});

const showCurrentPassword = ref(false);
const showNewPassword = ref(false);

onMounted(() => {
    // Firebase Auth
    onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
            user.email = firebaseUser.email;
        }
    });

    // LocalStorage (extra fields)
    const localUser = JSON.parse(localStorage.getItem("user_data"));
    if (localUser) {
        user.name = localUser.name || "";
        user.phone = localUser.phone || "";
        user.shop = localUser.shop || "";
    }

    // Email fallback
    const localAuthUser = JSON.parse(localStorage.getItem("user"));
    if (localAuthUser?.email) {
        user.email = localAuthUser.email;
    }
});

async function saveChanges() {
    try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
            alert("No user logged in.");
            return;
        }

        if (!user.currentPassword) {
            alert("Please enter your current password to save changes.");
            return;
        }

        const credential = EmailAuthProvider.credential(
            currentUser.email,
            user.currentPassword
        );
        await reauthenticateWithCredential(currentUser, credential);

        if (user.email !== currentUser.email) {
            await updateEmail(currentUser, user.email);
        }

        if (user.password.length > 0) {
            await updatePassword(currentUser, user.password);
        }

        localStorage.setItem(
            "user_data",
            JSON.stringify({ name: user.name, phone: user.phone, shop: user.shop })
        );

        alert("Profile updated successfully!");
        user.password = "";
        user.currentPassword = "";
    } catch (err) {
        console.error(err);
        alert("Error: " + err.message);
    }
}

function getFirstLettersOfFirstTwoWords(str) {
    const words = str.split(" ");
    if (words.length < 2) return words[0]?.[0] || "";
    return words[0][0] + words[1][0];
}
</script>

<template>
    <div class="w-full lg:w-[80vw] bg-gray-50 overflow-auto h-full lg:p-10 p-5 pb-20">
        <div>
            <h2 class="text-xl lg:text-2xl text-gray-900 font-bold mb-1">Profile</h2>
            <p class="text-md">Manage your personal information and account settings.</p>
            <div class="bg-white overflow-hidden p-5 mt-5 border-2 relative border-gray-100 rounded-lg w-full flex flex-col gap-5">
                <div class="flex gap-5 items-center md:flex-row md:text-left flex-col text-center" >
                    <span
                        class="w-25 h-25 flex justify-center items-center rounded-full text-5xl bg-blue-600 text-white">
                        {{ getFirstLettersOfFirstTwoWords(user.name) }}
                    </span>
                    <div class="flex flex-col">
                        <h2 class="text-2xl">{{ user.name }}</h2>
                        <span>{{ user.phone }}</span>
                        <span>{{ user.email }}</span>
                    </div>
                </div>

                <form @submit.prevent="saveChanges" class="flex flex-col gap-5 mt-5">
                    <div class="flex flex-col gap-2">
                        <label for="shop">Shop Name</label>
                        <input v-model="user.shop" type="text"
                            class="border-2 border-gray-100 rounded-sm outline-none p-2 focus:border-blue-600" />
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="name">Full Name</label>
                        <input v-model="user.name" type="text"
                            class="border-2 border-gray-100 rounded-sm outline-none p-2 focus:border-blue-600" />
                    </div>

                    <div class="flex gap-5 lg:flex-row flex-col">
                        <div class="flex flex-col gap-2 w-full">
                            <label for="phone">Phone</label>
                            <input v-model="user.phone" type="text"
                                class="border-2 border-gray-100 rounded-sm outline-none p-2 focus:border-blue-600" />
                        </div>
                        <div class="flex flex-col gap-2 w-full">
                            <label for="email">Email</label>
                            <input v-model="user.email" type="text"
                                class="border-2 border-gray-100 rounded-sm outline-none p-2 focus:border-blue-600" />
                        </div>
                    </div>

                    <div class="flex gap-5 lg:flex-row flex-col">
                        <div class="flex flex-col gap-2 w-full relative">
                            <label for="currentPassword">Current Password</label>
                            <input :type="showCurrentPassword ? 'text' : 'password'" v-model="user.currentPassword"
                                placeholder="Enter current password"
                                class="border-2 border-gray-100 rounded-sm outline-none p-2 focus:border-blue-600" />
                            <button type="button" @click="showCurrentPassword = !showCurrentPassword"
                                class="absolute right-2 top-[45px] text-sm text-blue-600 cursor-pointer">
                                {{ showCurrentPassword ? 'Hide' : 'Show' }}
                            </button>
                        </div>
                        <div class="flex flex-col gap-2 w-full relative">
                            <label for="password">New Password</label>
                            <input :type="showNewPassword ? 'text' : 'password'" v-model="user.password"
                                placeholder="Enter new password"
                                class="border-2 border-gray-100 rounded-sm outline-none p-2 focus:border-blue-600" />
                            <button type="button" @click="showNewPassword = !showNewPassword"
                                class="absolute right-2 top-[45px] text-sm text-blue-600 cursor-pointer">
                                {{ showNewPassword ? 'Hide' : 'Show' }}
                            </button>
                        </div>
                    </div>

                    <div class="flex gap-2 w-full lg:mt-8 mt-3">
                        <button type="submit" class="pr-btn lg:w-[70%]">Save Changes</button>
                        <router-link to="/settings"
                            class="pr-btn text-center bg-transparent text-black border-gray-200 lg:w-[30%]">
                            Back
                        </router-link>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
