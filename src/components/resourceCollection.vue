<template>
    <div>

        <!-- resource view options -- is this a dumb way to organize? -->
        <resource-display-options
            v-on:update-order="updateOrder"
            v-on:update-display="updateDisplay"
            v-on:update-size="updateSize"
            v-on:update-descending="updateDescending"
        ></resource-display-options>
        <div>{{resources.length}}</div>
        
        <!-- slider view -->
        <cross-section v-if="display=='slider'" :items="resources">
            <resource v-for="res in resources"
                :resourcesPerRow="resourcesPerRow"
                :display="'card'"
                :key="res.resource.uid"
                :re="res"
            ></resource>  
        </cross-section>

        <!-- card and list view -->
        <isotope v-else ref="resourceBin" :list="resources" v-images-loaded:on.progress="layout" :options="opt()" v-on:sort="o" v-on:layout="0">
            <resource v-for="res in resources"
                :resourcesPerRow="resourcesPerRow"
                :display="display"
                :key="res.resource.uid"
                :re="res"
            ></resource>
        </isotope>
    

    </div>
</template>

<script>

import resourceDisplayOptions from 'components/resourceDisplayOptions'
import resource from 'components/resource'
import crossSection from 'components/cross-section'
import isotope from 'vueisotope'
import imagesLoaded from 'vue-images-loaded'

export default {
    components: { resourceDisplayOptions, resource, isotope, crossSection },
    directives: { imagesLoaded },
    props: ['tagQuery', 'resources', 'sort','descending'],
    watch: {
        descending: function(x) {
            console.log('in descending watch. descending:', !this.descending)
            this.order(x)
        },
        sort: function(x) {
            this.order(x)
        }
    },
    mounted(){
        console.log(  this.$refs.resourceBin)
    },
    methods: {
        opt() {
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
        o(x){
            console.log("i've been sorted: ",x)
            // this.$refs.resourceBin.sort(this.sort)
        },
        order(){
            console.log(this.descending)
            console.log(this.$refs.resourceBin.options.sortAscending)
            this.$refs.resourceBin.options.sortAscending = !this.descending
            // this.opt.sortAscending = !this.descending
            // this.$refs.resourceBin.updateSortData()
            this.$refs.resourceBin.sort(this.sort)
                        console.log(this.$refs.resourceBin.options.sortAscending)

        },
        layout() {
            if(this.$refs.resourceBin){
                this.$refs.resourceBin.layout('masonry')
            }
        },
        updateOrder(order) {
            this.$emit('update')
        },
        updateDisplay(display) {
            this.display = display;
            if(this.display !='slider'){
                setTimeout(() => { // allow isotope to initalize
                    this.$refs.resourceBin.layout()
                }, 200);
            }
            // this.$emit('update')
        },
        updateSize(size) {
            this.resourcesPerRow = size;
            // this.$emit('update')
            setTimeout( x => { this.layout() }, 100)
        },
        updateDescending(asc){
            this.$emit('update')
        }
    },
    data () {
        return {
            display: 'card',
            resourcesPerRow: 3,
            
        }
    }

}
</script>

<style>

</style>