<script setup>
import { useLayout } from '@/layout/composables/layout';
import { ref, computed ,onMounted} from 'vue';
import AppConfig from '@/layout/AppConfig.vue';
import { useRouter } from 'vue-router';
import router from '../../router';
import { useStore } from 'vuex';
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";

const confirm = useConfirm();
const toast = useToast();
const dialogVisible = ref(false);
const tasks =ref([]);
const isLoading = ref(false);
const fonctionChange = ref(false);
const store = useStore()
const { layoutConfig, contextPath } = useLayout();
const form = ref({
     id:undefined,
     designation:"CRUD",
     description:"Hello word",
     status:1
})

const loadTask = async () => {
        await store.dispatch("task/findAll")
        .then((response) => {
            tasks.value = response.data
            console.log(tasks)
        })
        .catch((error) => {
            console.log(error)
        });
    }


  const itemsPerPage = 5

  const currentPage = ref(1)
  const start = computed(() => (currentPage.value - 1) * itemsPerPage)
  const end = computed(() => start.value + itemsPerPage)
  const displayedTasks = computed(() => tasks.value.slice(start.value, end.value))
  const totalPages = computed(() => Math.ceil(tasks.value.length / itemsPerPage))
        
  function changePage(page) {
      currentPage.value = page
  }
        
  function previousPage() {
      if (currentPage.value > 1) {
          currentPage.value--
      }
  }
        
  function nextPage() {
      if (currentPage.value < totalPages.value) {
          currentPage.value++
      }
  }

  function editModalTask (item){
    dialogVisible.value = true
    form.value.id = item.id
    form.value.description = item.description
    form.value.designation = item.designation
    form.value.status = item.status
    fonctionChange.value = true
    
  }

  const saveTask = async () => {
    if (!isLoading.value) {
        isLoading.value = true; 
            await store.dispatch("task/save",form.value)
            .then(() => {
                toast.add({ severity: 'success', summary: 'Success', detail: 'Donnée enregistrer avec succès', life: 3000, className: 'toast-success' }); // Ajoutez la classe 'toast-success'
                loadTask()
                isLoading.value = false;
                dialogVisible.value = false;
                form.value.description=''
                form.value.designation=''
            })
            .catch((error) => {
                toast.add({ severity: 'error', summary: 'Error', detail: 'Veuillez vérifier les informations et réessayer.', life: 3000, className: 'toast-error' }); // Ajoutez la classe 'toast-error'
                isLoading.value = false;
            });
        }
};
  const editTask = async () => {
    if (!isLoading.value) {
        isLoading.value = true; 
            await store.dispatch("task/update",form.value)
            .then(() => {
                toast.add({ severity: 'success', summary: 'Success', detail: 'Donnée modifier avec succès', life: 3000, className: 'toast-success' }); // Ajoutez la classe 'toast-success'
                loadTask()
                isLoading.value = false;
                dialogVisible.value = false;
                fonctionChange.value= false
                form.value.description=''
                form.value.designation=''
            })
            .catch((error) => {
                toast.add({ severity: 'error', summary: 'Error', detail: 'Veuillez vérifier les informations et réessayer.', life: 3000, className: 'toast-error' }); // Ajoutez la classe 'toast-error'
                isLoading.value = false;
            });
        }
};
  const deleteTask = async (id) => {
    if (!isLoading.value) {
        isLoading.value = true; 
            await store.dispatch("task/delete",id)
            .then(() => {
                toast.add({ severity: 'success', summary: 'Success', detail: 'Donnée supprimer avec succès', life: 3000, className: 'toast-success' }); // Ajoutez la classe 'toast-success'
                loadTask()
                isLoading.value = false;
            })
            .catch((error) => {
                toast.add({ severity: 'error', summary: 'Error', detail: 'Veuillez vérifier les informations et réessayer.', life: 3000, className: 'toast-error' }); // Ajoutez la classe 'toast-error'
                isLoading.value = false;
            });
        }
};

onMounted(() => {
  loadTask()
});

