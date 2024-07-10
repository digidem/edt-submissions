<template>
  <q-page class="q-mt-lg text-center">
    <q-form style="width:100%" @submit="submitForm">
      <p class="text-subtitle1 text-weight-bold">Please answer the following questions</p>
      <q-input filled v-model="form.name" label="Whats the name of the tool?" required />
      <q-input class="q-pt-md" filled v-model="form.description" type="textarea" autogrow label="Can you briefly describe the tool and how commuinties might use it?" />
      <q-input class="q-pt-md" filled v-model="form.problem" type="textarea" autogrow label="What problems does it addresses" />
      <q-input class="q-pt-md" filled v-model="form.websiteLink" type="url" label="Whats the tool website link" />
      <q-input class="q-pt-md" filled v-model="form.logoUrl" type="url" label="Can you please add a link to the tool logo (url)" />
      <q-input class="q-pt-md" filled v-model="form.suggestedBy" type="text" label="This tool is recommended by? (your name)" />
      <q-input class="q-pt-md" filled v-model="form.suggestedByEmail" type="email" label="Email contact (incase we need to contact you)?" />
      <q-input class="q-pt-md" filled v-model="form.skillsetNeeded" autogrow type="textarea" label="What skills are needed to setup and maintain the tool?" />
      
      <p class="q-pt-xl text-subtitle1 text-weight-bold">Please select one or more of the available options for the following questions</p>
      <q-select use-chips class="q-pt-md" filled v-model="form.systems" :options="systemsOptions" label="What operating systems is it available on (OS)?" multiple/>
      <q-select use-chips class="q-pt-md" filled v-model="form.category" :options="categoryOptions" label="What is this tool useful for?" multiple />
      <q-select use-chips class="q-pt-md" filled v-model="form.tags" :options="tagsOptions" label="Please identify any of the following tags" multiple />
      <q-select use-chips class="q-pt-md" filled v-model="form.languages" :options="languagesOptions" label="Please identify which languages the tool is available in" multiple />

      <p class="q-pt-xl text-subtitle1 text-weight-bold">Please choose a rating between 0-5 stars for the following questions</p>
      <q-select tags class="q-pt-md" filled v-model="form.documentation" :options="documentationOptions" label="How well is the tool documented?"/>
      <q-select class="q-pt-md" filled v-model="form.usability" :options="usabilityOptions" label="How easy is it to use?" />
      <q-select class="q-pt-md" filled v-model="form.dataSovereignty" :options="dataSovereigntyOptions" label="How well does the tool support data sovereignty?" />
      <q-select class="q-pt-md" filled v-model="form.reliability" :options="reliabilityOptions" label="How reliable is the tool?" />
      <q-select class="q-pt-md" filled v-model="form.easyToTranslate" :options="easyToTranslateOptions" label="Can the tool be easily translated?" />
      <q-select class="q-pt-md" filled v-model="form.security" :options="securityOptions" label="How secure is the tool?" />
      <q-select class="q-pt-md" filled v-model="form.community" :options="communityOptions" label="How engaged is the community using the tool?" />

      <q-input class="q-pt-xl" filled v-model="form.moreInfo" type="textarea" autogrow label="Would you like to add any more information about the tool and how to use it" />

      <q-btn class="q-mt-md q-mb-xl justify-center" type="submit" label="Submit" color="primary" />
    </q-form>
  </q-page>
</template>

