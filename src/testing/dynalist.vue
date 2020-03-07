<template>
    <div>hi
        <q-btn>testing</q-btn>
    </div>
    
</template>

<script>
import Axios from 'axios'

export default {
  
  data() {
    return {
      test: null,
    }
  },
  mounted() {
    this.all()
  },
  methods:{
      all(){
          console.log("in get dyna")
        let doc = 'https://dynalist.io/api/v1/doc/read'
        let all = 'https://dynalist.io/api/v1/file/list'
        let params = {
            token: "sW4uJeSOcbgoiFA1hnQ4a3j7R-XtgYtDcmPKLDfwJb9V7POoEF6P3Aqbv1UAn9OIJAmPRBD22fuY95tKiHTaNA6EzgUZjv2osPOHVT7XZImJWo2dmUO9aqZNJ3QcC0FM",
            file_id: "-cQ3PT-ILW_7eseds-vLgUoG"
        }
        return this.$http.post(doc, {
            // params: params,
            token: params.token,
            file_id: params.file_id,

            before(request) { // abort current request, if there is one
                if (this.previousRequest) {
                this.previousRequest.abort()
                }
                this.previousRequest = request
            }
            }).then(response => {
                console.log("back")
                console.log(response)
            }, failed => {
                console.log("errrrrrror")
                console.error(failed)
            })
      }
  }
}
</script>
<style scoped>

</style>