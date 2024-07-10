<template>
  <q-page class="q-mt-lg text-center">
    <q-form style="width:100%" @submit="submitForm">
      <p class="text-subtitle1 text-weight-bold">Please provide the following hardware details</p>
      <q-input filled v-model="form.name" label="Hardware Name" required />
      <q-input class="q-pt-md" filled v-model="form.model" label="Model"/>
      <q-input class="q-pt-md" filled v-model="form.manufacturer" label="Manufacturer" />
      <q-input class="q-pt-md" filled v-model="form.description" type="textarea" autogrow label="Description" />
      <q-input class="q-pt-md" filled v-model="form.price" label="Price" />
      <q-input class="q-pt-md" filled v-model="form.photo" type="url" label="Photo URL" />
      <q-input class="q-pt-md" filled v-model="form.productWebsite" type="url" label="Product Website" />
      <q-input class="q-pt-md" filled v-model="form.recommendedBy" label="Recommended by" />
      <q-input class="q-pt-md" filled v-model="form.recommendedByEmail" label="Recommended by (email)" />
      
      <p class="q-pt-xl text-subtitle1 text-weight-bold">Additional information</p>
      <q-input class="q-pt-md" filled v-model="form.dimensions" label="Dimensions" />
      <q-input class="q-pt-md" filled v-model="form.usedBy" label="Used by" />
      <q-input class="q-pt-md" filled v-model="form.prosCons" type="textarea" autogrow label="Pros/Cons" />
      <q-input class="q-pt-md" filled v-model="form.moreInfo" type="textarea" autogrow label="More Info" />
      <q-input class="q-pt-md" filled v-model="form.otherUsefulLinks" type="textarea" autogrow label="Other Useful Links" />

      <p class="q-pt-xl text-subtitle1 text-weight-bold">Select categories and subcategories</p>
      <q-select use-chips class="q-pt-md" filled v-model="form.hardwareCategories" :options="hardwareCategoriesOptions" label="Hardware Categories" multiple/>
      <q-select v-if="showField('User device')" use-chips class="q-pt-md" filled v-model="form.userDeviceSubcategories" :options="userDeviceSubcategoriesOptions" label="User Device Subcategories" multiple/>
      <q-select v-if="showField('Radio')" use-chips class="q-pt-md" filled v-model="form.hamRadioSubcategories" :options="hamRadioSubcategoriesOptions" label="HAM Radio Subcategories" multiple />
      <q-select v-if="showField('Network')" use-chips class="q-pt-md" filled v-model="form.networkSubcategories" :options="networkSubcategoriesOptions" label="Network Subcategories" multiple />
      <q-select v-if="showField('Network')"  class="q-pt-md" filled v-model="form.transferVelocity" :options="transferOptions" label="Transfer Velocity" />
      <q-select v-if="showField('Recording equipment')" use-chips class="q-pt-md" filled v-model="form.recordingEquipmentSubcategories" :options="recordingEquipmentSubcategoriesOptions" label="Recording Equipment Subcategories" multiple />
      <q-select v-if="showField('Server')" use-chips class="q-pt-md" filled v-model="form.serverSubcategories" :options="serverSubcategoriesOptions" label="Server Subcategories" multiple />
      <q-select v-if="showField('Storage')" use-chips class="q-pt-md" filled v-model="form.storageSubcategories" :options="storageSubcategoriesOptions" label="Storage Subcategories" multiple />
      <q-select v-if="isRadioOrNetwork()" use-chips class="q-pt-md" filled v-model="form.communicationBands" :options="communicationBandsOptions" label="Communication Bands" multiple />
      <q-select use-chips class="q-pt-md" filled v-model="form.tags" :options="tagsOptions" label="Tags" multiple />

      <p class="q-pt-xl text-subtitle1 text-weight-bold">Rate the following attributes</p>
      <q-select class="q-pt-md" filled v-model="form.security" :options="ratingOptions" label="Security" />
      <q-select class="q-pt-md" filled v-model="form.powerConsumption" :options="ratingOptions" label="Power Consumption" />
      <q-select class="q-pt-md" filled v-model="form.robustness" :options="ratingOptions" label="Robustness" />
      <q-select class="q-pt-md" filled v-model="form.reliability" :options="ratingOptions" label="Reliability" />
      <q-select class="q-pt-md" filled v-model="form.reusability" :options="ratingOptions" label="Reusability" />
      <q-select class="q-pt-md" filled v-model="form.maintainability" :options="ratingOptions" label="Maintainability" />
      <q-select class="q-pt-md" filled v-model="form.performance" :options="ratingOptions" label="Performance" />
      <q-select  v-if="isRadioOrNetwork()" class="q-pt-md" filled v-model="form.functionRange" :options="ratingOptions" label="Function Range" />
      <q-select class="q-pt-md" filled v-model="form.scalability" :options="ratingOptions" label="Scalability" />
      <q-select class="q-pt-md" filled v-model="form.adaptability" :options="ratingOptions" label="Adaptability" />
      <q-select class="q-pt-md" filled v-model="form.configurability" :options="ratingOptions" label="Configurability" />
      <q-select class="q-pt-md" filled v-model="form.priceRating" :options="ratingOptions" label="Price Rating" />

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
    name: 'HardwareSubmissionForm'
  })
  
  function showField (input) {
    return form.value.hardwareCategories.includes(input)
  }

  function isRadioOrNetwork () {
    return ['Radio', 'Network'].some(r=> form.value.hardwareCategories.includes(r))
  }

  const form = ref({
    name: '',
    model: '',
    manufacturer: '',
    description: '',
    price: '',
    photo: '',
    productWebsite: '',
    recommendedBy: '',
    recommendByEmail: '',
    dimensions: '',
    usedBy: '',
    prosCons: '',
    moreInfo: '',
    otherUsefulLinks: '',
    hardwareCategories: [],
    userDeviceSubcategories: [],
    hamRadioSubcategories: [],
    networkSubcategories: [],
    recordingEquipmentSubcategories: [],
    serverSubcategories: [],
    storageSubcategories: [],
    communicationBands: [],
    tags: [],
    transferVelocity: '',
    security: '',
    powerConsumption: '',
    robustness: '',
    reliability: '',
    reusability: '',
    maintainability: '',
    performance: '',
    functionRange: '',
    scalability: '',
    adaptability: '',
    configurability: '',
    priceRating: ''
  })

  const ratingOptions = [
    '⭐️', '⭐️⭐️', '⭐️⭐️⭐️', '⭐️⭐️⭐️⭐️', '⭐️⭐️⭐️⭐️⭐️'
  ]

  const hardwareCategoriesOptions = [
    "Water",
    "Manufacturing",
    "Solar",
    "Power",
    "Sensor",
    "Recording equipment",
    "User device",
    "Radio",
    "Server",
    "Storage",
    "Network",
    "Tools",
    "Construction",
    "Other"
  ]

  const userDeviceSubcategoriesOptions = [
    "Computer",
    "Laptop",
    "Phone",
    "Accessories",
    "Tablet",
    "Other"
  ]

  const hamRadioSubcategoriesOptions = [
    "TNC",
    "Base radio",
    "Other"
  ]

  // Network subcategories
  const transferOptions = [
    "More than 1gbs",
    "Less than 1000mbs",
    "Less than 300mbs",
    "Less than 100mbs"
  ]

  const networkSubcategoriesOptions = [
    "Router + Antenna intergrated",
    "Power supplies",
    "Cables and physical connectors",
    "Tower or poles",
    "Network service",
    "Router",
    "Antenna",
    "Other"
  ]

  const communicationBandsOptions = [
    "CDMA",
    "5G",
    "4G",
    "3G",
    "LTE",
    "GSM",
    "Very high frequency",
    "High frequency",
    "Medium frequency",
    "Low frequency (or lower)",
    "Bluetooth",
    "Wifi 5 Ghz",
    "Wifi 2.4 Ghz",
    "Other"
  ]

  const recordingEquipmentSubcategoriesOptions = [
    "Accessories",
    "Stands",
    "Lighting",
    "Microphone",
    "Camera",
    "Other"
  ]

  const serverSubcategoriesOptions = [
    "Single board computers",
    "Rack server",
    "Tower server",
    "Mini computer",
    "Computer",
    "Other"
  ]

  const storageSubcategoriesOptions = [
    "External HDD",
    "USD",
    "NAS",
    "SD Cards",
    "Internal HDD",
    "Other"
  ]

  const tagsOptions = [
    "Makerspace",
    "Dry",
    "Cold",
    "Hot",
    "For beginners (easy install/use)",
    "Wet",
    "Outdoor",
    "Indoor",
    "Not for beginners (complicated install use)",
    "PtMP last mile",
    "PtMP final user",
    "Surpass obstacles",
    "Short distances",
    "PtP",
    "Medium distances",
    "Long distances"
  ]

  async function submitForm () {
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
      Model: {
         rich_text: [
          {
            text: {
              content: form.value.model
            }
          }
        ]
      },
      Manufacturer: {
        rich_text: [
          {
            text: {
              content: form.value.manufacturer
            }
          }
        ]
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
      Price: {
        rich_text: [
          {
            text: {
              content: form.value.price
            }
          }
        ]
      },
      Photo: {
        url: form.value.photo
      },
      'Product website': {
        url: form.value.productWebsite
      },
      'Recommended by': {
        rich_text: [
          {
            text: {
              content: form.value.recommendedBy
            }
          }
        ]
      },
      'Recommended by (email)': {
        rich_text: [
          {
            text: {
              content: form.value.recommendedByEmail
            }
          }
        ]
      },
      Dimensions: {
        rich_text: [
          {
            text: {
              content: form.value.dimensions
            }
          }
        ]
      },
      'Used by': {
        rich_text: [
          {
            text: {
              content: form.value.usedBy
            }
          }
        ]
      },
      'Pros/Cons': {
        rich_text: [
          {
            text: {
              content: form.value.prosCons
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
      'Other useful links': {
        rich_text: [
          {
            text: {
              content: form.value.otherUsefulLinks
            }
          }
        ]
      },
      'User Device Subcategories': {
        multi_select: form.value.userDeviceSubcategories.map(category => ({ name: category }))
      },
      'HAM Radio Subcategories': {
        multi_select: form.value.hamRadioSubcategories.map(category => ({ name: category }))
      },
      'Network Subcategories': {
        multi_select: form.value.networkSubcategories.map(category => ({ name: category }))
      },
      'Recording Equipment Subcategories': {
        multi_select: form.value.recordingEquipmentSubcategories.map(category => ({ name: category }))
      },
      'Server Subcategories': {
        multi_select: form.value.serverSubcategories.map(category => ({ name: category }))
      },
      'Storage Subcategories': {
        multi_select: form.value.storageSubcategories.map(category => ({ name: category }))
      },
      'Communication Bands': {
        multi_select: form.value.communicationBands.map(category => ({ name: category }))
      },
      Tags: {
        multi_select: form.value.tags.map(tag => ({ name: tag }))
      },
      'Transfer Velocity': {
        select: {
          name: form.value.transferVelocity
        }
      },
      Security: {
        select: {
          name: form.value.security
        }
      },
      'Power Consumption': {
        select: {
          name: form.value.powerConsumption
        }
      },
      Robustness: {
        select: {
          name: form.value.robustness
        }
      },
      Reliability: {
        select: {
          name: form.value.reliability
        }
      },
      Reusability: {
        select: {
          name: form.value.reusability
        }
      },
      Maintainability: {
        select: {
          name: form.value.maintainability
        }
      },
      Performance: {
        select: {
          name: form.value.performance
        }
      },
      'Function Range': {
        select: {
          name: form.value.functionRange
        }
      },
      Scalability: {
        select: {
          name: form.value.scalability
        }
      },
      Adaptability: {
        select: {
          name: form.value.adaptability
        }
      },
      Configurability: {
        select: {
          name: form.value.configurability
        }
      },
      'Price Rating': {
        select: {
          name: form.value.priceRating
        }
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
    

    try {
      const response = await api({
        method: 'POST',
        url: 'pages',
        headers: {
          'Content-Type': 'application/json',
        },
        data:
        JSON.stringify({
          databaseId: import.meta.env.VITE_NOTION_HARDWARE_DATABASE_ID,
          properties: obj
        })
      });
   
      if (response) {
        $q.notify('Form submitted successfully!')
      } else {
        $q.notify('Something went wrong!')      
      }
    } catch (error) {
       $q.notify('Something went wrong!')      
       console.error('Error creating page:', error)
    }
  }
</script>
