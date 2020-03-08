<template>
<div style='min-height:100vh;'>
  <!-- view for tag and resource page -->
  <router-view :member='member' :tag-Query='tagQuery' :settings='settings' @add='addToQuery'></router-view>
  <div>
    <!-- search -->
    <div class="row searchHead">
      <search class ='col' exclude="" input-id="mainSearch" holder-text="Search" @select="addToQuery"></search>
      <span v-if="tagQuery.length > 1" class="col-1 clear btn white waves-light" @click.stop.prevent="$emit('clear')">
        clear tags
      </span>
    </div>

    <!-- <isotope class='row' style="min-height:150px" ref="tagQuery" :list="tagQuery" :options='{}' >
      <tag v-for="tag in tagQuery" :settings='settings' :key="tag.setID" :tag="tag" display="thumb" @include="removeTag(tag.setID)" @remove="removeTag(tag.setID)" @focus="focus" @lens="fetchContains" @main="removeTag(tag.setID)">
      </tag>
    </isotope> -->

    <transition-group class='container row' name='fade'>
      <span class="col  center" v-for="tag in tagQuery" @click.stop.prevent='removeTag(tag.setID)' :key="tag.setID">
            <img v-if="tag.tag.iconURL" class='circle hoverable' style='height:40px;width:40px;margin-right:10px;padding:3px;' :src="tag.tag.iconURL" />
            <span v-else class='circle hoverable' style='text-align:center;padding:10px;width:40px;width:40px;position:absolute;font-size;2em' >{{tag.translation.name[0]}}</span>
      </span>
    </transition-group>

    <tag-suggestions :settings='settings' :tagQuery="tagQuery" @add="addToQuery"></tag-suggestions>
    
    <div class="">
      <div class="row container searchHead">
				<span @click.stop.prevent="flipViewed" class="col items-start viewBtn" :class="{'fade': !showViewed}" ><i class="material-icons ">remove_red_eye</i>
          <q-tooltip :disable="!this.settings.showToolTips" :delay="500" :offset="[0, 5]">show / hide viewed resources</q-tooltip>
        </span>
        <!-- display options select -->
        <span class="">
          <span class="viewBtn"  @click.stop.prevent="changeDisplay('list')"><i class="material-icons">view_list</i>
           <q-tooltip :disable="!this.settings.showToolTips" :delay="500" :offset="[0, 5]">List view</q-tooltip>
          </span>
          <span class="viewBtn" @click.stop.prevent="changeDisplay('card')"><i class="material-icons">dashboard</i>
           <q-tooltip :disable="!this.settings.showToolTips" :delay="500" :offset="[0, 5]">Grid view</q-tooltip>
          </span>
          <span class="viewBtn" @click.stop.prevent="changeDisplay('thumb')"><i class="material-icons">dialpad</i>
            <q-tooltip :disable="!this.settings.showToolTips" :delay="500" :offset="[0, 5]">Icon view</q-tooltip>
          </span>
          <span class="viewBtn" ><i class="material-icons">photo_size_select_large</i>
            <q-tooltip :disable="!this.settings.showToolTips" :delay="500" :offset="[0, 5]">Change Size</q-tooltip>
             <q-popup-edit class="sizec" v-model="sizeChange">
              <q-slider class='slider' v-model="size" :min="1" :max="20" :step="1" />
            </q-popup-edit>
          </span>
        </span>
        <span class='col self-end'>
					<a @click.stop="" class="right dropdown-button viewBtn orderby" >
            <span class="dropdown-button" data-activates='order' data-hover="true" data-alignment='right'>
              {{orderby}}
              <q-tooltip :disable="!this.settings.showToolTips" :delay="500" :offset="[0, 5]">order by</q-tooltip>
            </span>
            <i @click="descending = !descending; setOrderAndDescending(orderby); fetchResources()" class="material-icons " :class="{'flipVert': !descending }">
              sort
              <q-tooltip :disable="!this.settings.showToolTips" :delay="500" :offset="[0, 5]">ascending / descending</q-tooltip>
            </i>
          </a>
          <ul id='order' class='dropdown-content sort'>
            <li @click.stop="setOrderAndDescending('quality')"><a>quality</a></li>
            <li @click.stop="setOrderAndDescending('complexity')"><a>complexity</a></li>
            <li @click.stop="setOrderAndDescending('added')"><a>date added</a></li>
            <li class='disabled'><a>time to view</a></li>
            <li @click.stop="setOrderAndDescending('votes')"><a># of votes</a></li>
            <li @click.stop="setOrderAndDescending('views')"><a># of views</a></li>
            <li class='disabled'><a># responses</a></li>
          </ul>
        </span>
      </div>
      <div style="border-bottom:none;">
        <br/>
        <div class="row right quantity">
          <div>Showing {{resources.length}} of {{resourcesRelated}}</div>
          <div v-if='member.uid'><span v-if="showViewed">Including</span><span v-else>Excluding</span> {{resourcesViewed}} viewed</div>
        </div>

        <!-- <transition name="fade">
							<div>
								<tag v-for="tag in base"
                  :settings='settings'
									:tag="tag"
									:display="'thumb'"
									>
								</tag>
							</div>
						</transition> -->

        <div v-if="crossSection">
          <div id='crossSectionNav' class=" crossSectionNav ">
            <!-- flick navigation for isotope containers -->
            <div :key="step[0]" v-for="step in crossSection">
              <tag  :tag="step" :display="'thumb'" :settings='settings'>
              </tag>
            </div>
          </div>
        </div>

        <q-layout  class="resourceCont">
          <transition name="fade">
            <!-- results by cross section -->
            <div v-if="crossSection">
              <!-- isotope contianers -->
              <div id='crossSectionSteps' class=" crossSectionSteps">
                <div :key="step[0]"  v-for="step in crossSection" class="">
                  <isotope :ref='"resourceBin" + step.setID' :list="resources" :options='{}'>
                    <resource :key="re.resource.uid"
                      :size="size"
                      :settings='settings'
                      v-for="re in resources"
                      :re="re"
                      :display="resourceDisplay"
                      @changedDisplay="layout"
                    >
                    </resource>
                  </isotope>
                </div>
              </div>
            </div>
          </transition>

          <!-- results all together -->
          <transition name="fade">
            <div v-if="!crossSection"
            v-infinite-scroll="infinite"
            infinite-scroll-disabled="busy"
            infinite-scroll-distance="10"
            infinite-scroll-throttle-delay="1000"
            infinite-scroll-immediate-check="false"
            >
              <isotope ref="resourceBin" :list="resources" :options='{}'>
                <resource v-for="re in resources"
                  :size="size"
                  :key="re.resource.uid"
                  :settings='settings'
                  :re="re"
                  :display="resourceDisplay"
                  @changedDisplay="layout"
                  :class="{'listFullWidth': resourceDisplay=='list'}"
                >
                </resource>
              </isotope>
              <Spinner v-show='loadingResources'></Spinner>
            </div>
          </transition>

          <div class="message" v-show="resources.length === 0 || endOfResources">
            <p v-if="resources.length === 0">
              No results! Add a resource or shuffle?
            </p>
            <p v-if="endOfResources">
              No more results! Add a resource or shuffle?
            </p>
            <div>
              <router-link :to="{ name: 'addResource'}" >
                <q-btn color='primary' round >
                  <q-icon name="add" />
                </q-btn>
              </router-link>
              <q-btn @click="random" color='primary' round >
                <i class="far fa-random "></i>
              </q-btn>
            </div>
          </div>

          <q-page-scroller position="bottom-right" :scroll-offset="150" :offset="[18, 18]">
           <q-btn fab icon="keyboard_arrow_up" color="primary" />
         </q-page-scroller>
       </q-layout>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import $ from 'jquery'
