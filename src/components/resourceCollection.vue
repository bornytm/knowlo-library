<template>
    <div>

        <!-- resource view options -->
        <resource-display-options
            v-on:update-order="updateOrder"
            v-on:update-display="updateDisplay"
            
        ></resource-display-options>

        <!-- photoSwipe for resource previews -->
        <!-- <vue-picture-swipe :items="[
        {src: 'http://example.org/xl.jpg',thumbnail: 'http://example.org/sm1.jpg',w: 600,h: 400, title: 'Will be used for caption'},
        {src: 'http://example.org/xxl.jpg',thumbnail: 'http://example.org/sm2.jpg',w: 1200,h: 900}
    ]"></vue-picture-swipe> -->

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
        <isotope v-else ref="resourceBin" :list="resources" :options='{}'  v-images-loaded:on.progress="layout">
            <resource v-for="res in resources"
                :resourcesPerRow="resourcesPerRow"
                :display="display"
                :key="res.resource.uid"
                :re="res"
            ></resource>
        </isotope>

        <!-- <Spinner v-show='loadingResources'></Spinner> -->

      

    </div>
</template>

<script>

import resourceDisplayOptions from 'components/resourceDisplayOptions'
import VuePictureSwipe from 'vue-picture-swipe'
import resource from 'components/resource'
import crossSection from 'components/cross-section'
import Spinner from 'vue-simple-spinner'
import isotope from 'vueisotope'
import imagesLoaded from 'vue-images-loaded'

export default {
    components: { resourceDisplayOptions, VuePictureSwipe, resource, Spinner, isotope, crossSection },
    directives: { imagesLoaded },
    props: ['tagQuery', 'resources'],
    methods: {
        layout() {
            this.$refs.resourceBin.layout('masonry')
        },
        updateOrder(order) {
            this.order = order;
        },
        updateDisplay(display) {
            this.display = display;
            if(this.display !='slider'){
                setTimeout(() => { // allow isotope to initalize
                    this.$refs.resourceBin.layout()
                }, 200);
            }
        }
    },
    data () {
        return {
            display: 'card',
            resourcesPerRow: 3
        }
    }

}
</script>

<style>

</style>