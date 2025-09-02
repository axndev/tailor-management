<script setup>
import { reactive, onMounted, onUpdated } from "vue";
import axios from "axios";
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';

const router = useRouter();
const API_URL = "https://tailor-management.onrender.com";

const props = defineProps({
    mode: { type: String, default: "create" }, // create | edit | view
    id: { type: String, default: null }
})

// Reactive customer object
const customer = reactive({
    name: "",
    phone: "",
    address: "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    // Measurements
    shirt_length: null,
    shoulder: null,
    sleeve: null,
    tera: null,
    collar: null,
    chest: null,
    waist: null,
    ghera: null,
    cuff: null,
    shalwar_length: null,
    trouser_length: null,
    bottom: null,

    // Checkboxes (true/false)
    double_salie: false,
    design: false,
    front_pocket: false,
    zip_hip: false,
    qaf: false,
    gool_bazu: false,
    stad: false,
    chak_pati: false,
    trouser_pocket: false,
    rashmi_dhaga: false,
    jali: false,

    // Radios (single value)
    gala: "",          // eg. "گول", "کونہ دار"
    ghera_type: "",    // eg. "گول", "چوکھا"
    shalwar: "",       // eg. "شلوار", "ٹراؤزر"
    button: "",        // eg. "چھوٹا", "درمیانہ", "بڑا"
    side_pocket: "",   // eg. "دائیں", "بائیں", "دونوں"

    // Notes
    extra_info: "",
    isDeleted: false
});
// Load data if edit/view
onMounted(async () => {
    if (props.id) {
        const res = await axios.get(`${API_URL}/customers/${props.id}`)
        Object.assign(customer, res.data)
    }

})
// Save handler
const saveCustomer = async () => {
    if (customer.name !== '') {
        if (props.mode === "create") {
            await axios.post(`${API_URL}/customers`, customer);
            router.push(`/customers`);
        } else if (props.mode === "edit") {
            customer.updated_at = new Date().toISOString();
            await axios.put(`${API_URL}/customers/${props.id}`, customer);
            router.push(`/customers`);
        }
    }
    else {
        alert("Plz Enter Name")
    }
}

function printDetails() {
    const printContents = document.getElementById('print-area').innerHTML
    const printWindow = window.open('', '', 'height=800,width=600')
    printWindow.document.write(`
    <html>
      <head>
        <title>پرنٹ</title>
        <style>
          body { font-family: 'Noto Nastaliq Urdu', serif; direction: rtl; }
          h2, h3 { color: #0ea5e9; }
          ul { list-style: none; padding: 0; }
          li { margin-bottom: 4px; }
        </style>
      </head>
      <body>${printContents}</body>
    </html>
  `)
    printWindow.document.close()
    printWindow.print()
}

// Create a new Date object for the current date and time
const currentDate = new Date();

// Define options for formatting the date
const options = {
    weekday: 'long', // Full weekday name (e.g., اتوار)
    year: 'numeric', // Full year (e.g., 2025)
    month: 'long',   // Full month name (e.g., اگست)
    day: 'numeric'   // Day of the month (e.g., 27)
};

// Format the date for the Urdu locale (Pakistan)
const urduDate = currentDate.toLocaleDateString('ur-PK', options);


function formatUrduDate(dateStr) {
    if (!dateStr) return "";
    const date = new Date(dateStr);

    return new Intl.DateTimeFormat("ur-PK", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC" // ⚡ تاکہ ISO string کے مطابق رہے
    }).format(date);
}

