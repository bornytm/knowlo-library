<template>
    <div>
        <!-- tag query -->
        <search class ='col' exclude="" input-id="mainSearch" holder-text="Search" v-on:select=""></search>
        <!-- tag search -->
        <tag-suggestions :tagQuery="tagQuery" v-on:add=""></tag-suggestions>

        <!-- tag navigation/explorer -->

        <!-- resource view options -->
        <resource-display-options></resource-display-options>

        <!-- resource results  -->
        <resource-collection></resource-collection>

    </div>
</template>

<script>
import search from 'components/search'
import tagSuggestions from 'components/tagSuggestions'
import resourceDisplayOptions from 'components/resourceDisplayOptions'
import resourceCollection from 'components/resourceCollection'

export default {
    components: { search, tagSuggestions, resourceDisplayOptions, resourceCollection },

    data () {
        return {
            tagQuery: {}
        }
    }

}
</script>

<style>

</style>