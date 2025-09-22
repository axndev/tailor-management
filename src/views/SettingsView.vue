<template>
    <div class="w-full lg:w-[80vw] lg:p-10 p-5">
        <h2 class="text-2xl text-gray-800 font-semibold">Settings</h2>
        <div class="lg:mt-4">
            <div class="pt-5 ">
                <div class="flex flex-col gap-3">
                    <router-link to="/profile"
                        class="flex justify-between gap-2 bg-white text-gray-900 font-semibold text- p-3 rounded border-2 border-gray-100 cursor-pointer">
                        <span class="flex items-center gap-2">
                            <svg fill="#000000" version="1.1" viewBox="144 144 512 512" class="w-7 h-7"
                                xmlns="http://www.w3.org/2000/svg">
                                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                <g id="SVGRepo_iconCarrier">
                                    <g>
                                        <path
                                            d="m401.03 179.58c-55.281 0-100.46 45.094-100.46 100.34 0 55.246 45.18 100.37 100.46 100.37s100.46-45.125 100.46-100.37c-0.003907-55.242-45.184-100.34-100.46-100.34zm0 31.488c38.281 0 68.973 30.645 68.973 68.848 0 38.207-30.691 68.879-68.973 68.879s-68.973-30.672-68.973-68.879c-0.003906-38.203 30.688-68.848 68.969-68.848z">
                                        </path>
                                        <path
                                            d="m399.98 416.88c-103.58 0-187.88 84.266-187.88 187.79 0 4.1758 1.6562 8.1797 4.6094 11.133 2.9531 2.9531 6.957 4.6094 11.133 4.6094s8.1797-1.6562 11.133-4.6094c2.9531-2.9531 4.6133-6.957 4.6133-11.133 0-86.496 69.82-156.3 156.39-156.3s156.43 69.805 156.43 156.3c0 4.1758 1.6562 8.1797 4.6094 11.133 2.9531 2.9531 6.957 4.6094 11.133 4.6094 4.1758 0 8.1797-1.6562 11.133-4.6094 2.9531-2.9531 4.6133-6.957 4.6133-11.133 0-103.53-84.332-187.79-187.91-187.79z">
                                        </path>
                                    </g>
                                </g>
                            </svg>
                            <span class="md:text-lg text-md">Profile</span>
                        </span>
                        <span>
                           <svg fill="#000000" version="1.1" viewBox="144 144 512 512" class="w-6 h-6"
                                xmlns="http://www.w3.org/2000/svg">
                                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                <g id="SVGRepo_iconCarrier">
                                    <path
                                        d="m324.43 525.95c-0.003906-3.3398 1.3203-6.5508 3.6797-8.9141l117.06-117.04-117.04-117.04c-4.9141-4.918-4.9141-12.891 0-17.812 4.918-4.9141 12.891-4.9141 17.812 0l134.87 134.87-134.87 134.87c-4.9219 4.9141-12.895 4.9141-17.812 0-2.375-2.3711-3.707-5.5898-3.7031-8.9453z">
                                    </path>
                                </g>
                            </svg>
                        </span>
                    </router-link>
                    <router-link to="/trash"
                        class="flex justify-between gap-2 bg-white text-gray-900 font-semibold text- p-3 rounded border-2 border-gray-100 cursor-pointer">
                        <span class="flex items-center gap-2">
                            <svg fill="#000000" version="1.1" viewBox="144 144 512 512"
                            class="w-6 h-6"
                                xmlns="http://www.w3.org/2000/svg">
                                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                <g id="SVGRepo_iconCarrier">
                                    <g>
                                        <path
                                            d="m352.77 179.58c-17.172 0-31.488 14.316-31.488 31.488v31.488h-94.402c-8.6953 0-15.742 7.0508-15.742 15.742 0 8.6953 7.0508 15.742 15.742 15.742l15.684 0.003906v299.14c0 25.895 21.34 47.23 47.23 47.23h220.42c25.895 0 47.23-21.34 47.23-47.23v-299.14h15.684c8.6953 0 15.742-7.0508 15.742-15.742 0-8.6953-7.0508-15.742-15.742-15.742-31.469-0.003906-62.934-0.003906-94.402-0.003906v-31.488c0-17.172-14.316-31.488-31.488-31.488zm0 31.488h94.465v31.488h-94.465zm-78.719 62.977h251.91v299.14c0 8.9961-6.75 15.742-15.742 15.742h-220.42c-8.9922 0-15.742-6.75-15.742-15.742z">
                                        </path>
                                        <path
                                            d="m352.77 352.77c-4.1758 0-8.1797 1.6602-11.133 4.6133-2.9531 2.9531-4.6094 6.957-4.6094 11.133v125.95-0.003906c0 4.1758 1.6562 8.1836 4.6094 11.133 2.9531 2.9531 6.957 4.6133 11.133 4.6133s8.1797-1.6602 11.133-4.6133c2.9531-2.9492 4.6133-6.957 4.6133-11.133v-125.95 0.003907c0-4.1758-1.6602-8.1797-4.6133-11.133-2.9531-2.9531-6.957-4.6133-11.133-4.6133z">
                                        </path>
                                        <path
                                            d="m447.23 352.77c-4.1758 0-8.1797 1.6602-11.133 4.6133s-4.6094 6.957-4.6094 11.133v125.95-0.003906c0 4.1758 1.6562 8.1836 4.6094 11.133 2.9531 2.9531 6.957 4.6133 11.133 4.6133s8.1797-1.6602 11.133-4.6133c2.9531-2.9492 4.6133-6.957 4.6133-11.133v-125.95 0.003907c0-4.1758-1.6602-8.1797-4.6133-11.133s-6.957-4.6133-11.133-4.6133z">
                                        </path>
                                    </g>
                                </g>
                            </svg>
                            <span class="md:text-lg text-md">Trash</span>
                        </span>
                        <span>
                            <svg fill="#000000" version="1.1" viewBox="144 144 512 512" class="w-8 h-8"
                                xmlns="http://www.w3.org/2000/svg">
                                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                <g id="SVGRepo_iconCarrier">
                                    <path
                                        d="m324.43 525.95c-0.003906-3.3398 1.3203-6.5508 3.6797-8.9141l117.06-117.04-117.04-117.04c-4.9141-4.918-4.9141-12.891 0-17.812 4.918-4.9141 12.891-4.9141 17.812 0l134.87 134.87-134.87 134.87c-4.9219 4.9141-12.895 4.9141-17.812 0-2.375-2.3711-3.707-5.5898-3.7031-8.9453z">
                                    </path>
                                </g>
                            </svg>
                        </span>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>