onMounted(formatUrduDate);
</script>
<template>
    <div class="md:p-10 p-5 bg-gray-50 w-full lg:w-[80vw]  overflow-y-auto">
        <form
            class="max-full mx-auto bg-white border rounded-lg border-gray-300 md:p-10 p-5 flex flex-col items-end space-y-6 [direction:rtl]">
            <!-- Title -->
            <div class="flex justify-between w-full flex-col my-5 md:flex-row">
                <h2 class="text-2xl font-bold text-gray-800 mb-10 text-right">
                    {{ props.mode === 'create' ? 'نیا کسٹمر شامل کریں' :
                        props.mode === 'edit' ? 'کسٹمر ایڈیٹ کریں' :
                            'کسٹمر تفصیل' }}
                </h2>
                <span class="text-sm">
                    <!-- اگر create mode ہے -->
                    <template v-if="props.mode === 'create'">
                        <span class="text-lg pl-3">آج :</span> {{ urduDate }}
                    </template>

                    <!-- کسٹمر کی تاریخیں -->
                    <template v-else>
                        <span class="text-lg pl-3">شامل ہونے کی تاریخ :</span>
                        {{ formatUrduDate(customer.created_at) }} <br><br>
                        <span v-if="formatUrduDate(customer.created_at) !== formatUrduDate(customer.updated_at)">
                            <span class="text-lg pl-3">آخری بار اپڈیٹ :</span> {{ formatUrduDate(customer.updated_at) }}
                        </span>
                    </template>
                </span>
            </div>
            <!-- Grid Layout -->
            <div class="grid grid-cols-1 !md:grid-cols-2 gap-8 w-full mt-5">

                <!-- Name -->
                <div class="flex md:flex-row flex-col gap-4 col-span-2">
                    <div class="flex gap-4">
                        <label for="name" class="mb-1 font-semibold text-gray-700">نام:</label>
                        <input :disabled="props.mode === 'view'" v-model="customer.name" type="text" id="name"
                            name="name" placeholder="کسٹمر کا نام درج کریں"
                            class="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                    </div>

                    <!-- Phone -->
                    <div class="flex gap-4">
                        <label for="phone" class="mb-1 font-semibold text-gray-700">موبائل نمبر:</label>
                        <input :disabled="props.mode === 'view'" type="tel" v-model="customer.phone" id="phone"
                            name="phone" placeholder="0300-1234567"
                            class="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                    </div>
                </div>
                <!-- Address -->
                <div class="flex gap-4 col-span-2">
                    <label for="address" class="mb-1 font-semibold text-gray-700">پتہ:</label>
                    <textarea :disabled="props.mode === 'view'" v-model="customer.address" id="address" name="address"
                        placeholder="گاہک کا پتہ درج کریں"
                        class="border w-full border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"></textarea>
                </div>

                <!-- Measurements -->
                <div class="col-span-2">
                    <h3 class="text-2xl text-gray-700 font-medium mb-4">ناپ </h3>
                    <div class="grid md:grid-cols-2 gap-6">
                        <div class="flex gap-4">
                            <label for="shirt_length" class="mb-1 font-semibold">قمیض / کرتا لمبائی:</label>
                            <input :disabled="props.mode === 'view'" v-model="customer.shirt_length" type="number"
                                id="shirt_length" name="shirt_length" placeholder="انچ میں درج کریں"
                                class="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div class="flex gap-4">
                            <label for="shoulder" class="mb-1 font-semibold">کندھا:</label>
                            <input :disabled="props.mode === 'view'" type="number" v-model="customer.shoulder"
                                id="shoulder" name="shoulder" placeholder="انچ میں درج کریں"
                                class="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div class="flex gap-4">
                            <label for="sleeve" class="mb-1 font-semibold">بازو:</label>
                            <input :disabled="props.mode === 'view'" type="number" id="sleeve" v-model="customer.sleeve"
                                name="sleeve" placeholder="انچ میں درج کریں"
                                class="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div class="flex gap-4">
                            <label for="tera" class="mb-1 font-semibold">تیرا:</label>
                            <input :disabled="props.mode === 'view'" type="number" id="tera" v-model="customer.tera"
                                name="tera" placeholder="انچ میں درج کریں"
                                class="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500" />
                        </div>

                        <div class="flex gap-4">
                            <label for="collar" class="mb-1 font-semibold">بین / کالر:</label>
                            <input :disabled="props.mode === 'view'" type="number" id="collar" v-model="customer.collar"
                                name="collar" placeholder="انچ میں درج کریں"
                                class="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div class="flex gap-4">
                            <label for="chest" class="mb-1 font-semibold">چھاتی:</label>
                            <input :disabled="props.mode === 'view'" type="number" id="chest" v-model="customer.chest"
                                name="chest" placeholder="انچ میں درج کریں"
                                class="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div class="flex gap-4">
                            <label for="waist" class="mb-1 font-semibold">کمر:</label>
                            <input :disabled="props.mode === 'view'" type="number" id="waist" name="waist"
                                v-model="customer.waist" placeholder="انچ میں درج کریں"
                                class="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500" />
                        </div>

                        <div class="flex gap-4">
                            <label for="ghera" class="mb-1 font-semibold">گھیرا:</label>
                            <input :disabled="props.mode === 'view'" type="number" id="ghera" name="ghera"
                                v-model="customer.ghera" placeholder="انچ میں درج کریں"
                                class="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div class="flex gap-4">
                            <label for="cuff" class="mb-1 font-semibold">کف:</label>
                            <input :disabled="props.mode === 'view'" type="number" id="cuff" name="cuff"
                                placeholder="انچ میں درج کریں" v-model="customer.cuff"
                                class="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div class="flex gap-4">
                            <label for="shalwar_length" class="mb-1 font-semibold">شلوار لمبائی:</label>
                            <input :disabled="props.mode === 'view'" type="number" id="shalwar_length"
                                name="shalwar_length" v-model="customer.shalwar_length" placeholder="انچ میں درج کریں"
                                class="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div class="flex gap-4">
                            <label for="trouser_length" class="mb-1 font-semibold">پینٹ / ٹراؤزر لمبائی:</label>
                            <input :disabled="props.mode === 'view'" type="number" id="trouser_length"
                                name="trouser_length" v-model="customer.trouser_length" placeholder="انچ میں درج کریں"
                                class="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div class="flex gap-4">
                            <label for="bottom" class="mb-1 font-semibold">پائنچہ:</label>
                            <input :disabled="props.mode === 'view'" type="number" id="bottom" name="bottom"
                                placeholder="انچ میں درج کریں" v-model="customer.bottom"
                                class="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500" />
                        </div>

                    </div>
                </div>

                <!-- Extra Options -->
                <div class="col-span-2">
                    <h3 class="text-2xl  text-gray-700 font-medium mt-6 mb-4">مزید تفصیل</h3>

                    <!-- Checkboxes -->
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">

                        <!-- Double Salie -->
                        <label
                            class="flex items-center gap-2 border border-gray-300 p-2 rounded-lg shadow-sm bg-[#e5e7eb48]">
                            <input type="checkbox" v-model="customer.double_salie" name="double_salie"
                                :disabled="props.mode === 'view'" class="hidden peer" />

                            <div class="h-4 w-4 rounded border flex items-center justify-center shrink-0" :class="[
                                customer.double_salie ? 'bg-indigo-500' : '',
                                customer.double_salie && props.mode === 'view' ? '!bg-green-500' : 'cursor-pointer'
                            ]">
                                <svg v-show="customer.double_salie" class="w-3 h-3 text-white" fill="none"
                                    stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>

                            <span>ڈبل سالی</span>
                        </label>

                        <!-- Front Pocket -->
                        <label
                            class="flex items-center gap-2 border border-gray-300 p-2 rounded-lg shadow-sm bg-[#e5e7eb48]">
                            <input type="checkbox" v-model="customer.front_pocket" name="front_pocket"
                                :disabled="props.mode === 'view'" class="hidden peer" />

                            <div class="h-4 w-4 rounded border flex items-center justify-center shrink-0" :class="[
                                customer.front_pocket ? 'bg-indigo-500' : '',
                                customer.front_pocket && props.mode === 'view' ? '!bg-green-500' : 'cursor-pointer'
                            ]">
                                <svg v-show="customer.front_pocket" class="w-3 h-3 text-white" fill="none"
                                    stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>

                            <span>فرنٹ جیب (F)</span>
                        </label>

                        <!-- Zip / Hip -->
                        <label
                            class="flex items-center gap-2 border border-gray-300 p-2 rounded-lg shadow-sm bg-[#e5e7eb48]">
                            <input type="checkbox" v-model="customer.zip_hip" name="zip_hip"
                                :disabled="props.mode === 'view'" class="hidden peer" />

                            <div class="h-4 w-4 rounded border flex items-center justify-center shrink-0" :class="[
                                customer.zip_hip ? 'bg-indigo-500' : '',
                                customer.zip_hip && props.mode === 'view' ? '!bg-green-500' : 'cursor-pointer'
                            ]">
                                <svg v-show="customer.zip_hip" class="w-3 h-3 text-white" fill="none"
                                    stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>

                            <span>زپ / ہپ (Z)</span>
                        </label>

                        <!-- Qaf -->
                        <label
                            class="flex items-center gap-2 border border-gray-300 p-2 rounded-lg shadow-sm bg-[#e5e7eb48]">
                            <input type="checkbox" v-model="customer.qaf" name="qaf" :disabled="props.mode === 'view'"
                                class="hidden peer" />

                            <div class="h-4 w-4 rounded border flex items-center justify-center shrink-0" :class="[
                                customer.qaf ? 'bg-indigo-500' : '',
                                customer.qaf && props.mode === 'view' ? '!bg-green-500' : 'cursor-pointer'
                            ]">
                                <svg v-show="customer.qaf" class="w-3 h-3 text-white" fill="none" stroke="currentColor"
                                    stroke-width="3" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>

                            <span>کف</span>
                        </label>

                        <!-- Gool Bazu -->
                        <label
                            class="flex items-center gap-2 border border-gray-300 p-2 rounded-lg shadow-sm bg-[#e5e7eb48]">
                            <input type="checkbox" v-model="customer.gool_bazu" name="gool_bazu"
                                :disabled="props.mode === 'view'" class="hidden peer" />

                            <div class="h-4 w-4 rounded border  flex items-center justify-center shrink-0" :class="[
                                customer.gool_bazu ? 'bg-indigo-500' : '',
                                customer.gool_bazu && props.mode === 'view' ? '!bg-green-500' : 'cursor-pointer'
                            ]">
                                <svg v-show="customer.gool_bazu" class="w-3 h-3 text-white" fill="none"
                                    stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>

                            <span>گول بازو</span>
                        </label>

                        <!-- Stad -->
                        <label
                            class="flex items-center gap-2 border border-gray-300 p-2 rounded-lg shadow-sm bg-[#e5e7eb48]">
                            <input type="checkbox" v-model="customer.stad" name="stad" :disabled="props.mode === 'view'"
                                class="hidden peer" />

                            <div class="h-4 w-4 rounded border flex items-center justify-center shrink-0" :class="[
                                customer.stad ? 'bg-indigo-500' : '',
                                customer.stad && props.mode === 'view' ? '!bg-green-500' : 'cursor-pointer'
                            ]">
                                <svg v-show="customer.stad" class="w-3 h-3 text-white" fill="none" stroke="currentColor"
                                    stroke-width="3" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>

                            <span>سٹڈ</span>
                        </label>

                        <!-- Chak Pati -->
                        <label
                            class="flex items-center gap-2 border border-gray-300 p-2 rounded-lg shadow-sm bg-[#e5e7eb48]">
                            <input type="checkbox" v-model="customer.chak_pati" name="chak_pati"
                                :disabled="props.mode === 'view'" class="hidden peer" />

                            <div class="h-4 w-4 rounded border flex items-center justify-center shrink-0" :class="[
                                customer.chak_pati ? 'bg-indigo-500' : '',
                                customer.chak_pati && props.mode === 'view' ? '!bg-green-500' : 'cursor-pointer'
                            ]">
                                <svg v-show="customer.chak_pati" class="w-3 h-3 text-white" fill="none"
                                    stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>

                            <span>چاک پٹی</span>
                        </label>

                        <!-- Trouser Pocket -->
                        <label
                            class="flex items-center gap-2 border border-gray-300 p-2 rounded-lg shadow-sm bg-[#e5e7eb48]">
                            <input type="checkbox" v-model="customer.trouser_pocket" name="trouser_pocket"
                                :disabled="props.mode === 'view'" class="hidden peer" />

                            <div class="h-4 w-4 rounded border flex items-center justify-center shrink-0" :class="[
                                customer.trouser_pocket ? 'bg-indigo-500' : '',
                                customer.trouser_pocket && props.mode === 'view' ? '!bg-green-500' : 'cursor-pointer'
                            ]">
                                <svg v-show="customer.trouser_pocket" class="w-3 h-3 text-white" fill="none"
                                    stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>

                            <span>ٹراؤزر پاکٹ</span>
                        </label>

                        <!-- Rashmi Dhaga -->
                        <label
                            class="flex items-center gap-2 border border-gray-300 p-2 rounded-lg shadow-sm bg-[#e5e7eb48]">
                            <input type="checkbox" v-model="customer.rashmi_dhaga" name="rashmi_dhaga"
                                :disabled="props.mode === 'view'" class="hidden peer" />

                            <div class="h-4 w-4 rounded border flex items-center justify-center shrink-0" :class="[
                                customer.rashmi_dhaga ? 'bg-indigo-500' : '',
                                customer.rashmi_dhaga && props.mode === 'view' ? '!bg-green-500' : 'cursor-pointer'
                            ]">
                                <svg v-show="customer.rashmi_dhaga" class="w-3 h-3 text-white" fill="none"
                                    stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>

                            <span>رشمی دھاگہ</span>
                        </label>

                        <!-- Jali -->
                        <label
                            class="flex items-center gap-2 border border-gray-300 p-2 rounded-lg shadow-sm bg-[#e5e7eb48]">
                            <input type="checkbox" v-model="customer.jali" name="jali" :disabled="props.mode === 'view'"
                                class="hidden peer" />

                            <div class="h-4 w-4 rounded border flex items-center justify-center shrink-0" :class="[
                                customer.jali ? 'bg-indigo-500' : '',
                                customer.jali && props.mode === 'view' ? '!bg-green-500' : 'cursor-pointer'
                            ]">
                                <svg v-show="customer.jali" class="w-3 h-3 text-white" fill="none" stroke="currentColor"
                                    stroke-width="3" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>

                            <span>جالی</span>
                        </label>

                    </div>

                </div>
                <!-- Radio Groups -->
                <div class="col-span-2">
                    <div class="grid md:grid-cols-3 gap-5 md:gap-10 mt-6">

                        <!-- Gala -->
                        <div class="flex items-center gap-4">
                            <p class="font-semibold">گلا کی قسم:</p>
                            <div class="flex gap-6 mt-2">
                                <label class="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="gala" value="calar" v-model="customer.gala"
                                        :disabled="props.mode === 'view'" class="hidden peer" />
                                    <div class="h-4 w-4 rounded-full border flex items-center justify-center shrink-0"
                                        :class="[
                                            customer.gala === 'calar' ? 'bg-indigo-500' : '',
                                            customer.gala === 'calar' && props.mode === 'view' ? '!bg-green-500' : 'cursor-pointer'
                                        ]">
                                        <div v-show="customer.gala === 'calar'" class="h-2 w-2 rounded-full bg-white">
                                        </div>
                                    </div>
                                    <span>کالر</span>
                                </label>

                                <label class="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="gala" value="baan" v-model="customer.gala"
                                        :disabled="props.mode === 'view'" class="hidden peer" />
                                    <div class="h-4 w-4 rounded-full border flex items-center justify-center shrink-0"
                                        :class="[
                                            customer.gala === 'baan' ? 'bg-indigo-500' : '',
                                            customer.gala === 'baan' && props.mode === 'view' ? '!bg-green-500' : 'cursor-pointer'
                                        ]">
                                        <div v-show="customer.gala === 'baan'" class="h-2 w-2 rounded-full bg-white">
                                        </div>
                                    </div>
                                    <span>بین</span>
                                </label>
                            </div>
                        </div>

                        <!-- Ghera -->
                        <div class="flex items-center gap-4">
                            <p class="font-semibold">گھیرہ کی قسم:</p>
                            <div class="flex gap-6 mt-2">
                                <label class="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="ghera" value="gool" v-model="customer.ghera_type"
                                        :disabled="props.mode === 'view'" class="hidden peer" />
                                    <div class="h-4 w-4 rounded-full border flex items-center justify-center shrink-0"
                                        :class="[
                                            customer.ghera_type === 'gool' ? 'bg-indigo-500' : '',
                                            customer.ghera_type === 'gool' && props.mode === 'view' ? '!bg-green-500' : 'cursor-pointer'
                                        ]">
                                        <div v-show="customer.ghera_type === 'gool'"
                                            class="h-2 w-2 rounded-full bg-white"></div>
                                    </div>
                                    <span>گول</span>
                                </label>

                                <label class="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="ghera" value="choras" v-model="customer.ghera_type"
                                        :disabled="props.mode === 'view'" class="hidden peer" />
                                    <div class="h-4 w-4 rounded-full border flex items-center justify-center shrink-0"
                                        :class="[
                                            customer.ghera_type === 'choras' ? 'bg-indigo-500' : '',
                                            customer.ghera_type === 'choras' && props.mode === 'view' ? '!bg-green-500' : 'cursor-pointer'
                                        ]">
                                        <div v-show="customer.ghera_type === 'choras'"
                                            class="h-2 w-2 rounded-full bg-white"></div>
                                    </div>
                                    <span>چورَس</span>
                                </label>
                            </div>
                        </div>

                        <!-- Shalwar -->
                        <div class="flex items-center gap-4">
                            <p class="font-semibold">شلوار کی قسم:</p>
                            <div class="flex gap-6 mt-2">
                                <label class="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="shalwar" value="simple" v-model="customer.shalwar"
                                        :disabled="props.mode === 'view'" class="hidden peer" />
                                    <div class="h-4 w-4 rounded-full border flex items-center justify-center shrink-0"
                                        :class="[
                                            customer.shalwar === 'simple' ? 'bg-indigo-500' : '',
                                            customer.shalwar === 'simple' && props.mode === 'view' ? '!bg-green-500' : 'cursor-pointer'
                                        ]">
                                        <div v-show="customer.shalwar === 'simple'"
                                            class="h-2 w-2 rounded-full bg-white"></div>
                                    </div>
                                    <span>سادہ شلوار</span>
                                </label>

                                <label class="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="shalwar" value="trouser" v-model="customer.shalwar"
                                        :disabled="props.mode === 'view'" class="hidden peer" />
                                    <div class="h-4 w-4 rounded-full border flex items-center justify-center shrink-0"
                                        :class="[
                                            customer.shalwar === 'trouser' ? 'bg-indigo-500' : '',
                                            customer.shalwar === 'trouser' && props.mode === 'view' ? '!bg-green-500' : 'cursor-pointer'
                                        ]">
                                        <div v-show="customer.shalwar === 'trouser'"
                                            class="h-2 w-2 rounded-full bg-white"></div>
                                    </div>
                                    <span>شلوار ٹراؤزر</span>
                                </label>
                            </div>
                        </div>

                        <!-- Buttons -->
                        <div class="flex items-center gap-4">
                            <p class="font-semibold">بٹن:</p>
                            <div class="flex gap-6 mt-2">
                                <label class="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="button" value="sada" v-model="customer.button"
                                        :disabled="props.mode === 'view'" class="hidden peer" />
                                    <div class="h-4 w-4 rounded-full border flex items-center justify-center shrink-0"
                                        :class="[
                                            customer.button === 'sada' ? 'bg-indigo-500' : '',
                                            customer.button === 'sada' && props.mode === 'view' ? '!bg-green-500' : 'cursor-pointer'
                                        ]">
                                        <div v-show="customer.button === 'sada'" class="h-2 w-2 rounded-full bg-white">
                                        </div>
                                    </div>
                                    <span>سادہ</span>
                                </label>

                                <label class="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="button" value="stylish" v-model="customer.button"
                                        :disabled="props.mode === 'view'" class="hidden peer" />
                                    <div class="h-4 w-4 rounded-full border flex items-center justify-center shrink-0"
                                        :class="[
                                            customer.button === 'stylish' ? 'bg-indigo-500' : '',
                                            customer.button === 'stylish' && props.mode === 'view' ? '!bg-green-500' : 'cursor-pointer'
                                        ]">
                                        <div v-show="customer.button === 'stylish'"
                                            class="h-2 w-2 rounded-full bg-white"></div>
                                    </div>
                                    <span>اسٹائلش</span>
                                </label>
                            </div>
                        </div>

                        <!-- Side Pockets -->
                        <div class="flex items-center gap-4">
                            <p class="font-semibold">سائیڈ جیب:</p>
                            <div class="flex gap-6 mt-2">
                                <label class="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="side_pocket" value="one" v-model="customer.side_pocket"
                                        :disabled="props.mode === 'view'" class="hidden peer" />
                                    <div class="h-4 w-4 rounded-full border flex items-center justify-center shrink-0"
                                        :class="[
                                            customer.side_pocket === 'one' ? 'bg-indigo-500' : '',
                                            customer.side_pocket === 'one' && props.mode === 'view' ? '!bg-green-500' : 'cursor-pointer'
                                        ]">
                                        <div v-show="customer.side_pocket === 'one'"
                                            class="h-2 w-2 rounded-full bg-white"></div>
                                    </div>
                                    <span>ایک</span>
                                </label>

                                <label class="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="side_pocket" value="two" v-model="customer.side_pocket"
                                        :disabled="props.mode === 'view'" class="hidden peer" />
                                    <div class="h-4 w-4 rounded-full border flex items-center justify-center shrink-0"
                                        :class="[
                                            customer.side_pocket === 'two' ? 'bg-indigo-500' : '',
                                            customer.side_pocket === 'two' && props.mode === 'view' ? '!bg-green-500' : 'cursor-pointer'
                                        ]">
                                        <div v-show="customer.side_pocket === 'two'"
                                            class="h-2 w-2 rounded-full bg-white"></div>
                                    </div>
                                    <span>دو</span>
                                </label>

                                <label class="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="side_pocket" value="none" v-model="customer.side_pocket"
                                        :disabled="props.mode === 'view'" class="hidden peer" />
                                    <div class="h-4 w-4 rounded-full border flex items-center justify-center shrink-0"
                                        :class="[
                                            customer.side_pocket === 'none' ? 'bg-indigo-500' : '',
                                            customer.side_pocket === 'none' && props.mode === 'view' ? '!bg-green-500' : 'cursor-pointer'
                                        ]">
                                        <div v-show="customer.side_pocket === 'none'"
                                            class="h-2 w-2 rounded-full bg-white"></div>
                                    </div>
                                    <span>بغیر جیب</span>
                                </label>
                            </div>
                        </div>

                    </div>
                </div>


                <!-- Extra Notes -->
                <div class="flex gap-4 col-span-2 flex-col md:flex-row">
                    <label for="extra_info" class="mb-2 font-semibold">اضافی معلومات:</label>
                    <textarea :disabled="props.mode === 'view'" v-model="customer.extra_info" id="extra_info"
                        name="extra_info" rows="4" placeholder="یہاں خصوصی ہدایات یا اضافی معلومات درج کریں..."
                        class="border w-full border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"></textarea>
                </div>
            </div>
            <!-- Submit -->
            <div class="flex justify-center md:justify-end w-full gap-4 mt-6">

                <!-- Cancel Button -->

                <router-link type="button" to="/customers"
                    class="md:px-8 md:py-3 px-5 py-2 cursor-pointer rounded-lg border border-gray-400 text-gray-600 hover:bg-gray-100 transition">
                    {{ props.mode === 'view' ? 'واپس جائیں' : 'منسوخ کریں' }}
                </router-link>

                <!-- Print Button -->
                <button type="button" @click="printDetails" v-if="props.mode === 'view'"
                    class="md:px-8 md:py-3 px-5 py-2 cursor-pointer rounded-lg bg-green-500 text-white hover:bg-green-600 transition">
                    پرنٹ کریں
                </button>

                <!-- Save Button -->
                <button to="/Customers" type="button" @click="saveCustomer" v-if="props.mode !== 'view'"
                    class="md:px-8 md:py-3 px-5 py-2  cursor-pointer rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition">
                    محفوظ کریں
                </button>
            </div>
        </form>
        <div id="print-area" class="hidden">
            <h2 class="text-2xl font-bold mb-4">کسٹمر کی تفصیل</h2>

            <p><strong>نام:</strong> {{ customer.name }}</p>
            <p><strong>موبائل نمبر:</strong> {{ customer.phone }}</p>
            <p><strong>پتہ:</strong> {{ customer.address }}</p>

            <h3 class="text-xl font-bold mt-4">ناپ</h3>
            <ul>
                <li>قمیض / کرتا لمبائی: {{ customer.shirt_length }} انچ</li>
                <li>کندھا: {{ customer.shoulder }} انچ</li>
                <li>بازو: {{ customer.sleeve }} انچ</li>
                <li>بین / کالر: {{ customer.collar }} انچ</li>
                <li>چھاتی: {{ customer.chest }} انچ</li>
                <li>کمر: {{ customer.waist }} انچ</li>
                <li>گھیرا: {{ customer.ghera }} انچ</li>
                <li>کف: {{ customer.cuff }} انچ</li>
                <li>شلوار لمبائی: {{ customer.shalwar_length }} انچ</li>
                <li>پینٹ / ٹراؤزر لمبائی: {{ customer.trouser_length }} انچ</li>
                <li>پائنچہ: {{ customer.bottom }} انچ</li>
            </ul>

            <h3 class="text-xl font-bold mt-4">مزید تفصیل</h3>
            <ul>
                <li v-if="customer.double_salie">ڈبل سالی</li>
                <li v-if="customer.design">ڈیزائن</li>
                <li v-if="customer.front_pocket">فرنٹ جیب</li>
                <li v-if="customer.zip_hip">زپ / ہپ</li>
                <li v-if="customer.qaf">کف</li>
                <li v-if="customer.gool_bazu">گول بازو</li>
                <li v-if="customer.stad">سٹڈ</li>
                <li v-if="customer.chak_pati">چاک پٹی</li>
                <li v-if="customer.trouser_pocket">ٹراؤزر پاکٹ</li>
                <li v-if="customer.rashmi_dhaga">رشمی دھاگہ</li>
                <li v-if="customer.jali">جالی</li>
            </ul>

            <p><strong>گلا:</strong> {{ customer.gala }}</p>
            <p><strong>گھیرا:</strong> {{ customer.ghera_type }}</p>
            <p><strong>شلوار:</strong> {{ customer.shalwar }}</p>
            <p><strong>بٹن:</strong> {{ customer.button }}</p>
            <p><strong>سائیڈ جیب:</strong> {{ customer.side_pocket }}</p>

            <p class="mt-4"><strong>اضافی معلومات:</strong> {{ customer.extra_info }}</p>
        </div>
    </div>
</template>
<style scoped>
form {
    font-family: "Noto Nastaliq Urdu", serif;
    text-wrap: nowrap;
}

input {
    outline: none;
    width: 100%;
    font-family: 'Courier New', Courier, monospace;
    background-color: #e5e7eb48;
}

textarea {
    background-color: #e5e7eb48;
}

input[type="checkbox"] {
    width: auto;
}

input::placeholder {
    font-family: "Noto Nastaliq Urdu", serif;
}

h3 {
    margin-bottom: 40px;
}

input[type="checkbox"]:disabled,
input[type="radio"]:disabled {
    accent-color: #0ea5e9;
    /* Tailwind's indigo-700 */
}
</style>