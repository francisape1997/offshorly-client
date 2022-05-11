<template>
<div class="ml-5 mr-10">

  <div class="mt-10 sm:mt-0">
    <div class="md:grid md:grid-cols-3 md:gap-6">
      <div class="md:col-span-1">
        <div class="px-4 sm:px-0">
          <h3 class="text-lg font-medium leading-6 text-gray-900">
              {{ isCreatePage ? 'Create': 'Edit' }} Note
          </h3>
        </div>
      </div>
      <div class="mt-5 md:mt-0 md:col-span-2">
          <div class="shadow overflow-hidden sm:rounded-md">
            <div class="px-4 py-5 bg-white sm:p-6">
              <div class="grid grid-cols-6 gap-6">
                <div class="col-span-6 sm:col-span-3">
                  <label for="first-name" class="block text-sm font-medium text-gray-700">Title</label>

                    <textarea
                      cols="30"
                      rows="10"
                      v-model="form.title"
                      class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">

                    </textarea>
                </div>

                <div class="col-span-6 sm:col-span-3">
                  <label for="last-name" class="block text-sm font-medium text-gray-700">Body</label>

                    <textarea
                      cols="30"
                      rows="10"
                      v-model="form.body"
                      class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">

                    </textarea>
                </div>

              </div>
            </div>
            <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
              <button
                :disabled="isLoading"
                :class="{ 'opacity-25 cursor-not-allowed': isLoading }"
                @click="$router.push('/notes')"
                type="submit"
                class="mr-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                  Cancel
              </button>

              <button
                @click="isCreatePage ? saveNote() : updateNote()"
                :disabled="!isFormValid"
                :class="{ 'opacity-25 cursor-not-allowed': !isFormValid }"
                type="submit"
                class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  {{ isCreatePage ? 'Save' : 'Update' }}

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
    name: 'NoteForm',

    components: {
        Spinner,
    },

    setup() {
        const route = useRoute();
        const router = useRouter();

        const isLoading = ref(false);

        const form = ref({
            title: null,
            body: null,
        });

        const fetchNote = async () => {
            const response = await http.get(`note/${route.params.id}`);

            if (response.status === 200) {
                setNoteForm(response.data);
            }
        };

        const setNoteForm = (note) => {
            form.value.title = note.title;
            form.value.body = note.body;
        };

        const isCreatePage = computed(() => route.meta.page === 'create' ? true : false);

        // If the page is edit. Fetch the note info.
        if (!isCreatePage.value) {
            fetchNote();
        }

        const isFormValid = computed(() => {
            const invalidValues = ['', null];

            const formValue = form.value;

            for (const item of Object.values(formValue)) {
                if (invalidValues.includes(item)) {
                    return false;
                }
            }

            return true;
        });

        const saveNote = async () => {
            isLoading.value = true;
            
            const response = await http.post('note', form.value);

            if (response.status === 200) {
                router.push('/notes');
            }

            isLoading.value = false;
        };

        const updateNote = async () => {
            isLoading.value = true;

            const response = await http.put(`note/${route.params.id}`, form.value);

            if (response.status === 200) {
                router.push('/notes');
            }

            isLoading.value = false;
        };

        return {
            form,
            isFormValid,
            isCreatePage,
            isLoading,

            saveNote,
            updateNote,
        };
    },
};
</script>
