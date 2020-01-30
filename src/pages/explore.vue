<template>
    <div>
        <!-- tag query -->

        <!-- tag search -->
        <search class ='col' exclude="" input-id="mainSearch" holder-text="Search" v-on:select=""></search>
        
        <!-- tag navigation/explorer -->
        <tag-suggestions :tagQuery="tagQuery" v-on:add=""></tag-suggestions>

        <!-- resource results  -->
        <resource-collection :resources="resources" ></resource-collection>

    </div>
</template>

<script>
import search from 'components/search'
import tagSuggestions from 'components/tagSuggestions'
import resourceCollection from 'components/resourceCollection'
import resAPI from 'pages/resources'


export default {
    components: { search, tagSuggestions, resourceCollection },
    mounted() {
        resAPI.getResourcesRelatedToTagQuery()
                .then(resources => {
                    console.log(resources)
                    this.resources = resources.data
                })
                .catch(error => console.log(error))
    },
    data () {
        return {
            tagQuery: {},
            resources: []
        }
    }

}
</script>

<style>

</style>