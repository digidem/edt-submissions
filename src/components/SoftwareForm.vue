<template>
  <q-page class="q-mt-lg text-center">
    <div v-if="loading" class="q-pa-md">
      <q-spinner color="primary" size="3em" />
      <p class="text-h6 q-mt-md">Loading form...</p>
    </div>
    <q-form v-else-if="databaseInfo" style="width:100%" @submit="submitForm">
      <p class="text-subtitle1 text-weight-bold">Please complete this form to add a new software tool to the database</p>
      
      <template v-for="key in fieldOrder" :key="key">
        <template v-if="databaseInfo[key]">
          <template v-if="databaseInfo[key].type === 'title' || databaseInfo[key].type === 'rich_text' || databaseInfo[key].type === 'url' || databaseInfo[key].type === 'number'">
            <q-input 
              class="q-pt-md" 
              filled 
              v-model="form[key]" 
              :label="databaseInfo[key].name" 
              :hint="getHint(key)"
              :type="getInputType(databaseInfo[key].type)"
              :required="databaseInfo[key].type === 'title'"
              :autogrow="databaseInfo[key].type === 'rich_text'"
            />
          </template>
          
          <template v-else-if="databaseInfo[key].type === 'select' || databaseInfo[key].type === 'multi_select'">
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
import { ref, onMounted } from 'vue'
import { api } from 'boot/axios'
import isEmpty from 'lodash.isempty'
import { useQuasar } from 'quasar'
import { ratingOptions, languagesOptions } from '../lib/sharedOptions'

const $q = useQuasar()

defineOptions({
  name: 'SoftwareForm'
})

const databaseInfo = ref(null)
const form = ref({})
const loading = ref(true)

const fieldOrder = [
  'Name', 'Description', 'Problem it addresses', 'Website link', 'Logo (url)', 'Suggested by', 
  'Suggested by (email)', 'Skillset needed for install/maintenance', 'Systems (OS)', 'Category', 
  'Tags', 'Languages', 'Documentation', 'Usability', 'Data Sovereignty', 'Reliability', 
  'Easy to translate', 'Security', 'Community', 'More info'
]

const getOptions = (field) => {
  if (field.name === 'Languages') {
    return [...languagesOptions, 'Other'];
  } else if (['Documentation', 'Usability', 'Data Sovereignty', 'Reliability', 
              'Easy to translate', 'Security', 'Community'].includes(field.name)) {
    return ratingOptions;
  } else if (field.type === 'select' || field.type === 'multi_select') {
    const options = field.select?.options || field.multi_select?.options;
    if (options) {
      const optionNames = options.map(option => option.name);
      return optionNames.includes('Other') ? optionNames : [...optionNames, 'Other'];
    }
    return ['Other'];
  }
  return [];
}

const isOtherSelected = (value) => {
  if (Array.isArray(value)) {
    return value.includes('Other')
  }
  return value === 'Other'
}

const getHint = (key) => {
  const hints = {
    'Name': "Name of the software",
    'Description': "Brief description of the software",
    'Problem it addresses': "What problem does this software solve?",
    'Website link': "Official website of the product",
    'Logo (url)': "Direct link to the software's logo",
    'Suggested by': "Name of the person suggesting this software",
    'Suggested by (email)': "Email of the person suggesting this software",
    'Skillset needed for install/maintenance': "Required skills for installation and maintenance",
    'Systems (OS)': "Compatible operating systems",
    'Category': "Select the main category of the software",
    'Tags': "Select all applicable tags",
    'Languages': "Select all programming languages used",
    'Documentation': "Rate the quality of documentation",
    'Usability': "Rate the usability of the software",
    'Data Sovereignty': "Rate the data sovereignty features",
    'Reliability': "Rate the reliability of the software",
    'Easy to translate': "Rate how easy it is to translate the software",
    'Security': "Rate the security features",
    'Community': "Rate the community support",
    'More info': "Additional information about the software"
  }
  return hints[key] || databaseInfo.value[key]?.description
}

const getOtherHint = (key) => {
  const otherHints = {
    'Category': "Specify other category",
    'Tags': "Specify other tags, separate multiple with commas",
    'Languages': "Specify other programming languages, separate multiple with commas",
    'Systems (OS)': "Specify other operating systems, separate multiple with commas"
  }
  return otherHints[key] || `Specify other ${key.toLowerCase()}, separate multiple with commas`
}

const getInputType = (type) => {
  if (type === 'number') return 'number'
  if (type === 'url') return 'url'
  if (type === 'rich_text') return 'textarea'
  return 'text'
}

onMounted(async () => {
  try {
    loading.value = true
    const response = await api({
      method: 'POST',
      url: `database`,
      headers: { 'Content-Type': 'application/json' },
      data: { database: import.meta.env.VITE_NOTION_SOFTWARE_DATABASE_ID}
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
    } else if (field.type === 'select') {
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
        number: parseFloat(form.value[key])
      }
    } else if (field.type === 'url') {
      properties[key] = {
        url: form.value[key]
      }
    } else if (field.type === 'select') {
      if (form.value[key] && form.value[key] !== 'Other') {
        properties[key] = {
          select: { name: form.value[key] }
        }
      } else if (form.value[key] === 'Other' && form.value[`other${key}`]) {
        properties[key] = {
          select: { name: form.value[`other${key}`] }
        }
      }
    } else if (field.type === 'multi_select') {
      const selectedOptions = form.value[key]
        .filter(item => item !== 'Other')
        .concat(form.value[`other${key}`] ? form.value[`other${key}`].split(',').map(item => item.trim()) : [])
      
      if (selectedOptions.length > 0) {
        properties[key] = {
          multi_select: selectedOptions.map(item => ({ name: item }))
        }
      }
    }
  }

  // Remove empty fields
  let obj = Object.fromEntries(Object.entries(properties).filter(([_, v]) => !isEmpty(v)))

  try {
    const response = await api({
      method: 'POST',
      url: 'pages',
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify({
        databaseId: import.meta.env.VITE_NOTION_SOFTWARE_DATABASE_ID,
        properties: { ...obj }
      })
    })
    console.log('Response:', response)

    if (response.data && !response.data.error) {
      $q.notify({
        color: 'positive',
        message: 'Software form submitted successfully!',
        position: 'top',
      })
      initializeForm()
    } else {
      const errorMessage = response.data.error.body || 'Submission failed!'
      $q.notify({
        color: 'negative',
        message: errorMessage,
        position: 'top',
      })
    }
  } catch (error) {
    console.error('Error submitting form:', error)
    $q.notify({
      color: 'negative',
      message: 'Error submitting form. Please try again.',
      position: 'top',
    })
  }
}
</script>

<style scoped>
/* Add any styles here */
</style>
