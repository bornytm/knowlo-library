<template>
  <div>
    <q-btn round color="primary" icon="shopping_cart" @click="test" />
    <cross-section :items="items">
          <resource :key="re.resource.uid"
                      :settings='{}'
                      v-for="re in items"
                      :re="re"
                      :display="'card'"
                      v-on:changedDisplay="test"
                    ></resource>
           
    </cross-section>
  </div>
</template>

<script>

import crossSection from 'components/cross-section'
import resAPI from 'pages/resources'
import resource from '../api/resource'

export default {
    name: 'test',
    components: {crossSection, resource},
    created() {
        console.log('in created for test')
        // this.test()
    },
    data () {
        return {
            items: []
        }
    },
    methods: {
        test(){
            console.log(resAPI)
            console.log(resAPI.getResourcesRelatedToTagQuery)
            resAPI.getResourcesRelatedToTagQuery()
                .then(resources => {
                    console.log(resources)
                    this.items = resources.data
                })
                .catch(error => console.log(error))
        }
    }

}
</script>

<style>

</style>