</script>
<template>
    <Toast />
    <div  class="container main__">
      <div class="pt-3">
            <p class="title_">
                To-Do List
            </p>
            <p class="subtitle_">Acceuil / Tâches / <strong>Liste tâches</strong></p>
        </div>
        <div class="content">
            <div class="d_search">
                <div>
                    <strong>Liste tâches</strong>
                </div>
                <div>
                    <button class="button is-small is-primary"  @click="dialogVisible = true">
                            <span>Ajouter une tâche</span>
                            <span class="icon is-small">
                                <i class="pi pi-plus ml-3"></i>
                            </span>
                    </button>
                </div>
            </div>
            <div class="mt-5">
                <Card>
                  <template #content>
                      <div  class="table-container">
                          <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth ">
                              <tr>
                                  <th  style="text-align: left;">DESIGNATION</th>
                                  <th  style="text-align: left;">DESCRIPTION</th>
                                  <th  style="text-align: right;">STATUS</th>
                                  <th  style="text-align: right;">ACTIONS</th>
                              </tr>
                              <tr v-for="item in displayedTasks" :key="item.id">
                                    <td style="text-align: left;">{{ item.designation }}</td>
                                    <td style="text-align: left;">{{ item.description }}</td>
                                    <td style="text-align: right;">
                                      <span class="tag is-danger" v-if="item.status == 0">non-complétées</span>
                                      <span class="tag is-success" v-if="item.status == 1">complétées</span>
                                  </td>
                                  <td>
                                    <p class="buttons " style="text-align: right;">
                                        <a class="button is-danger" @click="deleteTask(item.id)"  >
                                            <span class="icon is-small">
                                            <i class="pi pi-trash"></i>
                                            </span>
                                        </a>
                                        <a class="button is-success"  @click="editModalTask(item)" >
                                            <span class="icon is-small">
                                            <i class="pi pi-pencil"></i>
                                            </span>
                                        </a>
                                    </p>
                                  </td>
                              </tr>
                          </table>
                          <div v-if="Object.keys(tasks).length == 0 " class="nodata">
                              <img src="../../assets/img/undraw_no_data_re_kwbl.svg" alt="" width="100">
                          </div>
                      </div>
                      <div class="pagination">
                        <button class="button is-small"  @click="previousPage"  >
                            <span class="icon is-small">
                            <i class="pi pi-angle-left mr-3"></i>
                            </span>
                            <span>Précedent</span>
                        </button>
                        <button class="button is-small"  @click="nextPage"  >
                            <span>Suivant</span>
                            <span class="icon is-small">
                                <i class="pi pi-angle-right ml-3"></i>
                            </span>
                        </button>
                      </div>
                  </template>
                </Card>
            </div>
        </div>
        <div>
          <el-dialog
            v-model="dialogVisible"
            :title="fonctionChange == true ? 'Modifier une tâche' : 'Ajouter une tâche'"
            width="500"
            :before-close="handleClose"
          >
          <div class="container main">
              <div class="card_">
                  <hr>
                  <div class="form_">
                      <div>
                          <div>
                            <form action="" method="post" @submit.prevent="fonctionChange == true ? editTask() : saveTask()">
                                <div>
                                    <label for="" class="title_">Status <span style="color: red;">*</span></label> <br>
                                    <div class="control">
                                        <label class="radio">
                                            <input type="radio" name="status" v-model="form.status" value="1" checked />
                                            Complétées
                                        </label>
                                        <label class="radio">
                                            <input type="radio" name="status" v-model="form.status" value="0" />
                                            Non Complétées
                                        </label>
                                    </div>
                                </div> 
                                <div class="mt-3">
                                    <label for="" class="title_">Désignation <span style="color: red;">*</span></label> <br>
                                    <div class="p_serach">
                                        <input type="text" v-model="form.designation" class="input_" required>
                                    </div>
                                </div>
                                <div class="mt-5 mb-5">
                                    <label for="" class="title_">Description <span style="color: red;">*</span></label> <br>
                                    <div class="">
                                        <textarea class="textarea input_" required v-model="form.description" placeholder="e.g. Hello world"></textarea>
                                    </div>
                                </div>
                                <div>
                                    <div class="footer_btn">
                                        <button type="button" class="btn btn-secondary btn-lg btn__ mr-2" @click="dialogVisible = false">Annuler</button>
                                        <button type="button" class="btn btn-primary btn-lg btn_" v-if="!isLoading" @click="fonctionChange == true ? editTask() : saveTask()">Ajouter</button>
                                        <button type="button" class="btn btn-primary btn-lg btn_" v-if="isLoading">Chargement..</button>
                                    </div>
                                </div>
                            </form>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          </el-dialog>
        </div>
    </div>
</template>
<style scoped> 
.toast-message {
    padding: 16px;
    border-radius: 4px;
}

.toast-success {
    background-color: #4CAF50 !important; /* Vert */
    color: white;
}

.toast-error {
    background-color: #f44336; /* Rouge */
    color: white;
}

</style>