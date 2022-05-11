<template>
    <div>
        <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8">
            <div>
                <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    OffShorly
                </h2>

            <p class="mt-2 text-center text-sm text-gray-600">
                <span>Don't have an account? </span>

                <button
                    class="font-medium text-indigo-600 hover:text-indigo-500"
                    @click="$router.push('/register')"
                >
                    Register
                </button>
            </p>
            </div>
            <div class="rounded-md shadow-sm -space-y-px">
                <div>
                <label for="email-address" class="sr-only">Email address</label>
                <input v-model="form.email" name="email" type="email" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Email address">
                </div>
                <div>
                <label for="password" class="sr-only">Password</label>
                <input v-model="form.password" name="password" type="password" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Password">
                </div>
            </div>

            <div>
                <button
                    :disabled="!isFormValid"
                    @click="signIn()"
                    :class="{ 'opacity-25 cursor-not-allowed': !isFormValid }"
                    class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">

                <!-- Spinner -->
                <Spinner v-if="isLoading" />

                <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                    <svg class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                    </svg>
                </span>
                Sign in
                </button>
            </div>
        </div>
        </div>

    </div>
</template>

<script>

// Http
import { http } from '../../services/http.js';

// Axios
import axios from 'axios';

// Vue
import { computed, ref } from 'vue';

// Router
import { useRouter } from 'vue-router';

// Components
import Spinner from '../../components/spinner/index.vue';

export default {
    name: 'Login',

    components: {
        Spinner,
    },

    setup() {

        const router = useRouter();

        const form = ref({
            email: null,
            password: null,
        });

        const isLoading = ref(false);

        /**
         * Checks if the form is null or empty string
         * returns bool
         */
        const isFormValid = computed(() => {
            const invalidValues = ['', null];

            return !invalidValues.includes(form.value.email) && !invalidValues.includes(form.value.password);
        });

        const signIn = async () => {

            setLoading();

            const response = await http.post('login', form.value);

            if (response.status === 200) {
                localStorage.setItem('token', response.data.token);

                axios.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem('token')}`;

                router.push({ path: '/notes' });
            }

            setLoading();
        };

        const setLoading = () => {
            isLoading.value = !isLoading.value;
        };

        return {
            signIn,
            form,
            isFormValid,
            isLoading,
        };
    },
}
</script>
