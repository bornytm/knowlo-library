<template>
    <div>
        <!-- view for pop-up tag and resource page -->
        <router-view ></router-view>
        <!-- <router-view :member='member' :tag-Query='tagQuery' :settings='settings' v-on:add='addToQuery'></router-view> -->
        
        <!-- tag query -->
        <transition-group class='container row' name='fade'>
            <span class="col  center" v-for="tag in tagQuery" @click.stop.prevent='removeTag(tag.setID)' :key="tag.setID">
                <img v-if="tag.tag.iconURL" class='circle hoverable' style='height:40px;width:40px;margin-right:10px;padding:3px;' :src="tag.tag.iconURL" />
                <span v-else class='circle hoverable' style='text-align:center;padding:10px;width:40px;width:40px;position:absolute;font-size;2em' >{{tag.translation.name[0]}}</span>
            </span>
        </transition-group>

        <!-- tag search -->
        <search class ='col' exclude="" input-id="mainSearch" holder-text="Search" v-on:select="addTag"></search>
        
        <!-- tag navigation/explorer -->
        <tag-suggestions :tagQuery="tagQuery" v-on:add="addTag"></tag-suggestions>

        <!-- resource results  -->
        <q-infinite-scroll @load="more" :offset="250">
            <resource-collection :resources="resources" ></resource-collection>
             <template v-slot:loading>
                <div class="row justify-center q-my-md">
                    <q-spinner color="primary" size="40px" />
                </div>
            </template>
        </q-infinite-scroll>

        <span v-if='noMore'>aint' no mo</span>
        <!-- <q-page-scroller position="bottom-right" :scroll-offset="150" :offset="[18, 18]">
           <q-btn fab icon="keyboard_arrow_up" color="primary" />
        </q-page-scroller> -->

    </div>
</template>

<script>
import search from 'components/search'
import tagSuggestions from 'components/tagSuggestions'
import resourceCollection from 'components/resourceCollection'
import tag from 'components/tag'
import crossSection from 'components/cross-section'
import resAPI from '../api/resources'


export default {
    components: { search, tagSuggestions, resourceCollection, tag },
    methods: {
        addTag(x){
            this.tagQuery.push(x)
        },
        removeTag(id) {
            for (var i = this.tagQuery.length - 1; i >= 0; i--) {
                if (this.tagQuery[i].setID === id) this.tagQuery.splice(i, 1)
            }
        },
        more(index, done){
            this.noMore = false
            console.log('in more')
            let options = this.resQueryOptions(true)
            resAPI.getResourcesRelatedToTags(options)
                .then(resources => {
                    console.log(resources)
                    console.log(resources.data.length)
                    if(resources.data.length == 0){
                        this.noMore = true
                    } else if(options.skip > 0){
                        this.resources.push(resources.data) 
                    } else {
                        this.resources = resources.data
                    }
                    done()
                })
                .catch(error => console.log(error))
        },
        resQueryOptions(infinite) { // takes tags ids and status and converts to query options object? gets others from cookies/storage?
            // defaults
            let options = {
                include: [],
                exclude: [],
                skip: 0,
                limit: 30,
                orderBy: 'quality'
            }

            // infinite scrolling
            if(infinite){ // set data prop flag instead of take in as param?
                options.skip = this.resources.length
            }
            // include / exclude
            for(let tag in this.tagQuery ) {
                if(this.tagQuery[tag].status.includeIcon){
                    options.include.push(this.tagQuery[tag].setID)
                } else if (this.tagQuery[tag].status.excludeIcon){
                    options.exclude.push(this.tagQuery[tag].setID)
                }
            }
            
            return options
        }
    },
    watch: {
        tagQuery(x,y){
            this.fetchResources()
        }
    },
    data () {
        return {
            tagQuery: [],
            resources: [],
            infinite: false,
            noMore: false // flag for no more related resources
        }
    }

}
</script>

<style>

</style>