<template>
<div class="ml-5 mr-10">

  <div class="mt-10 sm:mt-0">
    <div class="md:grid md:grid-cols-3 md:gap-6">
      <div class="md:col-span-1">
        <div class="px-4 sm:px-0">
          <h3 class="text-lg font-medium leading-6 text-gray-900">
              Register
          </h3>
        </div>
      </div>

      <div class="mt-5 md:mt-0 md:col-span-2">
          <div class="shadow overflow-hidden sm:rounded-md">
            <div class="px-4 py-5 bg-white sm:p-6">
              <div class="grid grid-cols-6 gap-6">
                <div class="col-span-6 sm:col-span-3">
                  <label for="first-name" class="block text-sm font-medium text-gray-700">First name</label>
                  <input
                    v-model="form.first_name"
                    type="text"
                    name="first-name"
                    autocomplete="given-name"
                    class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                </div>

                <div class="col-span-6 sm:col-span-3">
                  <label for="last-name" class="block text-sm font-medium text-gray-700">Last name</label>
                  <input
                    v-model="form.last_name"
                    type="text"
                    name="last-name"
                    autocomplete="family-name"
                    class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                </div>

                <div class="col-span-6">
                  <label for="email-address" class="block text-sm font-medium text-gray-700">Email address</label>
                  <input
                    v-model="form.email"
                    type="text"
                    name="email-address"
                    autocomplete="email"
                    class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/>

                    <p
                        v-if="!isEmailAddressValid"
                        class="text-red-500 text-xs italic">Invalid Email</p>
                </div>

                <div
                    class="col-span-6">
                  <label for="street-address" class="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    v-model="form.password"
                    type="password"
                    class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/>
                </div>

                <div
                    class="col-span-6">
                  <label for="street-address" class="block text-sm font-medium text-gray-700">Confirm Password</label>
                  <input
                    v-model="form.password_confirmation"
                    type="password"
                    class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/>

                    <p
                        v-if="!isPasswordMatch"
                        class="text-red-500 text-xs italic">Password does not match</p>
                </div>

              </div>
            </div>
            <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">

              <button
                :disabled="isLoading"
                :class="{ 'opacity-25 cursor-not-allowed': isLoading }"
                @click="$router.push('/login')"
                type="submit"
                class="mr-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                  Cancel
              </button>

              <button
                @click="submit()"
                :disabled="!isFormValid"
                :class="{ 'opacity-25 cursor-not-allowed': !isFormValid }"
                type="submit"
                class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Submit
                  
                  <Spinner class="ml-3" v-if="isLoading"/>
              </button>
            </div>
          </div>
      </div>
    </div>
  </div>

</div>
</template>

<script>

// Vue
import { ref, computed } from 'vue';

// Route
import { useRoute, useRouter } from 'vue-router';

// Http
import { http } from '../../services/http.js';

// Components
import Spinner from '../../components/spinner/index.vue';

export default {
    name: 'Register',

    components: {
        Spinner,
    },

    setup() {
        const route = useRoute();
        const router = useRouter();

        const isLoading = ref(false);

        const form = ref({
            first_name: null,
            last_name: null,
            email: null,
            password: null,
            password_confirmation: null,
        });

        const isEmailAddressValid = computed(() => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(form.value.email));

        const isPasswordMatch = computed(() => form.value.password === form.value.password_confirmation);

        const isFormValid = computed(() => {
            const invalidValues = ['', null];

            const formValue = form.value;

            for (const item of Object.values(formValue)) {
                if (invalidValues.includes(item)) {
                    return false;
                }
            }

            if (!isEmailAddressValid.value || !isPasswordMatch.value) {
                return false;
            }

            return true;
        });

        const submit = async () => {

            isLoading.value = true;

            const response = await http.post('register', form.value);

            if (response.status === 200) {
                router.push('/login');
            }

            isLoading.value = false;
        };

        return {
            // fn
            submit,

            // properties
            form,
            isPasswordMatch,
            isEmailAddressValid,
            isLoading,
            isFormValid,
        };
    },
}
</script>