<script setup>
  import { ref } from 'vue'
  import { api } from 'boot/axios'
  import isEmpty from 'lodash.isempty'
  import { useQuasar } from 'quasar'

  const $q = useQuasar()

  defineOptions({
    name: 'SoftwareForm`'
  })
  
  const form = ref({
    name: '',
    moreInfo: '',
    documentation: '',
    systems: [],
    problem: '',
    usability: '',
    suggestedByEmail: '',
    websiteLink: '',
    dataSovereignty: '',
    description: '',
    tags: [],
    reliability: '',
    easyToTranslate: '',
    security: '',
    skillsetNeeded: '',
    suggestedBy: '',
    category: [],
    community: '',
    languages: [],
    logoUrl: ''
  })
  
  const documentationOptions =  [
    '☆','⭐️','⭐️⭐️','⭐️⭐️⭐️','⭐️⭐️⭐️⭐️','⭐️⭐️⭐️⭐️⭐️'
  ]

  const systemsOptions = [
    'Web', 'Mac', 'Android', 'Linux', 'Windows', 'iOS'
  ];

  const usabilityOptions = [
    '☆', '⭐️', '⭐️⭐️', '⭐️⭐️⭐️', '⭐️⭐️⭐️⭐️', '⭐️⭐️⭐️⭐️⭐️'
  ];

  const dataSovereigntyOptions = [
    '☆', '⭐️', '⭐️⭐️', '⭐️⭐️⭐️', '⭐️⭐️⭐️⭐️', '⭐️⭐️⭐️⭐️⭐️'
  ];

  const tagsOptions = [
    'Other', 'Allows data export (no lock in)', 'Pi-friendly (ram)', 'Can be self hosted', 
    'Oral friendly', 'Multi-user on same device', 'Free to use', 'Share information with 3rd parties',
    'Federated', 'Peer-to-peer', 'Open source', 'Works offline', 'Older device friendly',
    'Keyboard Navigation', 'Low visibility'
  ];

  const reliabilityOptions = [
    '☆', '⭐️', '⭐️⭐️', '⭐️⭐️⭐️', '⭐️⭐️⭐️⭐️', '⭐️⭐️⭐️⭐️⭐️'
  ];

  const easyToTranslateOptions = [
    '☆', '⭐️', '⭐️⭐️', '⭐️⭐️⭐️', '⭐️⭐️⭐️⭐️', '⭐️⭐️⭐️⭐️⭐️'
  ];

  const securityOptions = [
    '☆', '⭐️', '⭐️⭐️', '⭐️⭐️⭐️', '⭐️⭐️⭐️⭐️', '⭐️⭐️⭐️⭐️⭐️'
  ];

  const categoryOptions = [
    'Security', 'Education', 'Communication', 'Community'
  ];

  const communityOptions = [
    '☆', '⭐️', '⭐️⭐️', '⭐️⭐️⭐️', '⭐️⭐️⭐️⭐️', '⭐️⭐️⭐️⭐️⭐️'
  ];

  const languagesOptions = ["Afrikaans","Albanian","Amharic","Arabic","Armenian","Assamese","Aymara","Azerbaijani","Bambara","Basque","Belarusian","Bengali","Bhojpuri","Bosnian","Bulgarian","Catalan","Cebuano","Chichewa","Chinese","Corsican","Croatian","Czech","Danish","Dhivehi","Dogri","Dutch","English","Esperanto","Estonian","Ewe","Filipino","Finnish","French","Frisian","Galician","Ganda","Georgian","German","Greek","Guarani","Gujarati","Haitian Creole","Hausa","Hawaiian","Hebrew","Hindi","Hmong","Hungarian","Icelandic","Igbo","Ilocano","Indonesian","Irish","Italian","Japanese","Javanese","Kannada","Kazakh","Khmer","Kinyarwanda","Konkani","Korean","Krio","Kurdish (Kurmanji)","Kurdish (Sorani)","Kyrgyz","Lao","Latin","Latvian","Lingala","Lithuanian","Luganda","Luxembourgish","Macedonian","Maithili","Malagasy","Malay","Malayalam","Maltese","Maori","Marathi","Meiteilon (Manipuri)","Mizo","Mongolian", "Myanmar (Burmese)","Nepali","Norwegian","Nyanja (Chichewa)","Odia (Oriya)","Oromo","Pashto","Persian","Polish","Portuguese","Punjabi","Quechua","Romanian","Russian","Samoan","Sanskrit","Scots Gaelic","Sepedi","Serbian","Sesotho","Shona","Sindhi","Sinhala","Slovak","Slovenian","Somali","Spanish","Sundanese","Swahili","Swedish","Tajik","Tamil","Tatar","Telugu","Thai","Tigrinya","Tsonga","Turkish","Turkmen","Twi","Ukrainian","Urdu","Uyghur","Uzbek","Vietnamese","Welsh","Xhosa","Yiddish","Yoruba","Zulu"
  ]

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
      Documentation: {
        select: { name: form.value.documentation }
      },
      'Systems (OS)': {
        multi_select: form.value.systems.map(sys => ({ name: sys }))
      },
      'Problem it addresses': {
        rich_text: [
          {
            text: {
              content: form.value.problem
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
      Usability: {
        select: { name: form.value.usability }
      },
      'Suggested by (email)': {
        email: form.value.suggestedByEmail
      },
      'Website link': {
        url: form.value.websiteLink
      },
      'Data Sovereignty': {
        select: { name: form.value.dataSovereignty }
      },
      Description: {
        rich_text: [
          {
            text: {
              content: form.value.description
            }
          }
        ]
      },
      Tags: {
        multi_select: form.value.tags.map(tag => ({ name: tag }))
      },
      Reliability: {
        select: { name: form.value.reliability }
      },
      'Easy to translate': {
        select: { name: form.value.easyToTranslate }
      },
      Security: {
        select: { name: form.value.security }
      },
      'Skillset needed for install/maintenance': {
        rich_text: [
          {
            text: {
              content: form.value.skillsetNeeded
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
      Category: {
        multi_select: form.value.category.map(cat => ({ name: cat }))
      },
      Community: {
        select: { name: form.value.community }
      },
      Languages: {
        multi_select: form.value.languages.map(lang => ({ name: lang }))
      },
      'Logo (url)': {
        url: form.value.logoUrl
      }
    }
    
    // remove unresponded questions
    const isItemEmpty = (value) => {
      if (typeof value === 'object' && value !== null) {
        for (const v of Object.values(value)) {
          if (isItemEmpty(v)) return true;
        }
      }
      return (
        isEmpty(value)
      );
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
        data:
        JSON.stringify({
          databaseId: import.meta.env.VITE_NOTION_SOFTWARE_DATABASE_ID,
          properties: {
            ...obj
          }
        })
      });

      if (response) {
        $q.notify('Form submitted successfully!')
      } else {
        $q.notify('Something went wrong!')      
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form.');
    }
  }
</script>

<style scoped>
/* Add any styles here */
</style>
