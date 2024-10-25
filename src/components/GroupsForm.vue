<template>
  <q-page class="q-mt-lg text-center">
    <div v-if="loading" class="q-pa-md">
      <q-spinner color="primary" size="3em" />
      <p class="text-h6 q-mt-md">Loading form...</p>
    </div>
    <q-form v-else-if="databaseInfo" style="width:100%" @submit="submitForm">
      <p class="text-subtitle1 text-weight-bold">Please complete this form to add a new guardian group profile to the database</p>
      
      <template v-for="key in fieldOrder" :key="key">
        <template v-if="databaseInfo[key]">
          <template v-if="databaseInfo[key].type === 'title' || databaseInfo[key].type === 'rich_text' || databaseInfo[key].type === 'url' || databaseInfo[key].type === 'number'">
            <q-input 
              class="q-pt-md" 
              filled 
              v-model="form[key]" 
              :label="databaseInfo[key].name" 
              :hint="getHint(key)"
              :type="databaseInfo[key].type === 'number' ? 'number' : databaseInfo[key].type === 'rich_text' ? 'textarea' : 'text'"
              :required="databaseInfo[key].type === 'title'"
              :autogrow="databaseInfo[key].type === 'rich_text'"
            />
          </template>
          
          <template v-else-if="databaseInfo[key].type === 'select' || databaseInfo[key].type === 'multi_select' || databaseInfo[key].type === 'status'">
            <q-select 
              class="q-pt-md" 
              filled 
              v-model="form[key]" 
              :options="getOptions(databaseInfo[key])"
              :label="databaseInfo[key].name" 
              :multiple="databaseInfo[key].type === 'multi_select'"
              use-chips
              :hint="getHint(key)"
            />
            <q-input 
              v-if="isOtherSelected(form[key])"
              class="q-pt-md" 
              filled 
              v-model="form[`other${key}`]" 
              :label="`Other ${databaseInfo[key].name}`" 
              :hint="getOtherHint(key)" 
            />
          </template>
        </template>
      </template>
      
      <q-btn class="q-mt-md q-mb-xl justify-center" type="submit" label="Submit" color="primary" />
    </q-form>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { api } from 'boot/axios'
import isEmpty from 'lodash.isempty'
import { useQuasar } from 'quasar'
import { languagesOptions } from '../lib/sharedOptions'

const $q = useQuasar()

defineOptions({
  name: 'GroupsFormTest'
})

const databaseInfo = ref(null)
const form = ref({})
const loading = ref(true)

// Define the order of fields as in GroupsForm.vue
const fieldOrder = [
  'Name', 'Description', 'type', 'Nation', 'Location', '# Members',
  'Activities', 'Assets', 'tools', 'Resources', 'Territory support',
  'Can show on map', 'Tags', 'Links', 'profile photo', 'Logo (url)', 'Languages'
]

const getOptions = (field) => {
  if (field.name === 'Languages') {
    return [...languagesOptions, 'Other'];
  } else if (field.type === 'select' || field.type === 'multi_select') {
    return field.select?.options || field.multi_select?.options
      ? [...(field.select?.options || field.multi_select?.options).map(option => option.name), 'Other']
      : ['Other'];
  } else if (field.type === 'status') {
    return field.status?.options
      ? field.status.options.map(option => option.name)
      : [];
  }
  return [];
}

const isOtherSelected = (value) => {
  if (Array.isArray(value)) {
    return value.includes('Other')
  }
  return value === 'Other'
}

const getHint = (key, field) => {
  const hints = {
    Name: "Official name of the guardian group",
    Description: "Brief overview of the group's mission and activities",
    Links: "Website, social media, or other online presence (one per line)",
    Assets: "Select all assets the group has access on",
    "# Members": "Approximate count of active members",
    Activities: "Select all major activities of the group",
    "Can show on map": "Permission to share information with the public",
    tools: "Select all tools utilized by the group",
    Tags: "Select all tags that apply to the group",
    Nation: "Select all nations or peoples the group is associated with",
    "Territory support": "Extent of support in the territory",
    type: "Select all that apply",
    "profile photo": "Direct link to a representative image of the group",
    "Logo (url)": "Direct link to the group's logo image",
    Resources: "Select all sources of funding or support",
    Location: "Main area of operation or headquarters (this must be a google maps location url)",
    Languages: "Select all languages used by the group"
  }
  return hints[key] || field.description
}

