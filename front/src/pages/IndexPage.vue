<template>
  <q-page class="row items-center justify-evenly">
      <div class="q-gutter-y-md">
        <h2 class="text-center">Gobin-Léso</h2>

        <div class="q-col-gutter-x-md row justify-between">
          <q-input class="col-6" label="Mot à rechercher" :rules="[(val) => !!val || 'Ce champ est obligatoire']" v-model="search" outlined />
          <q-input class="col-6" label="Nombre de pages" v-model="nbPage" outlined />
        </div>

        <div class="q-gutter-x-md row justify-between">
          <q-btn @click="get()" :loading="loadingGet" :disable="loadingDownload" label="Rechercher" color="primary" no-caps/>
          <q-btn @click="download()" :loading="loadingDownload" :disable="loadingGet" label="Télécharger" color="primary" flat no-caps/>
        </div>

        <div>
          <div class="q-pb-md" v-for="(result, index) in results" :key="index">
            <div>Url : {{result.url}}</div>
            <div v-for="mail in result.mails" :key="mail">
              <div>Mail : {{mail ?? "pas de mail trouvé"}}</div>
            </div>
          </div>
        </div>
      </div>
  </q-page>
</template>

<script lang="ts" setup>
import { ref, Ref } from 'vue';
import { api } from 'src/boot/axios';
import { exportFile } from 'quasar'

const search: Ref<string> = ref('');
const nbPage: Ref<string> = ref('');
const results: Ref<any[]> = ref([]);
const loadingGet: Ref<boolean> = ref(false)
const loadingDownload: Ref<boolean> = ref(false)

const get = async () => {
  loadingGet.value = true
  const response = await api.get(`scrap-email?nbPage=${nbPage.value}&search=${search.value}`);
  results.value = response.data
  loadingGet.value = false;
}

const download = async () => {
  loadingDownload.value = true
  await api.get(`scrap-email/excel?nbPage=${nbPage.value}&search=${search.value}`, { responseType: 'blob' }).then((response) => {
    exportFile('mails.xlsx', response.data)
  })
  loadingDownload.value = false;
}


</script>
