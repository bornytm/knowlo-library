<template>
    <div>
        <!-- view for pop-up tag and resource pages -->
        <router-view ></router-view>
        
        <!-- tag query display -->
        <transition-group class='container row' name='fade'>
            <span class="col  center" v-for="tag in tagQuery" @click.stop.prevent='removeTag(tag.setID)' :key="tag.setID">
                <img v-if="tag.tag.iconURL" class='circle hoverable' style='height:40px;width:40px;margin-right:10px;padding:3px;' :src="tag.tag.iconURL" />
                <span v-else class='circle hoverable' style='text-align:center;padding:10px;width:40px;width:40px;position:absolute;font-size;2em' >{{tag.translation.name[0]}}</span>
            </span>
        </transition-group>

        <!-- tag search -->
        <search class ='col' exclude="" input-id="mainSearch" holder-text="Search" @select="addTag"></search>
        
        <!-- tag navigation/explorer -->
        <tag-suggestions :tagQuery="tagQuery" @add="addTag"></tag-suggestions>

        <!-- resource view options -- is this a dumb way to organize? -->
        <resource-display-options
            @update-order="updateOrder"
            @update-display="updateDisplay"
            @update-size="updateSize"
            @update-descending="updateDescending"
        ></resource-display-options>
                
       
        <q-layout>
            <!-- resource results  -->
            <q-infinite-scroll ref='infiniteScroll' @load="infiniteResources" :offset="250">
                <resource-collection ref='collection' :resources="resources" :options="collectionOptions"></resource-collection>
                <template v-slot:loading>
                    <div class="row justify-center q-my-md">
                        <q-spinner color="primary" size="40px" />
                    </div>
                </template>
            </q-infinite-scroll>

            <!-- filler no / end of resources -->
            <div class="message" v-if="noMore || resources.length === 0">
                <p v-if="resources.length === 0">
                    No results! Add a resource or shuffle?
                </p>
                <p v-if="noMore">
                    No more results! Add a resource or shuffle?
                </p>
                <div>
            
                <q-btn @click="" color='primary' round >
                    <i class="far fa-random "></i>
                </q-btn>
                </div>
            </div>
        <q-page-scroller position="bottom-right" :scroll-offset="150" :offset="[18, 18]">
           <q-btn fab icon="keyboard_arrow_up" color="primary" />
        </q-page-scroller>
        </q-layout>
    </div>
</template>

<script>
import search from 'components/search'
import tag from 'components/tag'
import tagSuggestions from 'components/tagSuggestions'
import resourceDisplayOptions from 'components/resourceDisplayOptions'
import resourceCollection from 'components/resourceCollection'
import resAPI from '../api/resources'


export default {
    components: { search, tag, tagSuggestions, resourceDisplayOptions, resourceCollection },
    mounted () {
        this.fetchResources()
    },
    data () {
        return {
            tagQuery: this.$q.localStorage.getItem('tagQuery') || [],
            resources: [],
            resourceQueryOptions: {
                include: [],
                exclude: [],
                skip: this.infinite? this.resources.length : 0,
                limit: 30, // base on resources per row and mobile v desktop (i.e. available screen real estate)?
                orderby: this.$q.localStorage.getItem('exploreOrder') || 'quality',
                descending: typeof (this.$q.localStorage.getItem('exploreDescending')) === 'boolean'? this.$q.localStorage.getItem('exploreDescending') : true
            },
            infinite: false, // flag indicating if resources should be concatenated or replaced
            noMore: false, // flag for no more related resources
            collectionOptions:{
                order: this.$q.localStorage.getItem('exploreOrder') || 'Quality',
                display: this.$q.localStorage.getItem('exploreDisplay') || 'card',
                size: this.$q.localStorage.getItem('exploreSize') || 4,
                descending: this.$q.localStorage.getItem('exploreDescending') || true,
            }
        }
    },
    watch: {
        tagQuery(){
            this.fetchResources()    
        }
    },
    methods: {
        fetchResources(callback){
                    
            if(typeof callback == 'undefined') { // should I just make it required?
                callback = function dummy(){}
            }

            for(let tag in this.tagQuery ) {
                if(this.tagQuery[tag].status.includeIcon){
                    this.resourceQueryOptions.include.push(this.tagQuery[tag].setID)
                } else if (this.tagQuery[tag].status.excludeIcon){
                    this.resourceQueryOptions.exclude.push(this.tagQuery[tag].setID)
                }
            }
            console.log(  this.resourceQueryOptions.include)
            resAPI.getResourcesRelatedToTags(this.resourceQueryOptions)
                .then(resources => {
                    console.log(resources)
                    console.log(this.include)
                    if(resources.data.length == 0){
                        this.noMore = true
                    } else if(this.infinite){
                        this.resources = this.resources.concat(resources.data) 
                        this.noMore = false
                        this.infinite = false
                    } else {
                        this.resources = resources.data
                        this.noMore = false
                    }
                    callback(resources)
                })
                .catch(error => console.log(error))
            
            
        },
        infiniteResources(index, done){
            if(this.noMore){
               done()
            } else {
                this.infinite = true
                this.fetchResources(done)
            }
        },
        addTag(tag){
            console.log(tag)
            tag.connections = 0
           
            tag.status.includeIcon = true
        
            if (tag.status.focusIcon) {
                this.focus(tag) // clear all non-pinned
            }
            if (this.tagQuery.every(x => x.setID !== tag.setID)) { // don't add if already in query
                this.tagQuery.push(tag)
            }  // check if it's alreay there before adding?
        },
        removeTag(id) {
            for (var i = this.tagQuery.length - 1; i >= 0; i--) {
                if (this.tagQuery[i].setID === id) this.tagQuery.splice(i, 1)
            }
        },
        focus (set) {
            set.status.focusIcon = false
            var tIndex = this.tagQuery.length
            while (tIndex--) {
                if (!this.tagQuery[tIndex].status.pinnedIcon && this.tagQuery[tIndex].setID !== set.setID) this.tagQuery.splice(tIndex, 1)
            }
            },
        updateOrder(x){
            console.log('in order update')
            this.$q.localStorage.set('exploreOrder', x)
            if(!this.noMore){ 
                this.fetchResources()
            }
        },
        updateDisplay(x){
            this.$q.localStorage.set('exploreDisplay', x)
            this.collectionOptions.display = x
            // setTimeout((x) => { // wait for change
            //     this.$refs.collection.layout()
            // }, 300)
            
        },
        updateSize(x){
            this.$q.localStorage.set('exploreSize', x)
            this.collectionOptions.size = x
        },
        updateDescending(x){
            this.$q.localStorage.set('exploreDescending', x)
            this.collectionOptions.descending = x
        }       
    }
}
</script>

<style>

</style>