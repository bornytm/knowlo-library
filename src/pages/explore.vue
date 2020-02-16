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
        <q-layout>
        <q-infinite-scroll ref='infiniteScroll' @load="more" :offset="250">
            <resource-collection v-on:update="orderUpdate" :resources="resources" :sort="sort" :descending="descending" :display="display"></resource-collection>
             <template v-slot:loading>
                <div class="row justify-center q-my-md">
                    <q-spinner color="primary" size="40px" />
                </div>
            </template>
        </q-infinite-scroll>

        <h1 v-if='noMore'>aint' no mo</h1>
        <q-page-scroller position="bottom-right" :scroll-offset="150" :offset="[18, 18]">
           <q-btn fab icon="keyboard_arrow_up" color="primary" />
        </q-page-scroller>
        </q-layout>
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
    mounted () {
        // inital fetch?
    },
    methods: {
        addTag(x){
            this.tagQuery.push(x)  // check if it's alreay there before adding?
        },
        orderUpdate(){

            if(this.noMore){ 
                this.descending = this.$q.localStorage.getItem('exploreDescending') //used for local sorting (without going to db?)
                this.sort = this.$q.localStorage.getItem('exploreOrder') //used for local sorting (without going to db?)
            } else {
                this.fetchResources()
            }
        },
        removeTag(id) {
            for (var i = this.tagQuery.length - 1; i >= 0; i--) {
                if (this.tagQuery[i].setID === id) this.tagQuery.splice(i, 1)
            }
        },
        fetchResources(options, callback){
            // these if statements feel a little dumb...is taking in options and/or callback dumb? 
            // currently used to let infinite scroll know the query is done
            if(typeof options == 'undefined') { 
                options = this.resQueryOptions(false)
            }
            if(typeof callback == 'undefined') {
                callback = function dummy(){}
            }
            resAPI.getResourcesRelatedToTags(options)
                .then(resources => {
                    if(resources.data.length == 0){
                        this.noMore = true
                    } else if(options.skip > 0){
                        this.resources = this.resources.concat(resources.data) 
                        this.noMore = false
                    } else {
                        this.resources = resources.data
                        this.noMore = false
                    }
                    callback(resources)
                })
                .catch(error => console.log(error))
        },
        more(index, done){
            console.log('in more')
            if(this.noMore){
               done()
            } else {
                let options = this.resQueryOptions(true)
                this.fetchResources(options, done)
            }
        },
        resQueryOptions(infinite) { 
            // takes tags ids and status and converts to query options object? 
            // gets others from cookies/storage?
            // the default values are duplicated three times... explore, disp options, and api
            
            let options = {
                include: [],
                exclude: [],
                skip: 0,
                limit: 30, // base on resources per row and mobile v desktop?
                orderby: this.$q.localStorage.getItem('exploreOrder') || 'quality',
                descending: typeof (this.$q.localStorage.getItem('exploreDescending')) === 'boolean'? this.$q.localStorage.getItem('exploreDescending') : true
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
            sort: '',
            descending: '',
            display: this.$q.localStorage.getItem('exploreDisplay') || 'card',
            noMore: false // flag for no more related resources
        }
    }

}
</script>

<style>

</style>