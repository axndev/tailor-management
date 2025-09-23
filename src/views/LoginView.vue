<script setup>
import { ref } from 'vue';
import { auth } from '@/firebase';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const router = useRouter();
const errorMsg = ref('');
const successMsg = ref('');

const login = async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email.value.trim(),
      password.value
    );   

    const uid = userCredential.user.uid;
    const userEmail = userCredential.user.email;

    // Save Firebase user info
    localStorage.setItem('user', JSON.stringify({
      uid,
      email: userEmail
    }));

    router.push('/'); // redirect to dashboard
  } catch (error) {
    console.error(error);
    errorMsg.value = error.message;
    successMsg.value = '';
  }
};

const resetPassword = async () => {
  if (!email.value.trim()) {
    errorMsg.value = "Please enter your email to reset password.";
    successMsg.value = '';
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email.value.trim());
    successMsg.value = "Password reset email sent! Please check your inbox.";
    errorMsg.value = '';
  } catch (error) {
    console.error(error);
    errorMsg.value = error.message;
    successMsg.value = '';
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

        <!-- Reset Password -->
        <button
          @click="resetPassword"
          class="text-blue-600 underline text-sm cursor-pointer hover:text-blue-800"
        >
          Forgot Password?
        </button>
      </div>

      <p v-if="errorMsg" class="mt-4 text-red-500 text-center">{{ errorMsg }}</p>
      <p v-if="successMsg" class="mt-4 text-green-600 text-center">{{ successMsg }}</p>
    </div>
  </div>
</template>
