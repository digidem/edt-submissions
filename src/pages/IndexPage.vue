<template>
  <q-page class="col-12 col-lg-6 col-sm-9 q-mx-md">
      <SelectSubmission class="row justify-center" v-model="selection"/>
      <SoftwareForm v-if="selection === 'tool'" class="row justify-center q-mx-sm"/>
      <HardwareForm v-if="selection === 'hardware'" class="row justify-center q-mx-sm"/>
      <GuidesForm v-if="selection === 'guides'" class="row justify-center q-mx-sm" :inputs="inputs"/>
      <GroupsForm v-if="selection === 'groups'" class="row justify-center q-mx-sm"/>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { api } from 'boot/axios'

import SoftwareForm from 'src/components/SoftwareForm.vue'
import GroupsForm from 'components/GroupsForm.vue'
import HardwareForm from 'src/components/HardwareForm.vue'
import GuidesForm from 'src/components/GuidesForm.vue'
import SelectSubmission from 'components/SelectSubmission.vue'

defineOptions({
  name: 'IndexPage'
});

const selection = ref('');

</script>
