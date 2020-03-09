<template>
    <div>
        <!-- view for pop-up tag and resource pages -->
        <router-view ></router-view>

        <!-- tag search -->
        <search class ='col' exclude="" input-id="mainSearch" holder-text="Search" @select="addTag"></search>
        
        <!-- tag navigation/explorer -->
        <tag-suggestions :tagQuery="tagQuery" @add="addTag"></tag-suggestions>

        <div class='sticky-ui-stuff' :class="{'extraPadding': this.$q.platform.is.desktop }">
        <!-- tag query display -->
        <transition-group class='tagQuery row pad' name='fade' style='text-overflow: ellipsis;background-color:white;'>
            <span style='width:50px;padding:10px' class="col center" v-for="tag in tagQuery" @click.stop.prevent='removeTag(tag.setID)' :key="tag.setID">
                <img v-if="tag.tag.iconURL" class='circle hoverable center' style='height:25px;width:25px;overflow:hidden;margin: 3px 3px 0px 3px;' :src="tag.tag.iconURL" />
                <span v-else class='circle hoverable center' style='text-align:center;padding:10px;height:250px;width:25px;position:absolute;font-size;2em' >{{tag.translation.name[0]}}</span>
                <div style ="max-width: 150px;font-size: 12px;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;margin: 0 auto;" class='center'>{{tag.translation.name}}</div>
            </span>
        </transition-group>

        <!-- resource view options -->
        <resource-display-options
            @update-order="updateOrder"
            @update-display="updateDisplay"
            @update-size="updateSize"
            @update-descending="updateDescending"
        ></resource-display-options>
        </div>  
       
       <!-- number of resources -->
        <!-- <div class='right' style='margin:30px'>Showing {{resources.length}} resources.</div>
        {{collectionOptions.display == 'slider'}} -->
            <!-- of {{resourcesRelated}}</div> -->

        <q-layout>
            <!-- resource results  -->
            <q-infinite-scroll ref='infiniteScroll' 
                @load="infiniteResources" 
                :disable="collectionOptions.display == 'slider'" 
                :debounce="500" 
                :offset="250">

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
            
                <q-btn color='primary' round >
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
                skip: 0,
                limit: 30, // base on resources per row and mobile v desktop (i.e. available screen real estate)?
                order: this.$q.localStorage.getItem('exploreOrder') || 'quality',
                descending: this.$q.localStorage.getItem('exploreDescending') || 'true'
            },
            infinite: false, // flag indicating if resources should be concatenated or replaced
            noMore: false, // flag for no more related resources
            collectionOptions:{
                order: this.$q.localStorage.getItem('exploreOrder') || 'Quality',
                display: this.$q.localStorage.getItem('exploreDisplay') || 'card',
                size: this.$q.localStorage.getItem('exploreSize') || 4,
                descending: this.$q.localStorage.getItem('exploreDescending') || 'true',
            }
        }
    },
    watch: {
        tagQuery: function(){
            this.fetchResources()    
        }
    },
    methods: {
        fetchResources(callback){
                    
            if(typeof callback == 'undefined') { // should I just make it required?
                callback = function dummy(){}
            }

            this.resourceQueryOptions.include = []
            this.resourceQueryOptions.exclude = []
            for(let tag in this.tagQuery ) {
                if(this.tagQuery[tag].status.includeIcon){
                    this.resourceQueryOptions.include.push(this.tagQuery[tag].setID)
                } else if (this.tagQuery[tag].status.excludeIcon){
                    this.resourceQueryOptions.exclude.push(this.tagQuery[tag].setID)
                }
            }
            this.resourceQueryOptions.skip = this.infinite? this.resources.length : 0

            resAPI.getResourcesRelatedToTags(this.resourceQueryOptions)
                .then(response => {
                    if(response.data.length == 0){
                        this.noMore = true
                    } else if(this.infinite){
                        this.noMore = false
                        this.infinite = false
                        for (let index = 0; index < response.data.length; index++) {
                            this.resources.push(response.data[index])  
                        }
                    } else {
                        this.resources = response.data
                        this.noMore = false
                    }
                    callback(response)
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
          
            tag.connections = 0
        
            if (tag.status.focusIcon) {
                this.focus(tag) // clear all non-pinned
            }
            if (this.tagQuery.every(x => x.setID !== tag.setID)) { // don't add if already in query
                this.tagQuery.push(tag)
            }  
            this.$q.localStorage.set('tagQuery', this.tagQuery)
        },
        removeTag(id) {
            for (var i = this.tagQuery.length - 1; i >= 0; i--) {
                if (this.tagQuery[i].setID === id) this.tagQuery.splice(i, 1)
            }
            this.$q.localStorage.set('tagQuery', this.tagQuery)
        },
        focus (set) {
            set.status.focusIcon = false
            var tIndex = this.tagQuery.length
            while (tIndex--) {
                if (!this.tagQuery[tIndex].status.pinnedIcon && this.tagQuery[tIndex].setID !== set.setID) this.tagQuery.splice(tIndex, 1)
            }
        },
        updateOrder(x){
            this.$q.localStorage.set('exploreOrder', x)
            this.collectionOptions.order = x
            this.resourceQueryOptions.order = x
            if(!this.noMore){ 
                this.fetchResources()
            }
        },
        updateDisplay(x){
            this.$q.localStorage.set('exploreDisplay', x)
            this.collectionOptions.display = x
            if(x == 'slider'){
                this.$refs.infiniteScroll.disable = true
            } else {
                this.$refs.infiniteScroll.disable = false
            }
        },
        updateSize(size){
          
            this.collectionOptions.size = size
           setTimeout(() => { // wait for change
                this.$refs.collection.layout()
                this.$q.localStorage.set('exploreSize', size)
            }, 300)
            
        },
        updateDescending(x){
            this.$q.localStorage.set('exploreDescending', x)
            this.collectionOptions.descending = x
            this.resourceQueryOptions.descending = x
            if(!this.noMore){ 
                this.fetchResources()
            }
        }       
    }
}
</script>

<style>
.sticky-ui-stuff {
    box-shadow: rgba(0, 0, 0, 0.2) 0px 0px 0px 0px, rgba(0, 0, 0, 0.19) 0px 9px 9px -3px;
    position: sticky;
    top:0px;
    background: white;
    z-index: 21;
}
.extraPadding {
    padding: 20px;
}
</style>