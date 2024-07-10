<template>
  <q-page class="q-mt-lg text-center">
    <q-form style="width:100%" @submit="submitForm">
      <p class="text-subtitle1 text-weight-bold">Please answer the following questions</p>
      <q-input filled v-model="form.name" label="Name of publication" required />
      <q-input class="q-pt-md" filled v-model="form.authoredBy" label="Authored by (Org/Community/Individual)" required />
      <q-input class="q-pt-md" filled v-model="form.dateOfPublication" type="date" label="Date of publication" />
      <q-input class="q-pt-md" filled v-model="form.description" type="textarea" autogrow label="Please describe the resource" />
      <q-input class="q-pt-md" filled v-model="form.links" type="url" label="Please add a link to the resource" />
      <q-input class="q-pt-md" filled v-model="form.suggestedBy" type="text" label="Suggested by" />
      <q-input class="q-pt-md" filled v-model="form.suggestedByEmail" type="text" label="Suggested by email" />
      
      <p class="q-pt-xl text-subtitle1 text-weight-bold">Please select one or more of the available options for the following questions</p>
      <q-select use-chips class="q-pt-md" filled v-model="form.type" :options="typeOptions" label="Type of publication" multiple />
      <q-select use-chips class="q-pt-md" filled v-model="form.categories" :options="categoriesOptions" label="Categories" multiple />
      <q-select use-chips class="q-pt-md" filled v-model="form.languages" :options="languagesOptions" label="Languages" multiple />

      <p class="q-pt-xl text-subtitle1 text-weight-bold">Please choose a rating between 1-5 stars for the following question</p>
      <q-select tags class="q-pt-md" filled v-model="form.easyToTranslate" :options="easyToTranslateOptions" label="How easy is it to translate?" />
      <q-input class="q-pt-xl" filled v-model="form.moreInfo" type="textarea" autogrow label="Would you like to add any more information?" />
      <q-btn class="q-mt-md q-mb-xl justify-center" type="submit" label="Submit" color="primary" />
    </q-form>
  </q-page>
</template>

<script setup>
  import { ref } from 'vue'
  import { api } from 'boot/axios'
  import isEmpty from 'lodash.isempty'
  import languagesOptions from '../lib/languages-helper'
  import { useQuasar } from 'quasar'

  const $q = useQuasar()

  defineOptions({
    name: 'NotionForm'
  })
  
  const form = ref({
    name: '',
    authoredBy: '',
    dateOfPublication: '',
    description: '',
    categories: [],
    languages: [],
    links: '',
    easyToTranslate: '',
    status: '',
    moreInfo: '',
    suggestedBy: '',
    suggestedByEmail: '',
    type: []
  })
  
  const easyToTranslateOptions = [
    '⭐⭐⭐⭐⭐',
    '⭐⭐⭐⭐',
    '⭐⭐⭐',
    '⭐⭐',
    '⭐'
  ];

  const categoriesOptions = [
    'Security',
    'Other',
    'Fundraising',
    'Storytelling',
    'Language',
    'Land',
    'Governance',
    'Culture',
    'Communications',
    'Collaboration',
    'Accounting'
  ];

  const typeOptions = [
    'Guide',  
    'Community case study',  
    'Documentation',
    'Tutorial',
    'Guidelines', 
    'Checklist',  
    'FAQ', 
    'Other'
  ];

  async function submitForm () {
    // create form object
    const properties = {
      Name: {
        title: [
          {
            text: {
              content: form.value.name
            }
          }
        ]
      },
      'Authored by (Org/Community/Individual)': {
        rich_text: [
          {
            text: {
              content: form.value.authoredBy
            }
          }
        ]
      },
      'More info': {
        rich_text: [
          {
            text: {
              content: form.value.moreInfo
            }
          }
        ]
      },
      'Suggested by': {
        rich_text: [
          {
            text: {
              content: form.value.suggestedBy
            }
          }
        ]
      },
      'Suggested by email': {
        rich_text: [
          {
            text: {
              content: form.value.suggestedByEmail
            }
          }
        ]
      },
      'More info': {
        rich_text: [
          {
            text: {
              content: form.value.moreInfo
            }
          }
        ]
      },
      'Date of publication': {
        date: {
          start: form.value.dateOfPublication
        }
      },
      'Description': {
        rich_text: [
          {
            text: {
              content: form.value.description
            }
          }
        ]
      },
      'Languages': {
        multi_select: form.value.languages.map(lang => ({ name: lang }))
      },
      'Categories': {
        multi_select: form.value.categories.map(cat => ({ name: cat }))
      },
      'Type': {
        multi_select: form.value.type.map(type => ({ name: type }))
      },
      'Links': {
        url: form.value.links
      },
      'Easy to translate': {
        select: { name: form.value.easyToTranslate }
      }
    }
    
    // remove unresponded questions
    const isItemEmpty = (value) => {
      if (typeof value === 'object' && value !== null) {
        for (const v of Object.values(value)) {
          if (isItemEmpty(v)) return true;
        }
      }
      return isEmpty(value);
    };

    let obj = Object.fromEntries(Object.entries(properties).filter(([_, v]) => !isItemEmpty(v)));
    
    // send to notion API server
    try {
      const response = await api({
        method: 'POST',
        url: 'pages',
        headers: {
          'Content-Type': 'application/json',
        },
        data: JSON.stringify({
          databaseId: import.meta.env.VITE_NOTION_GUIDES_DATABASE_ID,
          properties: {
            ...obj
          }
        })
      });

      if (response) {
        $q.notify('Form submitted successfully!');
      } else {
        $q.notify('Failed to submit form.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      $q.notify('Error submitting form.');
    }
  }
</script>

<style scoped>
/* Add any styles here */
</style>