import Cookies from 'js-cookie'
import Materialize from 'materialize-css'
import tag from 'components/tag'
import resource from 'components/resource'
import search from 'components/search'
import tagSuggestions from 'components/tagSuggestions'
import infiniteScroll from 'vue-infinite-scroll'
import Spinner from 'vue-simple-spinner'
import isotope from 'vueisotope'

export default {
  name: 'explore',
  components: { tag, resource, search, Spinner, isotope, tagSuggestions },
  directives: {infiniteScroll},
  props: ['tagQuery', 'member','settings',],
  data () {
    return {
      size: 4,
      loginCheck: false, // true after login status is checked
      crossSection: null, // object containing the name of the cross section and tags in lens group - object containing array of tag objects and string name
      tagSuggestions: [], // holds suggestion groups and tags within
      suggestionDisplay: '', // the name of the currently selected display for tag suggestions
      suggestions: [], // suggested tags - array of tag objects
      show: true,
      resources: [], // db when no lens, replace with db even though less items? - array of tag objects
      showViewed: false, // whether or not viewed resources should be returned.
      size: {},
      sizeChange: {},
      resourcesViewed: null, // number of related resources logged in member has viwed
      resourceDisplay: null, // display option for materials in search result - string name of displaytype (thumb, list, card)
      endOfResources: false, // status for reached end of infinite scroll
      loadingResources: false, // status for fetching resources
      orderby: 'quality', // order for returned resources (quality, complexity, number of views, etc.)
      descending: true, // should resources be returned in ascending or descending order
      crossSectionNav: {
        pageDots: false,
        prevNextButtons: false,
        accessibility: false // to prevent jumping when focused
      }
    }
  },
  methods: {
    selectSuggestionGroup (index) {
      this.$refs.tag.selectCell(index)
      this.$refs.steps.selectCell(index)
    },
    setOrderAndDescending (by) {
      this.orderby = by
      Cookies.set('orderby', by)
      Cookies.set('descending', this.descending)

      Notify.create({
        html: '<span class="thin">Order by ' + this.orderby + ', ' + (this.descending ? 'high to low' : 'low to high</span>'),
        timeout: 1500,
        color: 'white',
        bgColor: 'black'
      })
      this.fetchResources()
    },
    infinite () {
      if (!this.endOfResources) {
        this.fetchResources(true)
      }
    },
    random () {
      this.$http.get('/api/resource/random').then(response => {
        this.$router.push({
          name: 'resource',
          params: {
            uid: response.data.uid
          }
        })
      })
    },
    includeSearch (set) {
      if (!this.tagQuery.includes(set.setID)) {
        this.tagQuery.push(set)
      }
      this.removeFrom(set, this.suggestions)
    },
    focus (set) {
      set.status.focusIcon = false
      var tIndex = this.tagQuery.length
      while (tIndex--) {
        if (!this.tagQuery[tIndex].status.pinnedIcon && this.tagQuery[tIndex].setID !== set.setID) this.tagQuery.splice(tIndex, 1)
      }
    },
    removeFrom (item, theArray) {
      for (var i = theArray.length - 1; i >= 0; i--) {
        if (theArray[i].setID === item.setID) theArray.splice(i, 1)
      }
    },
    removeTag (id) {
      for (var i = this.tagQuery.length - 1; i >= 0; i--) {
        if (this.tagQuery[i].setID === id) this.tagQuery.splice(i, 1)
      }
    },
    flipViewed () {
      if (this.member.uid) {
        this.showViewed = !this.showViewed
        this.$nextTick(() => {
          this.fetchResources()
        })

        Cookies.set('showViewed', this.showViewed)
        if (this.showViewed) {
          Materialize.toast('Include viewed resources', 2000)
        } else {
          Materialize.toast('Hide viewed resources', 2000)
        }
      } else {
        Materialize.toast('Must be logged in to hide viewed resources!', 2000)
        $('#login-modal').modal('open')
      }
    },
    addToQuery (tag) {
      tag.connections = 0
      if (tag.persistAction) { // this is handled really poorly...neeed to rethink tag comp. Also, this doesn't work for pin
        tag.status.includeIcon = true
      }
      if (tag.status.focusIcon) {
        this.focus(tag)
      }
      if (this.tagQuery.every(x => x.setID !== tag.setID)) { // don't add if already in query
        this.tagQuery.push(tag)
      } else {
        Materialize.toast('Already in query!', 1500)
      }
    },
    changeDisplay (disp) {
      this.resourceDisplay = disp
      Cookies.set('resourceDisplay', disp)
      // weird to wrap a timeout with next tick, but css lags and screws up the layout after transistion
      // this.$nextTick(function () {
      //   window.setTimeout(() => {
      //     this.layout()
      //   }, 375)
      // })
    },
    changeLens (lens) {
      if (lens === null) {
        Cookies.set('lens', null)
      } else {
        Cookies.set('lens', lens.name)
      }
      if (lens === null || this.crossSection === null || this.crossSection.name !== lens.name) {
        this.crossSection = lens
        this.$nextTick(function () {
          this.layout()
        })
      }
    },
    shuffle (key) {
      this.$refs.resourceBin.shuffle()
      this.$refs.key.shuffle()
      this.$refs.tagQuery.shuffle()
    },
    layout () {
      for (tagIndex in this.crossSection) { // layout all isotope containers in cross section
        this.$refs['resourceBin' + this.crossSection[tagIndex].setID][0].layout('masonry')
      }
      if (this.$refs.tagQuery) {
        this.$refs.tagQuery.layout('masonry')
      }
      if ( this.$refs.resourceBin && (!this.crossSection || this.crossSection.length === 0)) {
        this.$refs.resourceBin.layout()
      }
    },
    getTags () {

      var include = []
      // var exclude = []
      for (var tagIndex = 0; tagIndex < this.tagQuery.length; tagIndex++) {
        include.push(this.tagQuery[tagIndex].setID)
      }
      // this.tagSuggestions = []
      this.$http.get('/api/set/', {
        params: {
          languageCode: 'en',
          include: include,
          exclude: [''],
          type: this.suggestionDisplay
        }
      }).then(response => {
        this.tagSuggestions = response.data

        if (this.tagSuggestions.length === 0) {
          this.suggestionDisplay = 'disciplines'
          Materialize.toast('Add tags to search first!', 2000)
        }
        this.$nextTick(() => {
          this.layout()
        })
      })

    },
    fetchContains (set) { // used in fetching resource lens...
      this.$http.get('/api/set/' + set.setID + '/contains/', {
        params: {
          languageCode: 'en'
        }
      }).then(response => {
        if (response.data.length > 0) {
          this.changeLens(response.data)
        } else {
          Materialize.toast('Contains no tags.', 4000)
        }
      }, response => {
        Materialize.toast('Something went wrong...are you online?', 4000)
      })
    },
    fetchResources (infinite) {
      console.log('gonna fetch?')
      if (!this.loadingResources && !(infinite && this.resources.length === 0)) { // don't fetch if initial resrouces hadn't had time to load to avoid ending up with top resources twice
        this.loadingResources = true
        this.endOfResources = false
        var include = []
        var exclude = []
        var limit = 30 // default for large devices
        if (screen.width <= 480) { // less for mobile
          limit = 10
        }
        var skip = 0
        if (infinite) { // only skip if infinite scrolling
          skip = this.resources.length
        }
        for (var tagIndex = 0; tagIndex < this.tagQuery.length; tagIndex++) {
          if (this.tagQuery[tagIndex]['status'].includeIcon) {
            include.push(this.tagQuery[tagIndex]['setID'])
          } else {
            exclude.push(this.tagQuery[tagIndex]['setID'])
          }
        }
        let route = ''
        if (this.member.uid !== null) { // member specific query if logged in
          route = '/api/auth/resource'
        } else {
          route = '/api/resource'
        }
        console.log(include,this.showViewed, this.orderby, this.descending)
        this.$http.get(route, {
          params: {
            languageCode: 'en',
            include: include,
            exclude: exclude,
            showViewed: this.showViewed,
            skip: skip,
            limit: limit,
            orderby: this.orderby,
            descending: this.descending
          },
          before (request) { // abort current request, if there is one
            if (this.previousRequest) {
              this.previousRequest.abort()
            }
            this.previousRequest = request
          }
        }).then(response => {
          console.log(response)
          if (response.data.length === 0) {
            this.endOfResources = true
            if (!infinite) {
              Materialize.toast('No resources found...', 2000)
              this.resources = []
            }
          } else if (infinite) {
            this.resources.push.apply(this.resources, response.data)
          } else {
            this.resources = response.data
          }
          this.loadingResources = false
        }, failed => {
          Materialize.toast('Something went wrong...', 2000)
          this.loadingResources = false
        })
      }
    },
    fetchResourceQuantity () {
      var include = []
      var exclude = []
      for (var tagIndex = 0; tagIndex < this.tagQuery.length; tagIndex++) {
        if (this.tagQuery[tagIndex]['status'].includeIcon) {
          include.push(this.tagQuery[tagIndex]['setID'])
        } else {
          exclude.push(this.tagQuery[tagIndex]['setID'])
        }
      }
      let route = ''
      if (this.member.uid !== null) { // member specific query if logged in
        route = '/api/auth/resource/count'
      } else { // general query if not logged in
        route = '/api/resource/count'
      }
      this.$http.get(route, {
        params: {
          languageCode: 'en',
          include: include,
          exclude: exclude
        }
      }).then(response => {
        if (response.data.viewedResources) {
          this.resourcesViewed = response.data.viewedResources
        }
        this.resourcesRelated = response.data.relatedResources
      })
    },
    updateURL (tagQuery) { // takes list of tag objects
      if (this.$route.name === 'explore') {
        let q = tagQuery.map(x => x.translation.name.replace(/\s+/g, '_')).map(x => '+' + x)
        // TODO: prepend with + for include, - for exclude, * for pin
        this.$router.push({ name: 'explore', params: { tagquery: q.toString() }, query: this.$route.query })
      }
    },
    checkQuery () {
      let q = this.tagQuery.map(x => x.translation.name.replace(/\s+/g, '_')).map(x => '+' + x).toString()
      if ((this.$route.params.tagquery && this.$route.params.tagquery.length > 0) && this.$route.params.tagquery !== q) {
        this.getTagsByName()
      }
    },
    getTagsByName () {
      this.$http.get('/api/tag/byname', {
        params: {
          // languageCode: 'en', // necessary ?
          tagString: this.$route.params.tagquery
        }
      }).then(response => {
        this.$emit('updateTagQuery', response.data)
      })
    },
    getCookies () {
      // alpha warning
      if (!Cookies.get('alpha-warning-seen')) {
        Cookies.set('alpha-warning-seen', true, {
          expires: 7
        })
        Materialize.toast('Hi! Knowlo is in alpha right now...everthing is subject to change and break.', 10000)
        this.$router.push('/about')
      } else {
        Cookies.set('alpha-warning-seen', true, {
          expires: 7
        }) // reset expiry
      }

      // get previously selected resource display Style
      if (!Cookies.get('resourceDisplay')) {
        this.resourceDisplay = 'card'
      } else {
        this.resourceDisplay = Cookies.get('resourceDisplay')
      }

      // get previously selected orderby
      if (!Cookies.get('orderby')) {
        this.orderby = 'quality'
      } else {
        this.orderby = Cookies.get('orderby')
      }

      // get previously selected desc/asc setting
      if (!Cookies.get('descending')) {
        this.descending = true
      } else {
        this.descending = (Cookies.get('descending') === 'true')
      }

      // get previously show viewed setting
      if (!Cookies.get('showViewed')) {
        this.showViewed = false
      } else {
        this.showViewed = (Cookies.get('showViewed') === 'true')
      }

      // get previously selected suggestionDisplay
      if (!Cookies.get('suggestionDisplay')) {
        this.suggestionDisplay = 'size'
      } else {
        this.suggestionDisplay = Cookies.get('suggestionDisplay')
      }
    },
  },
  mounted () {
    if (!this.resourcesRelated) {
      this.fetchResourceQuantity()
    }
    this.getCookies()
    this.checkQuery()


    // init order by dropdown
    $('.orderby').dropdown()

    // workaround as long as imagesLoaded() non-functional
    setInterval(x => {
      this.layout()
    }, 3000)

  },
  watch: {
    $route (newv, oldv) {
      this.checkQuery()
    },
    member (newVal, oldVal) { // re-fetch resources/tags on member login/logout
      this.loginCheck = true
      this.$nextTick(x => {
        this.fetchResourceQuantity()
        this.fetchResources()
      })
    },
    tagQuery (val, x) {
      this.updateURL(val)
      if (this.tagQuery.length === 0) {
        this.suggestionDisplay = 'disciplines'
      }
      Cookies.set('tagQuery', val)
      this.fetchResources()
      this.fetchResourceQuantity()

    },
    suggestionDisplay (val, x) {
      Cookies.set('suggestionDisplay', val)
      if (x.length > 0) {
        this.getTags()
      }
    }
  }
}
</script>

