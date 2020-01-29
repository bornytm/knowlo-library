<template>
    <div>
        <!-- <vue-picture-swipe :items="[
        {src: 'http://example.org/xl.jpg',thumbnail: 'http://example.org/sm1.jpg',w: 600,h: 400, title: 'Will be used for caption'},
        {src: 'http://example.org/xxl.jpg',thumbnail: 'http://example.org/sm2.jpg',w: 1200,h: 900}
    ]"></vue-picture-swipe> -->

        <isotope ref="resourceBin" :list="resources" :options='{}'>
            <resource v-for="res in resources"
                :resourcesPerRow="perRow"
                :display="resourceDisplay"
                :key="res.resource.uid"
                :settings='settings'
                :re="res"
            >
            </resource>
        </isotope>

        <!-- <Spinner v-show='loadingResources'></Spinner> -->

    </div>
</template>

<script>

import VuePictureSwipe from 'vue-picture-swipe'
import resource from 'components/resource'
import Spinner from 'vue-simple-spinner'
import isotope from 'vueisotope'

export default {
    components: { VuePictureSwipe, resource, Spinner, isotope },
    props: ['tagQuery', 'resources', 'ResourcesPerRow']

}
</script>

<style>

</style>