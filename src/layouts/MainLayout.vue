<template>
  <q-layout view="hhh lpr fff">

    <q-header class="bg-white text-black q-pt-md">
      <div class="row">
        <div class="col-3 col-sm-4">
          <q-img src="https://www.earthdefenderstoolkit.com/wp-content/uploads/2020/12/cropped-EDT-asset-dark-logo.png"
            :width="$q.screen.gt.xs ? '145px':'60px'"  
            style="margin-left:10px"
          />
        </div>
        <div class="cols">
          <!-- <span class="text-weight-bold" :class="$q.screen.gt.xs ? 'text-h4':'text-h5'">New Toolkit Submission</span> -->
          <span class="text-weight-bold gt-xs text-h4 q-mt-lg">New Toolkit Submission</span>
          <span class="text-weight-bold xs text-h6">New Toolkit Submission</span>
        </div>
      </div>
    </q-header>

    <q-page-container class="fit row wrap justify-center items-start content-start">
      <router-view />
    </q-page-container>
  </q-layout>
</template>s

<script setup>

defineOptions({
  name: 'MainLayout'
})

</script>
<style lang='sass'>
.x-margin 
  body.screen--xs &
   margin-left: 20px
   margin-right: 20px
</style>
