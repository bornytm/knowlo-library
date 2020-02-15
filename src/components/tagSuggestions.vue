<template>
  <div class='all'>
  <div class='options center'>
    <!-- <q-radio v-model="displayed" val="base" label="Base Tags" /> -->
    <q-radio v-model="displayed" val="tags" label="Related Tags" />
    <q-radio v-model="displayed" val="groups" label="Related Groups" />
    <q-radio v-model="displayed" val="Time" label="Time" />
    <q-radio v-model="displayed" val="Size" label="Size" />
    <q-radio v-model="displayed" val="Types" label="Types" />
    <!-- <q-radio v-model="displayed" val="disciplines" label="disciplines" /> -->
  </div>
  <q-btn class='back' color='primary' small flat round v-show='displayed === "subGroup"' @click="showAllGroups">
    <q-icon name='arrow back' />
  </q-btn>

  <transition type='fade'>
    <cross-section id="tagS" :items="tags">

      <div v-for="tag, i in tags">
        <tag :tag="tag"
        :display="'thumb'"
        :settings='settings'
        :key="tag.tag.uid+i"
        v-on:include="addTag(tag)"
        v-on:pin="addTag(tag)"
        v-on:focus="addTag(tag)"
        hide="lens remove"
        v-on:main="showGroup(i)"
        >
        </tag>
      </div>
    </cross-section>
  </transition>

  <!-- <isotope  v-if='show' class='rtags' ref='rtags' :list="tags" :options="{}">
    <tag v-if='displayed === "groups"' v-for="tag, i in tags"
      :tag="tag"
      :key="tag.tag.uid+i"
      :settings='settings'
      v-on:include="addTag(tag)"
      v-on:pin="addTag(tag)"
      v-on:focus="addTag(tag)"
      hide="lens remove"
      v-on:main="showGroup(i)"
      display='thumb'>
    </tag>

    <tag v-else
      :tag="tag"
      :key="tag.tag.uid+i"
      :settings='settings'
      v-on:include="addTag(tag)"
      v-on:pin="addTag(tag)"
      v-on:focus="addTag(tag)"
      hide="remove lens"
      v-on:main="tagQuery.push(tag)"
      display='thumb'>
    </tag>
  </isotope> -->
  </div>
</template>

<script>
import tag from 'components/tag'
import flick from 'components/flick'
import isotope from 'vueisotope'
import {QRadio, QBtn, QIcon} from 'quasar'
import crossSection from 'components/cross-section'
import tagAPI from '../api/tags'

export default {
  name: 'tagSuggestions',
  components: { tag, isotope, flick, crossSection },
  props: ['tagQuery', 'settings'],
  data() {
    return {
      show: true,
      fetching: false, // currently fetching
      tags: [],
      type: 'none',
      displayed: 'tags', // TODO save in cookie?
      baseUID: 'rJlh4ZPpNG',
      groupSet: []
    }
  },
  methods: {
    showGroup(index) {
      if(this.groupSet[index]){
        this.tags = this.groupSet[index].contains
        this.displayed = 'subGroup'
      }
    },
    showAllGroups() {
      this.tags = this.groupSet.map(x => {
        x.group[0].connections = x.contains.length // show number of tags contained
        return x.group[0]
      })
      this.$nextTick(() => {
        // this.$refs.rtags.layout()
      })
      this.displayed = 'groups'
    },
    addTag(tag) {
      this.$emit('add', tag) // with pin/include/focus flag
    },
    fetch() { // determine which method to get
      if(!this.fetching) { // TODO: fix me. This prevents isotope from screwing up(breaking due to multiple assignments of the tag suggestion array) but also prevents the right tag suggestions from loading after loading the tag query from cookies
        this.tags = []
        if(this.displayed === 'subGroup') {
          this.displayed = 'groups'
        }
        if(this.displayed === 'base') {
          this.getBase()
        } else if(this.displayed === 'groups') {
          this.getGroups()
        }else if(this.displayed === 'Time') { // save in local storage if already fetched? no reason to hit the db more than necessary...
          tagAPI.getContains('BJNgnDdk-')
                .then(response => {
                  console.log(response)
                   this.tags = response.data
                })
                .catch(error => console.log(error))
        }else if(this.displayed === 'Size') {
          tagAPI.getContains('BJgVf2ZQYW')
                .then(response => {
                  console.log(response)
                   this.tags = response.data
                })
                .catch(error => console.log(error))
        }else if(this.displayed === 'Types') {
          tagAPI.getContains('HywG30RSyW')
                .then(response => {
                  console.log(response)
                   this.tags = response.data
                })
                .catch(error => console.log(error))
        } else if(this.tagQuery.length > 0) {
          this.getTopRelated()
        } else {
          this.getTopAll()
        }
      }
    },
    getBase() {
      this.fetching = true
      this.tagSuggestions = []
      this.$http.get('/api/set/' + 'rJgyQNK64f' + '/crossSection', { // hard coding base-set uid
        params: {
          languageCode: 'en'
        },
        before(request) {
          if(this.previousRequest) {
            this.previousRequest.abort()
          }
          this.previousRequest = request
        }
      }).then(response => {
        this.tags = response.data.map(x => x.group[0])

        // this.$refs.rtags.layout()
        this.fetching = false
      })
    },
    getGroups() {
      this.fetching = true
      var include = []
      for(var tagIndex = 0; tagIndex < this.tagQuery.length; tagIndex++) {
        include.push(this.tagQuery[tagIndex].setID)
      }
      this.$http.get('/api/set/', {
        params: {
          languageCode: 'en',
          include: include,
          exclude: [''],
          type: this.displayed
        },
        before(request) {
          if(this.previousRequest) {
            this.previousRequest.abort()
          }
          this.previousRequest = request
        }
      }).then(response => {
        this.groupSet = response.data
        this.showAllGroups()
        this.fetching = false
      })
    },
    getTopRelated() {
      this.fetching = true
      let include = []
      // var exclude = []
      for(var tagIndex = 0; tagIndex < this.tagQuery.length; tagIndex++) {
        include.push(this.tagQuery[tagIndex].setID)
      }
      this.$http.get('/api/set/', {
        params: {
          languageCode: 'en',
          include: include,
          exclude: [''],
          type: 'none'
        }
      }).then(response => {
        this.tags = response.data
        // this.$refs.rtags.layout()
        this.fetching = false
      })
    },
    getTopAll() {
      this.fetching = true
      this.$http.get('/api/tag/most', {
        params: {
          languageCode: 'en'
        }
      }).then(response => {
        this.tags = response.data
        // this.$refs.rtags.layout()
        this.fetching = false
      })
    }
  },
  mounted() {
    // this.flicker()
    setTimeout(() => { // wait for vue-isotope to be ready
      this.fetch()
    }, 100)
  },
  watch: {
    tagQuery(val) {
      this.fetch()
    },
    displayed(val) {
      if(val !== 'subGroup') {
        this.fetch()
      }
    }
  }
}
</script>

<style scoped>
.rtags {
  min-height: 150px;
  /* margin-left: 30px; */
  /* max-height: 300px; */
  /* width: 100vw; */
}
.options {
  margin-left: 30px;
  margin-right: 10px;
  height: 40px;
}
.back {
  margin:10px;
}
.crossSectionNav .flickity-page-dots {
  margin-bottom: -23px;
}
.crossSectionNav .flickity-page-dots {
  bottom: 23px;
}
.sugg {
  min-height: 100px;
}
#tagS {
  height:170px;
}
</style>
