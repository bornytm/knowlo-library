<template>
  <div>
      <!-- <search class ='col' exclude="" input-id="mainSearch" holder-text="Search" v-on:select="test"></search>       -->
      <network ref="network" class='net'
      :nodes="nodes"
      :edges="edges"
      :options="options"
      v-on:hold="hold"
      v-on:select-node="choose"
      >
      </network>
      <div class='opt'>
        <q-btn fab v-on:click="getRelated">size</q-btn>
        <q-btn fab  v-on:click="remove">scale</q-btn>
      </div>
   
      <q-input v-model="name" type="textarea" filled />

      <q-btn v-on:click="add">add</q-btn>
      <q-btn v-on:click="remove">remove</q-btn>
      <q-btn v-on:click="reset">reset</q-btn>
      <q-btn v-on:click="fit">fit</q-btn>
      <q-btn v-on:click="getTop">getTop</q-btn>
      <!-- <q-btn v-on:click="getTop">getTop</q-btn> -->

    <!-- <draggable class='drag' v-model="items" group="people" @start="drag=true" @end="drag=false">
   <div v-for="element in items" :key="element.id">{{element.name}}</div>
</draggable> -->
  </div>
</template>

<script>

import draggable from 'vuedraggable'
import network from 'components/vis-network'
import search from 'components/search'
import tagsAPI from '../api/tags.js'

export default {
  components: {draggable, network, search },
  mounted (){
    
  },
  methods: {
    getRelated(inc){
      tagsAPI.getRelated([inc],[])
      .then(tags => {
        // let id = this.nodes.length + 1
        // this.nodes.push({
        //   id: id,
        //   label: 'related',
        //   shape: 'circle'
        // })
        console.log(tags)
        this.addNodes(tags.data, inc)  
      })
      .catch(error => console.log(error))
    },
    test (x){
      console.log(x)
      console.log(x.translation.name)
      this.addNodes([x])
    },
    getTop(){
      tagsAPI.getTopAll()
      .then(tags => {
        console.log(tags)
        let id = this.nodes.length + 1
        this.nodes.push({
          id: id,
          label: 'heh',
          shape: 'circle'
        })
        this.addNodes(tags.data, id)  
      })
      .catch(error => console.log(error))
    },
    choose(x) {
      console.log(x)
      // console.log(this.nodes.find(x => x.id === x.nodes[0]))
      console.log(this.nodes.find(y => y.id === x.nodes[0]).label)
      this.name = this.nodes.find(y => y.id === x.nodes[0]).label
      // this.getContains(x.nodes[0])
      // this.getWithin(x.nodes[0])
      this.getRelated(x.nodes[0])
      
      // this.name = 
      // this.nodes.find(x => x.id === x.nodes[0]).label
    },
    getContains(id){
      tagsAPI.getContains(id)
      .then(tags => {
        this.addNodes(tags.data, id)
      })
    },
    getWithin(id){
      tagsAPI.getWithin(id)
      .then(tags => {
        this.addNodes(tags.data, id)
      })
    },
    addNodes(tags, core){
      for(let tag in tags){
          if(!this.nodes.some(node => node.id === tags[tag].setID)){
            let shape = tags[tag].tag.iconURL? 'circularImage' : 'circle'
            this.nodes.push({
              id: tags[tag].setID,
              label: tags[tag].translation.name,
              image: tags[tag].tag.iconURL,
              shape: shape
            })
          }
          if(core){
              this.edges.push({
              from: core,
              to: tags[tag].setID,
            })
          }
        }
    },
    hold (x) {
      console.log('im held',x)
      console.log(this.$refs.network)
      // this.$refs.network.options.manipulation.addEdge = true
      this.$refs.network.addEdgeMode()

      // this.options.manipulation.addEdge = true
    },
    test2 () {
      console.log('im test2')
    },
    fit () {
      this.$refs.network.fit({
        animation: { // -------------------> can be a boolean too!
          duration: 500,
          // easingFunction: String
        }
      })
  
    },
    add (d) {
      console.log(d)
      this.nodes.push(
        {id: this.nodes.length + 1,  label: 'circle',  shape: 'circle' },
        )
        
    },
    reset () {
      this.edges =[]
      this.nodes = []
    },
    remove (af,x){ 
      console.log(x)
      this.nodes.pop();
      console.log(this.network)
      this.$refs.network.fit({
        // nodes:this.network.,
        animation: { // -------------------> can be a boolean too!
        duration: 500,
        // easingFunction: String
      }}
    )}
  },
  data () { 
    return {
      name: 'holder',
      nodes: [
        {id: 1,  label: 'circle',  shape: 'circle' },
        {id: 2,  label: 'ellipse', shape: 'ellipse'},
        {id: 3,  label: 'database',shape: 'database'},
        {id: 4,  label: 'box',     shape: 'box'    },
        {id: 5,  label: 'diamond', shape: 'diamond'},
        {id: 6,  label: 'dot',     shape: 'dot'},
        {id: 7,  label: 'square',  shape: 'square'},
        {id: 8,  label: 'triangle',shape: 'triangle'},
      ],
      edges: [
        {from: 1, to: 2},
        {from: 2, to: 3},
        {from: 2, to: 4},
        {from: 2, to: 5}, 
        {from: 5, to: 6},
        {from: 5, to: 7},
        {from: 6, to: 8}
      ],
      options: {
        // nodes: {
        //   borderWidth: 4
        // },
        edges: {
          color: 'lightgray'
        }
      }
    }
  }
}
</script>

<style>
.net {
  width: 100%;
  height: 200px;
}

</style>