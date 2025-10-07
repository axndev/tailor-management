<script setup>
import { ref, onMounted } from "vue";
import { auth } from "@/firebase";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase";
import {
  onAuthStateChanged,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  signOut,
} from "firebase/auth";
import { useRouter } from "vue-router";

const router = useRouter();

// ✅ Use ref() instead of reactive() for proper v-model reactivity
const user = ref({
  shop: "One Promise Stitching",
  name: "",
  email: "",
  phone: "",
  password: "",
  currentPassword: "",
});

const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const loading = ref(false);

onMounted(() => {
  onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      user.value.email = firebaseUser.email;

      const userRef = doc(db, "users", firebaseUser.uid);

      // Real-time listener
      onSnapshot(userRef, async (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          user.value.name = data.name || "";
          user.value.phone = data.phone || "";
          user.value.shop = data.shop || "One Promise Stitching";
        } else {
          // If no record exists yet, create one
          await setDoc(userRef, {
            name: "",
            phone: "",
            shop: "One Promise Stitching",
            email: firebaseUser.email,
            createdAt: new Date(),
          });
        }
      });
    }
  });
});

async function saveChanges() {
  try {
    loading.value = true;
    const currentUser = auth.currentUser;
    if (!currentUser) {
      alert("⚠️ No user logged in.");
      return;
    }

    if (!user.value.currentPassword) {
      alert("⚠️ Please enter your current password to save changes.");
      return;
    }

    // ✅ Re-authenticate user
    const credential = EmailAuthProvider.credential(
      currentUser.email,
      user.value.currentPassword
    );
    await reauthenticateWithCredential(currentUser, credential);

    // ✅ Update password if provided
    if (user.value.password.length > 0) {
      await updatePassword(currentUser, user.value.password);
    }

    // ✅ Update Firestore profile
    const userRef = doc(db, "users", currentUser.uid);
    await setDoc(
      userRef,
      {
        name: user.value.name,
        phone: user.value.phone,
        shop: user.value.shop,
        email: user.value.email,
        updatedAt: new Date(),
      },
      { merge: true }
    );

    alert("✅ Profile updated successfully!");
    user.value.password = "";
    user.value.currentPassword = "";
  } catch (err) {
    console.error(err);
    if (err.code === "auth/wrong-password") {
      alert("❌ Incorrect current password.");
    } else {
      alert("❌ Error: " + err.message);
    }
  } finally {
    loading.value = false;
  }
}

// ✅ Get initials for profile avatar
function getFirstLettersOfFirstTwoWords(str) {
  const words = str.trim().split(" ");
  if (words.length < 2) return words[0]?.[0] || "";
  return words[0][0] + words[1][0];
}

// ✅ Logout
async function logout() {
  try {
    await signOut(auth);
    localStorage.removeItem("user");
    router.push("/login");
  } catch (err) {
    console.error(err);
    alert("Logout failed: " + err.message);
  }
}
</script>

<template>
<p class="text-gray-500 text-sm">Typed: {{ user.currentPassword }}</p>
  <div class="w-full lg:w-[80vw] bg-gray-50 overflow-auto h-full lg:p-10 p-5 pb-20">
    <div>
      <h2 class="text-xl lg:text-2xl text-gray-900 font-bold mb-1">Profile</h2>
      <p class="text-md">Manage your personal information and account settings.</p>

      <div
        class="bg-white overflow-hidden p-5 mt-5 border-2 relative border-gray-100 rounded-lg w-full flex flex-col gap-5"
      >
        <div class="flex gap-5 items-center md:flex-row md:text-left flex-col text-center">
          <span
            class="w-25 h-25 flex justify-center items-center rounded-full text-5xl bg-blue-600 text-white"
          >
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
            <input
              v-model="user.shop"
              type="text"
              class="border-2 border-gray-100 rounded-sm outline-none p-2 focus:border-blue-600"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label for="name">Full Name</label>
            <input
              v-model="user.name"
              type="text"
              class="border-2 border-gray-100 rounded-sm outline-none p-2 focus:border-blue-600"
            />
          </div>

          <div class="flex gap-5 lg:flex-row flex-col">
            <div class="flex flex-col gap-2 w-full">
              <label for="phone">Phone</label>
              <input
                v-model="user.phone"
                type="text"
                class="border-2 border-gray-100 rounded-sm outline-none p-2 focus:border-blue-600"
              />
            </div>
            <div class="flex flex-col gap-2 w-full">
              <label for="email">Email</label>
              <input
                v-model="user.email"
                type="text"
                disabled
                class="border-2 border-gray-100 rounded-sm outline-none p-2 focus:border-blue-600 bg-gray-100 cursor-not-allowed"
              />
              <small class="text-gray-500">Email cannot be changed here.</small>
            </div>
          </div>

          <div class="flex gap-5 lg:flex-row flex-col">
            <div class="flex flex-col gap-2 w-full relative">
              <label for="currentPassword">Current Password</label>
              <input
                :type="showCurrentPassword ? 'text' : 'password'"
                v-model="user.currentPassword"
                placeholder="Enter current password"
                class="border-2 border-gray-100 rounded-sm outline-none p-2 focus:border-blue-600"
              />
              <button
                type="button"
                @click="showCurrentPassword = !showCurrentPassword"
                class="absolute right-2 top-[45px] text-sm z-10 text-blue-600 cursor-pointer"
              >
                {{ showCurrentPassword ? "Hide" : "Show" }}
              </button>
            </div>
            <div class="flex flex-col gap-2 w-full relative">
              <label for="password">New Password</label>
              <input
                :type="showNewPassword ? 'text' : 'password'"
                v-model="user.password"
                placeholder="Enter new password"
                class="border-2 border-gray-100 rounded-sm outline-none p-2 focus:border-blue-600"
              />
              <button
                type="button"
                @click="showNewPassword = !showNewPassword"
                class="z-10 absolute right-2 top-[45px] text-sm text-blue-600 cursor-pointer"
              >
                {{ showNewPassword ? "Hide" : "Show" }}
              </button>
            </div>
          </div>

          <div class="flex gap-2 w-full lg:mt-8 mt-3">
            <button
              type="submit"
              class="pr-btn lg:w-[50%]"
              :disabled="loading"
            >
              {{ loading ? "Saving..." : "Save" }}
            </button>
            <router-link
              to="/settings"
              class="pr-btn text-center bg-transparent text-black border-gray-200 lg:w-[25%]"
            >
              Back
            </router-link>
            <button
              type="button"
              @click="logout"
              class="pr-btn bg-red-600 text-white lg:w-[25%]"
            >
              Logout
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
