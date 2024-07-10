<template>
  <q-page class="col-12 col-lg-6 col-sm-9 q-mx-md">
      <SelectSubmission class="row justify-center" v-model="selection"/>
      <SoftwareForm v-if="selection === 'tool'" class="row justify-center q-mx-sm"/>
      <HardwareForm v-if="selection === 'hardware'" class="row justify-center q-mx-sm"/>
      <GuidesForm v-if="selection === 'guides'" class="row justify-center q-mx-sm" :inputs="inputs"/>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { api } from 'boot/axios'

import SoftwareForm from 'components/SoftwareForm.vue'
import HardwareForm from 'components/HardwareForm.vue'
import GuidesForm from 'components/GuidesForm.vue'
import SelectSubmission from 'components/SelectSubmission.vue'

defineOptions({
  name: 'IndexPage'
});

const selection = ref('')

// TODO: Update form to be created based on database properties
    // This will save us having to manually make update properties and options
    // But will also require a label => property matching function for custom form labels 

    // Helper function for getting database properties
      // (async () => {
      //   const response = await api({
      //     method: 'POST',
      //     url: 'database',
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //     data: { database: import.meta.env.VITE_NOTION_GUIDES_DATABASE_ID }
      //   });
      //   const entries = Object.entries(response.data.data.properties).map(([name, value]) => {
      //     return { [name]: value }
      //   })
      //   console.log({entries})
      // })()


</script>
