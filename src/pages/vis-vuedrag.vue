<template>
  <div>
      <div id='net'>
      </div>

      <q-btn v-on:click="newb">feee</q-btn>
      <q-btn v-on:click="two">adf</q-btn>

    <draggable class='drag' v-model="items" group="people" @start="drag=true" @end="drag=false">
   <div v-for="element in items" :key="element.id">{{element.name}}</div>
</draggable>
  </div>
</template>

<script>

import draggable from 'vuedraggable'
import vis from 'vis-network'


  

export default {
  components: {draggable},
  methods: {
    newb (d) {
      console.log(d)
      this.data.nodes.add([
        {id: 9, label: 'test'},
        {id: 10, label: 'test'},
        {id: 11, label: 'test'},
        {id: 92, label: 'test'},
        {id: 93, label: 'test'},
        {id: 913, label: 'test'},
        ])
        
    },
    two (af,x){ 
      console.log(x)
      this.nodes.remove({ id: 1 });
      console.log(this.network)
      this.network.fit({
      // nodes:this.network.,
      animation: { // -------------------> can be a boolean too!
    duration: Number,
    easingFunction: String
  }}
    )}
  },
  mounted () {
    this.data.nodes = new vis.DataSet([
    {id: 1, label: 'Node 1'},
    {id: 2, label: 'Node 2'},
    {id: 3, label: 'Node 3'},
    {id: 4, label: 'Node 4'},
    {id: 5, label: 'Node 5'}
  ]);

  // create an array with edges
  this.data.edges = new vis.DataSet([
    {from: 1, to: 3},
    {from: 1, to: 2},
    {from: 2, to: 4},
    {from: 2, to: 5},
    {from: 3, to: 3}
  ]);

   // create a network
  var container = document.getElementById('net');

  var options = {};
  this.network = new vis.Network(container, this.data, this.netOptions);
  },
  data () { 
    return {
      network: {},
      groups: [{
      	id: 0,
        content: 'Group 1'
      }],
      items: [{
        name: 'teasdfasdfadsst',
      	id: 0,
        group: 0,
        start: new Date(),
        content: 'Item 1'
      },
      {
        name: 'test',
      	id: 2,
        group: 0,
        start: new Date(),
        content: 'Item 1'
      }],
      data: {
        
        nodes: {

        },
        edges: {

        }
      },
      netOptions: {
        
      }
    }
  }
}
</script>

<style>
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