const getOtherHint = (key) => {
  const otherHints = {
    Assets: "Specify other assets, separate multiple with commas",
    Activities: "Specify other activities, separate multiple with commas",
    tools: "Specify other tools, separate multiple with commas",
    Tags: "Please add any other relevant tags, separate multiple with commas",
    Nation: "Specify an other nation(s) or peoples, separate multiple with commas",
    "Territory support": "Specify whether the group has full or partial territory support",
    type: "Specify other type(s), separate multiple with commas",
    Resources: "Specify other funding sources, separate multiple with commas",
    Languages: "Specify other language(s), separate multiple with commas"
  }
  return otherHints[key] || `Specify other ${key.toLowerCase()}, separate multiple with commas`
}

onMounted(async () => {
  try {
    loading.value = true
    const response = await api({
      method: 'POST',
      url: `database`,
      headers: { 'Content-Type': 'application/json' },
      data: { database: import.meta.env.VITE_NOTION_GROUPS_DATABASE_ID}
    })
    databaseInfo.value = response.data.data.properties
    console.log('Database Information:', databaseInfo.value)
    initializeForm()
  } catch (error) {
    console.error('Error fetching database information:', error)
    $q.notify({
      color: 'negative',
      message: 'Error fetching database information. Please check the console.',
      position: 'top',
    })
  } finally {
    loading.value = false
  }
})

const initializeForm = () => {
  const initialState = {}
  for (const [key, field] of Object.entries(databaseInfo.value)) {
    if (field.type === 'multi_select') {
      initialState[key] = []
      initialState[`other${key}`] = ''
    } else if (field.type === 'select' || field.type === 'status') {
      initialState[key] = null
      initialState[`other${key}`] = ''
    } else {
      initialState[key] = ''
    }
  }
  form.value = initialState
}

async function submitForm() {
  const properties = {}
  for (const [key, field] of Object.entries(databaseInfo.value)) {
    if (form.value[key] === null || form.value[key] === '') continue; // Skip empty fields
    if (field.type === 'title') {
      properties[key] = {
        title: [{ text: { content: form.value[key] } }]
      }
    } else if (field.type === 'rich_text') {
      properties[key] = {
        rich_text: [{ text: { content: form.value[key] } }]
      }
    } else if (field.type === 'number') {
      properties[key] = {
        number: parseInt(form.value[key])
      }
    } else if (field.type === 'url') {
      properties[key] = {
        url: form.value[key]
      }
    } else if (field.type === 'select') {
      properties[key] = {
        select: { name: form.value[key] === 'Other' ? form.value[`other${key}`] : form.value[key] }
      }
    } else if (field.type === 'multi_select') {
      properties[key] = {
        multi_select: form.value[key]
          .filter(item => item !== 'Other')
          .concat(form.value[`other${key}`] ? form.value[`other${key}`].split(',').map(item => item.trim()) : [])
          .map(item => ({ name: item }))
      }
    } else if (field.type === 'status') {
      properties[key] = {
        status: { name: form.value[key] }
      }
    }
  }

  console.log('Properties:', properties)
  // Remove empty fields
  let obj = Object.fromEntries(Object.entries(properties).filter(([_, v]) => !isEmpty(v)))

  console.log('Obj:', obj)

  try {
    const response = await api({
      method: 'POST',
      url: 'pages',
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify({
        databaseId: import.meta.env.VITE_NOTION_GROUPS_DATABASE_ID,
        properties: { ...obj }
      })
    })
    console.log('Response:', response)

    if (response.data && !response.data.error) {
      $q.notify({
        color: 'positive',
        message: 'Test form submitted successfully!',
        position: 'top',
      })
      initializeForm()
    } else {
      const errorMessage = response.data.error.body || 'Test submission failed!'
      $q.notify({
        color: 'negative',
        message: errorMessage,
        position: 'top',
      })
    }
  } catch (error) {
    console.error('Error submitting test form:', error)
    $q.notify({
      color: 'negative',
      message: 'Error submitting test form. Please try again.',
      position: 'top',
    })
  }
}
</script>

<style scoped>
/* Add any styles here */
</style>