<style>
.sizec {
  width: 200px;
}
.collapsible-header {
  position:sticky;
  top:0;
  z-index: 22;
  font-weight: 300;
}
.searchHead{
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.hoverable {
  box-shadow: none!important;
}
.hoverable:hover {
  box-shadow: 0 8px 17px 0 rgba(0,0,0,.2), 0 6px 20px 0 rgba(0,0,0,.19)!important;
}
.clear{
  font-size: 11px!important;
  font-weight: 300!important;
  line-height: 14px!important;
  border-radius: 10px!important;
  padding: 2px!important;
  color: black!important;
  width: 5em!important;
  padding-top: 2px!important;
  margin-right: 10%;
  margin-top: 2em;
  /* margin-right: 10%; */
}

.scroll {
  width: 20%;
}
[type="radio"]:checked+label:after, [type="radio"].with-gap:checked+label:before, [type="radio"].with-gap:checked+label:after {
    border: 2px solid #2196F3!important;
}
[type="radio"]:checked+label:after, [type="radio"].with-gap:checked+label:after {
    background-color: #2196F3!important;
}
.suggestionNav {
  z-index: 1;
}
.shadowUnder {
  box-shadow:0 5px 5px 0 rgba(0,0,0,0.2), 0 7px 11px 0 rgba(0,0,0,0.19);
}
.suggestionSteps {
  width: 100vw;
  height: 100%;
	height: 400px;

}
.suggestionGroupStep{
  width: 33%;
  overflow: scroll;
  height: 100%;
  margin-left:40px;
  /*padding: 30px 100px 30px 100px;*/
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-active{
  opacity: 0
}
.dropdown-button{
  margin-top: 5px;
}
.orderby{
  color:black;
}
.orderby span {
  text-transform: uppercase;
  vertical-align: middle;
  font-size: .9em;
}
.orderby i{
  transition: transform .5s;
}
.flipVert {
  transform: scaleY(-1);
}
.sort {
  width:150px!important;
}
.quantity {
  font-weight: 300;
  margin-right: 40px;
}
.resourceCont {
    margin-top:50px;
  }
.crossSectionNav {
  position: sticky;
  overflow: hidden;
  top: -80px;
  background-color: white;
  z-index: 1;
  width: 100%;
}
.crossSectionSteps {
	width: 100%;
}
.listFullWidth {
  width: 100%!important;
  margin-left: 0%!important;
}
#tagSuggestionOptions {
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
}
#tagSuggestionOptions span {
  margin: 10px 20px 0px 20px;
  width: 110px;
}
@media only screen
and (min-device-width : 320px)
and (max-device-width : 480px) { /* portrait tablets, portrait iPad, landscape e-readers, landscape 800x480 or 854x480 phones */
    .suggestionGroupStep{
      padding: 0;
      width: 90vw;
    }
  }
#tagSuggestionOptions {
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
}
#tagSuggestionOptions span {
  margin: 10px 20px 0px 20px;
  width: 110px;
}

.message button {
  margin: 10px;
}
</style>
