<template>
    <div>
        <!-- slider view -->
        <cross-section v-if="options.display=='slider'" :items="resources">
            <resource v-for="res in resources"
                :size="options.size"
                display="card"
                :key="res.resource.uid"
                :re="res"
            ></resource>  
        </cross-section>

        <!-- card and list view -->
        <isotope v-else ref="resourceBin" :list="resources" v-images-loaded:on.progress="layout" :options="getOptions()">
            <resource v-for="res in resources"
                :size="options.size"
                :display="options.display"
                :key="res.resource.uid"
                :re="res"
            ></resource>
        </isotope>
    

    </div>
</template>

<script>

import resource from 'components/resource'
import crossSection from 'components/cross-section'
import isotope from 'vueisotope'
import imagesLoaded from 'vue-images-loaded'

export default {
    components: { resource, crossSection, isotope },
    directives: { imagesLoaded },
    props: ['tagQuery', 'resources', 'options'],
    watch: {
        descending: function(x) {
            this.order(x)
        },
        sort: function(x) {
            this.order(x)
        },
        size: function(x) {
            this.layout()
        }
    },
    methods: {
        getOptions() {
            return {
                sortAscending: false,
                getSortData: {
                    quality: function(res) {
                        return res.globalVote.quality 
                    },
                    complexity: function(res) {
                        return res.globalVote.complexity
                    },
                    added: function(res) {
                        return res.resource.dateAdded 
                    },
                    votes: 'votes',
                    views: function(res) {
                        return res.resource.viewCount 
                    },
                    // 'activity': function(res) {
                    //     return res. 
                    // },
                    // 'time': function(res) {
                    //     return res.
                    // },
                }
            }
        },
        order(){ // reorder without db query
            // this.$refs.resourceBin.options.sortAscending = !this.options.descending
            // // this.opt.sortAscending = !this.options.descending
            // // this.$refs.resourceBin.updateSortData()
            // this.$refs.resourceBin.sort(this.sort)
        },
        layout() {
            if(this.$refs.resourceBin){
                this.$refs.resourceBin.layout('masonry')
            }
        }
    }

}
</script>

<style>

</style>