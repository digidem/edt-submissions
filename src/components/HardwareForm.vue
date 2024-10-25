<template>
  <q-page class="q-mt-lg text-center">
    <div v-if="loading" class="q-pa-md">
      <q-spinner color="primary" size="3em" />
      <p class="text-h6 q-mt-md">Loading form...</p>
    </div>
    <q-form v-else-if="databaseInfo" style="width:100%" @submit="submitForm">
      <p class="text-subtitle1 text-weight-bold">Please complete this form to add a new hardware tool to the database</p>
      
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
          
          <template v-else-if="!isSubcategoryField(key) && (databaseInfo[key].type === 'select' || databaseInfo[key].type === 'multi_select')">
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
          
          <!-- For subcategory fields -->
          <template v-if="isSubcategoryField(key) && shouldShowSubcategory(key)">
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
import { languagesOptions, ratingOptions } from '../lib/sharedOptions'

const $q = useQuasar()

defineOptions({
  name: 'HardwareForm'
})

const databaseInfo = ref(null)
const form = ref({})
const loading = ref(true)

// Define the order of fields as in the original HardwareForm
const fieldOrder = [
  'Name', 'Model', 'Manufacturer', 'Description', 'Price', 'Photo', 'Product website', 'Recommended by',
  'Dimensions', 'Used by', 'Pros/Cons', 'More info', 'Other useful links',
  'Hardware categories', 'User device subcategories', 'HAM radio subcatagories', 'Network subcategories',
  'Recording equipment subcategories', 'Server subcategories', 'Storage subcategories',
  'Communication bands', 'Tags', 'Transfer velocity',
  'Security', 'Power consumption', 'Robustness', 'Reliability', 'Maintainability',
  'Performance', 'Function range', 'Scalability', 'Adaptability', 'Configurability', 'Price rating'
]

const getOptions = (field) => {
  if (field.name === 'Languages') {
    return [...languagesOptions, 'Other'];
  } else if (['Security', 'Power consumption', 'Robustness', 'Reliability', 'Maintainability', 
              'Performance', 'Function range', 'Scalability', 'Adaptability', 'Configurability', 
              'Price rating'].includes(field.name)) {
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
    'Name': "Name of the hardware item",
    'Model': "Model number or name of the hardware",
    'Manufacturer': "Name of the manufacturer",
    'Description': "Brief description of the hardware item",
    'Price': "Price of the hardware item",
    'Photo': "Direct link to a photo of the hardware item",
    'Product website': "Official website of the product",
    'Recommended by': "Name of the person recommending this hardware",
    'Dimensions': "Physical dimensions of the hardware",
    'Used by': "Organizations or individuals using this hardware",
    'Pros/Cons': "List of pros and cons for this hardware",
    'More info': "Additional information about the hardware",
    'Other useful links': "Any other relevant links (one per line)",
    'Hardware categories': "Select all applicable categories",
    'User device subcategories': "Select all applicable subcategories",
    'HAM radio subcatagories': "Select all applicable subcategories",
    'Network subcategories': "Select all applicable subcategories",
    'Recording equipment subcategories': "Select all applicable subcategories",
    'Server subcategories': "Select all applicable subcategories",
    'Storage subcategories': "Select all applicable subcategories",
    'Communication bands': "Select all applicable communication bands",
    'Tags': "Select all applicable tags",
    'Transfer velocity': "Select the transfer velocity",
    'Security': "Rate the security level",
    'Power consumption': "Rate the power consumption",
    'Robustness': "Rate the robustness",
    'Reliability': "Rate the reliability",
    'Maintainability': "Rate the maintainability",
    'Performance': "Rate the performance",
    'Function range': "Rate the function range",
    'Scalability': "Rate the scalability",
    'Adaptability': "Rate the adaptability",
    'Configurability': "Rate the configurability",
    'Price rating': "Rate the price"
  }
  return hints[key] || databaseInfo.value[key]?.description
}

const getOtherHint = (key) => {
  const otherHints = {
    'Hardware categories': "Specify other categories, separate multiple with commas",
    'User device subcategories': "Specify other subcategories, separate multiple with commas",
    'HAM radio subcatagories': "Specify other subcategories, separate multiple with commas",
    'Network subcategories': "Specify other subcategories, separate multiple with commas",
    'Recording equipment subcategories': "Specify other subcategories, separate multiple with commas",
    'Server subcategories': "Specify other subcategories, separate multiple with commas",
    'Storage subcategories': "Specify other subcategories, separate multiple with commas",
    'Communication bands': "Specify other communication bands, separate multiple with commas",
    'Tags': "Specify other tags, separate multiple with commas"
  }
  return otherHints[key] || `Specify other ${key.toLowerCase()}, separate multiple with commas`
}

const getInputType = (type) => {
  if (type === 'number') return 'number'
  if (type === 'url') return 'url'
  if (type === 'rich_text') return 'textarea'
  return 'text'
}

const subcategoryMap = {
  'User device subcategories': 'User device',
  'HAM radio subcatagories': 'Radio',
  'Network subcategories': 'Network',
  'Recording equipment subcategories': 'Recording equipment',
  'Server subcategories': 'Server',
  'Storage subcategories': 'Storage',
}

const isSubcategoryField = (key) => Object.keys(subcategoryMap).includes(key)

const shouldShowSubcategory = (key) => {
  const parentCategory = subcategoryMap[key]
  return form.value['Hardware categories']?.includes(parentCategory)
}

onMounted(async () => {
  try {
    loading.value = true
    const response = await api({
      method: 'POST',
      url: `database`,
      headers: { 'Content-Type': 'application/json' },
      data: { database: import.meta.env.VITE_NOTION_HARDWARE_DATABASE_ID}
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
        databaseId: import.meta.env.VITE_NOTION_HARDWARE_DATABASE_ID,
        properties: { ...obj }
      })
    })
    console.log('Response:', response)

    if (response.data && !response.data.error) {
      $q.notify({
        color: 'positive',
        message: 'Hardware form submitted successfully!',
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
