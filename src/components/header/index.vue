<template>
  <Popover class="relative bg-white">
    <div class="w-full mx-auto px-4 sm:px-6">
      <div class="flex justify-between items-center border-b-2 border-gray-100 py-6 md:justify-start md:space-x-10">
        <div class="flex justify-start lg:w-0 lg:flex-1">
          <a href="#">
            <img class="h-8 w-auto sm:h-10" src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg" alt="" />
          </a>
        </div>

        <div
            v-if="!route.meta.page"
            class="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
            <button
                :disabled="isLoading"
                :class="{ 'opacity-25 cursor-not-allowed': isLoading }"
                @click="signOut()"
                class="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
            <Spinner v-if="isLoading" />
                Logout
            </button>
        </div>
      </div>
    </div>
  </Popover>
</template>

<script>

// Http
import { http } from '../../services/http.js';

// Vue
import { ref } from 'vue';

// Router
import { useRouter, useRoute } from 'vue-router';

// Components
import Spinner from '../../components/spinner/index.vue';
import { Popover, PopoverButton, PopoverGroup, PopoverPanel } from '@headlessui/vue';
import {
  MenuIcon,
  XIcon,
} from '@heroicons/vue/outline';

export default {
    name: 'TopNav',

    components: {
        Popover,
        PopoverButton,
        PopoverGroup,
        PopoverPanel,
        MenuIcon,
        XIcon,
        Spinner,
    },

    setup() {

        const router = useRouter();
        const route = useRoute();

        const isLoading = ref(false);

        const setLoading = () => {
            isLoading.value = !isLoading.value;
        };

        const signOut = async () => {

            setLoading();

            const response = await http.post('logout');

            if (response.status === 200) {
                localStorage.removeItem('token');

                router.push('/login');
            }

            setLoading();
        };

        return {
            signOut,
            isLoading,
            route,
        };
    },
}
</script>
