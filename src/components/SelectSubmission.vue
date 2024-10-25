<template>
  <p class="text-subtitle1 text-weight-bold text-center q-pt-lg">Please select the type of submission you would like to make</p>
  <div class="button-row row" >
    <button
        v-for="option in options"
        :key="option.value"
        @click="selectOption(option.value)"
        class="container"
        :class="isSelected(option.value)"
        :style="backgroundImage(option.image)"
        ripple
      >
      <span class="button-label text-weight-bold text-h6 text-uppercase">{{ option.label }}</span>
    </button>
  </div>
</template>

<script setup>
import hardwareImage from 'src/assets/hardware.jpeg'
import softwareImage from 'src/assets/software.jpg'
import guidesImage from 'src/assets/print.jpeg'
import groupsImage from 'src/assets/groups.jpeg'
import { useQuasar } from 'quasar'
import { computed } from 'vue'

const $q = useQuasar()
const data = defineModel()

const options = [
  { label: 'Tool', value: 'tool', image: softwareImage },
  { label: 'Hardware', value: 'hardware', image: hardwareImage },
  { label: 'Guides', value: 'guide', image: guidesImage },
  { label: 'Groups', value: 'group', image: groupsImage }
]

function selectOption (input) {
  data.value = input
}

function isSelected (input) {
  if (!data.value) return ''
  else if (data.value !== input ) return 'gray' 
  else return 'box-shadow'
}

function backgroundImage (image) {
  if ($q.screen.gt.xs) {
    return `
      background: linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.5)), url("${image}"); 
      width: 170px; height: 100px; 
      background-size: cover;
      border: none;
      border-radius: 5px;
      background-position: center;
    `
  } else {
    return `
      background: linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.5)), url("${image}"); 
      width: 300px; height: 100px; 
      background-size: cover; 
      background-position: center;
      border: none;
      border-radius: 10px;
      margin-top: 20px;
    `
  }
}

</script>

<style scoped lang='sass'>
.button-row
  display: flex
  justify-content: space-between
  body.screen--xs &
   justify-content: center

.container
  position: relative
  text-align: center
  color: white

.button-label
  position: absolute
  top: 50%
  left: 50%
  transform: translate(-50%, -50%)
  letter-spacing: 5px


.gray
  filter: grayscale(100%)

.box-shadow
    box-shadow: 5px 10px 5px grey !important

</style>
