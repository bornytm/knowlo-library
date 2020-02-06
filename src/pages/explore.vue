<template>
    <div>
        <!-- tag query -->
        <!-- <cross-section :items="tagQuery" >
            <tag :key="tag.setID" :tag="tag" display='thumb' v-for='tag in tagQuery'>
            </tag>
        </cross-section> -->
        <transition-group class='container row' name='fade'>
            <span class="col  center" v-for="tag in tagQuery" @click.stop.prevent='removeTag(tag.setID)' :key="tag.setID">
                <img v-if="tag.tag.iconURL" class='circle hoverable' style='height:40px;width:40px;margin-right:10px;padding:3px;' :src="tag.tag.iconURL" />
                <span v-else class='circle hoverable' style='text-align:center;padding:10px;width:40px;width:40px;position:absolute;font-size;2em' >{{tag.translation.name[0]}}</span>
            </span>
        </transition-group>

        <!-- tag search -->
        <search class ='col' exclude="" input-id="mainSearch" holder-text="Search" v-on:select=""></search>
        
        <!-- tag navigation/explorer -->
        <tag-suggestions :tagQuery="tagQuery" v-on:add="test"></tag-suggestions>
        <!-- <graph></graph> -->

        <!-- resource results  -->
        <resource-collection :resources="resources" ></resource-collection>

    </div>
</template>

<script>
import search from 'components/search'
import tagSuggestions from 'components/tagSuggestions'
import resourceCollection from 'components/resourceCollection'
import tag from 'components/tag'
import crossSection from 'components/cross-section'
import graph from '../testing/vis-graph-test'
import resAPI from '../api/resources'


export default {
    components: { search, tagSuggestions, resourceCollection, graph, tag, crossSection },
    mounted() {
        // this.fetchResources()
    },
    methods: {
        test(x,y){
            this.tagQuery.push(x)
        },
        prepResourceQuery(tags) { // takes tags and status and converts to query options object?
            let options = {
                include: [],
                exclude: [],
                skip: 0,
                limit: 100,
                orderBy: ''
            }
            for(let tag in tags ) {
                if(tags[tag].status.includeIcon){
                    options.include.push(tags[tag].setID)
                } else if (tags[tag].status.excludeIcon){
                    options.exclude.push(tags[tag].setID)
                }
            }
            console.log(options)
            return options
        },
        fetchResources (options) {
            resAPI.getResourcesRelatedToTagQuery(options)
                .then(resources => {
                    console.log(resources)
                    this.resources = resources.data
                })
                .catch(error => console.log(error))
        }
    },
    watch: {
        tagQuery(x,y){
            let op = this.prepResourceQuery(this.tagQuery)
            this.fetchResources(op)
        }
    },
    data () {
        return {
            tagQuery: [],
            resources: []
        }
    }

}
</script>

<style>

</style>