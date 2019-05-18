<template>
  <div style="min-height:90vh;font-weight:300;margin-left:10vw;margin-right:10vw">
    <h5 style="font-weight:300;margin-top:100px;">Settings:</h5>
    <div style='margin-left:30px;'>
      <q-toggle v-model="settings.showToolTips" label="Tool Tips" />
    </div>
  </div>
</template>
<script>
import Cookies from 'js-cookie'
export default {
  name: 'settings',
  data () {
    return {
      settings: {
        showToolTips: undefined
      }
    }
  },
  watch: {
    settings: {
      handler: function(val) {
        console.log('going to emit')
        this.$emit('updateSettings', this.settings)
      },
      deep: true
    }
  },
  mounted () {
    // get settings
    if (Cookies.get('settings')) {
      this.settings = Cookies.getJSON('settings')
    }
  }
}
</script>

<style>
/* TODO: move style out of template */
</style>
