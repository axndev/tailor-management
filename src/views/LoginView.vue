<script setup>
import { ref } from 'vue';
import { auth } from '@/firebase';
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const router = useRouter();
const errorMsg = ref('');

const login = async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);

    // Store user info in localStorage
    localStorage.setItem('user', JSON.stringify({
      uid: userCredential.user.uid,
      email: userCredential.user.email
    }));

    router.push('/'); // redirect to dashboard
  } catch (error) {
    console.error(error);
    errorMsg.value = error.message;
  }
};
</script>

<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-50 w-screen">
      <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-5">
        <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">Login</h2>
  
        <div class="flex flex-col gap-4">
          <input
            v-model="email"
            type="email"
            placeholder="Email"
            class="p-3 border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
  
          <input
            v-model="password"
            type="password"
            placeholder="Password"
            class="p-3 border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
  
          <button
            @click="login"
            class="bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Login
          </button>
        </div>
  
        <p v-if="errorMsg" class="mt-4 text-red-500 text-center">{{ errorMsg }}</p>
      </div>
    </div>
  </template>
  
