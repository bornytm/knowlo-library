<template>
  <div>
      <network ref="network" class='net'
      :nodes="nodes"
      :edges="edges"
      :options="options">
      </network>
   
      <q-btn v-on:click="add">add</q-btn>
      <q-btn v-on:click="remove">remove</q-btn>
      <q-btn v-on:click="reset">reset</q-btn>
      <q-btn v-on:click="fit">fit</q-btn>

    <!-- <draggable class='drag' v-model="items" group="people" @start="drag=true" @end="drag=false">
   <div v-for="element in items" :key="element.id">{{element.name}}</div>
</draggable> -->
  </div>
</template>

<script>

import draggable from 'vuedraggable'
import network from 'components/vis-network'


export default {
  components: {draggable, network },
  methods: {
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
         nodes: {
          borderWidth: 4
         },
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
  height: 500px;
}
.drag {
  padding-top: 100px;
  height: 700px;
}
#net {
  width: 600px;
      height: 400px;
      border: 1px solid lightgray;
}
</style>