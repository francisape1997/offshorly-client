<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-xl font-semibold text-gray-900">Notes</h1>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <button
            @click="$router.push('/note/create')"
            type="button"
            class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto">
                Add note
        </button>
      </div>
    </div>
    <div class="mt-8 flex flex-col">
      <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div class="relative overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">

            <div v-if="selectedNotes.length > 0">
              <button
                @click="deleteModalOpen = true"
                type="button"
                class="inline-flex ml-2 items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-30">
                    Delete
                </button>
            </div>

            <table
                class="min-w-full table-fixed divide-y divide-gray-300">
              <thead class="bg-gray-50">

                <tr>
                  <th
                    scope="col"
                    class="relative w-12 px-6 sm:w-16 sm:px-8">

                    <!-- Multi Select -->
                    <input
                        v-model="selectAllChecked"
                        :checked="selectedNotes.length > 0"
                        @change="selectAll()"
                        type="checkbox"
                        class="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-6"
                    />

                  </th>
                  <th scope="col" class="min-w-[12rem] py-3.5 pr-3 text-left text-sm font-semibold text-gray-900">Body</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Last Name</th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span class="sr-only">Edit</span>
                  </th>
                </tr>

              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">

                <tr
                    v-for="note in notes"
                    :key="note.id"
                >

                  <td class="relative w-12 px-6 sm:w-16 sm:px-8">

                    <div
                        class="absolute inset-y-0 left-0 w-0.5 bg-indigo-600">
                    </div>

                    <input
                        v-model="selectedNotes"
                        type="checkbox"
                        class="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-6"
                        :value="note.id"/>
                  </td>

                  <td class="py-4 pr-3 text-sm font-medium">
                    {{ note.title }}
                  </td>

                  <td class="px-3 py-4 text-sm text-gray-500">
                    {{ note.body }}
                  </td>

                  <td class="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">

                    <button
                        @click="$router.push(`/note/${note.id}/edit`)"
                        class="text-indigo-600 hover:text-indigo-900">
                        Edit
                    </button>

                  </td>
                </tr>
              </tbody>
            </table>

          </div>
        </div>
      </div>
    </div>

    <Modal
        :open="deleteModalOpen"
        @close="deleteModalOpen = false"
        @confirm="deleteNotes()"
        :loading="isLoading"/>

  </div>
</template>

<script>

// Vue
import { ref } from 'vue';

// Http
import { http } from '../../services/http.js';

// Components
import Modal from '../../components/modal/index.vue';

export default {
    name: 'Notes',

    components: {
        Modal,
    },

    setup() {

        const isLoading = ref(false);

        const notes = ref([]);

        const selectedNotes = ref([]);

        const selectAllChecked = ref(false);

        const deleteModalOpen = ref(false);

        const fetchNotes = async () => {
            const response = await http.get('note');

            if (response.status === 200) {
                notes.value.push(...response.data.data);
            }
        };

        fetchNotes();

        const selectAll = () => {

            if (selectAllChecked.value) {
                selectedNotes.value = [];

                for (const note of notes.value) {
                    selectedNotes.value.push(note.id);
                }
            } else {
                selectedNotes.value = [];
            }
        };

        const deleteNotes = () => {
            const deletedNotes = [];

            isLoading.value = true;

            for (const noteId of selectedNotes.value) {
                deletedNotes.push(http.delete(`note/${noteId}`));
            }

            Promise.all(deletedNotes)
                .finally(() => {

                    for (const noteId of selectedNotes.value) {
                        const index = notes.value.findIndex(item => item.id === noteId);
                        
                        notes.value.splice(index, 1);
                    }

                    isLoading.value = false;
                    deleteModalOpen.value = false;
                    selectedNotes.value = [];
                })
                .catch((err) => {
                    console.error(err);
                    isLoading.value = false;
                    deleteModalOpen.value = false;
                });
        };

        return {
            notes,
            selectedNotes,
            selectAllChecked,
            deleteModalOpen,
            isLoading,

            selectAll,
            deleteNotes,
        };
    },
}
</script>
