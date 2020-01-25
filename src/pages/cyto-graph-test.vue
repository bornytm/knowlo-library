 <template>
    <div>
         <cytoscape ref="cy" :config="config" v-on:cxttap="test" v-on:mousedown="addNode" :preConfig="preConfig" :afterCreated="afterCreated">
            <cy-element
                
                v-for="def in elements"
                :key="`${def.data.id}`"
           
                
                :definition="def"
                v-on:mousedown="deleteNode($event, def.data.id)"
            />
        </cytoscape>
        </div>
       
 </template>
 
 <script>
 
import cxtmenu from 'cytoscape-cxtmenu';

let cyinst = null
export default {
    name: "graph-test",
    methods: {
        addThing () {
            this.elements.push({
                        data: { id: response.data[1].contains[x].tag.uid },
                        style: {
                            'background-image': response.data[1].contains[x].tag.iconURL,
                            'background-fit': 'cover cover',
                        },
        },
        getTags () {
            var scaleIDs = {
                'size': 'BJgVf2ZQYW',
                'disciplines': 'Bylx_hVBa-',
                'time': 'BJNgnDdk-'
            }
            // var id = scaleIDs[this.suggestionDisplay]
            var id = 'Bylx_hVBa-'
            this.tagSuggestions = []
            this.$http.get('/api/set/' + id + '/crossSection', {
                params: {
                languageCode: 'en'
                }
            }).then(response => {
                for (var x in response.data) {
                    if (response.data[x].contains[0].tag === null) {
                        response.data[x].contains = []
                    }
                    if (response.data[x].group[0].translation === null) {
                        response.data[x].group[0].translation = ''
                        console.log('I need to be dealt with - improve query.')
                        // no translation because contains no tags
                    }
                   
                }
                console.log(response.data)
                for (var x in response.data[1].contains){
                     this.elements.push({
                        data: { id: response.data[1].contains[x].tag.uid },
                        style: {
                            'background-image': response.data[1].contains[x].tag.iconURL,
                            'background-fit': 'cover cover',
                        },
                    })
                }
                for (var x in response.data){
                    this.elements.push({
                        data: { id: response.data[x].group[0].tag.english },
                        style: {
                            'background-image': response.data[x].group[0].tag.iconURL,
                            'background-fit': 'cover cover',
                        },
                    })
                    for (var y in response.data[x].contains){
                        this.elements.push({
                            data: { id: response.data[x].contains[y].tag.english },
                            style: {
                                'background-image': response.data[x].contains[y].tag.iconURL,
                                'background-fit': 'cover cover',
                            },
                        })
                        this.elements.push({
                            data: {
                                id: response.data[x].contains[y].tag.english + response.data[x].group[0].tag.english,
                                source: response.data[x].contains[y].tag.english,
                                target: response.data[x].group[0].tag.english,
                            }
                        })
                    }
                }
                // this.tags = response.data


            })
        },
        test(event, id) {
            console.log('in test')
            
            console.log(this.tags)
            if (this.tags.length == 0){
                this.getTags();
            }
            // var layout = cyinst.layout({ name: 'random', animate: true, easing: 'ease', duration: 500 });
            var layout = cyinst.layout(this.config.layout);

            layout.run();
            // console.log(this.elements)
            // // this.elements.splice(0,1)
            console.log(this.elements)
        },
        deleteNode(event, id) {
            console.log('node clicked', id)
            // for(var i = 0; i < this.elements.length; i++) {
            //     if(this.elements[i].data.id == id) {
            //         console.log('found')
            //         this.elements.splice(i, 1);
                    
            //         break;
            //     }
            // }
            console.log(this.elements.length)
            this.elements = this.elements.filter(function( obj ) {
                return obj.data.id !== id;
            });
            // this.elements = [];
                        console.log(this.elements.length)

            // let l = cyinst.layout(this.config.layout)
            // l.run()
        },
        addNode(event, id) {
            console.log('bacground clicked?', id)
            // this.elements.push({
            //     data: {
            //         id: event.timeStamp,
            //     },
            //      position: {
            //             x: event.position.x,
            //             y: event.position.y
            //         }
            // })
        },
        preConfig (cytoscape) {
           
            try { // avoid duplication on hot-reload during dev
                cytoscape.use(cxtmenu)
            }
            catch(error) {
                console.error(error);
            }
           
        },
        afterCreated (cyt) {
            let menu = cyt.cxtmenu(this.menuOpt)
            cyinst = cyt;
            
        }
     },
     data () {
        return {
            tags: [],
            menuOpt: {
                menuRadius: 100, // the radius of the circular menu in pixels
                selector: 'node', // elements matching this Cytoscape.js selector will trigger cxtmenus
                commands: [ // an array of commands to list in the menu or a function that returns the array
                    
                    { // example command
                    fillColor: 'rgba(200, 200, 200, 0.75)', // optional: custom background color for item
                    content: 'a command name', // html/text content to be displayed in the menu
                    contentStyle: {}, // css key:value pairs to set the command's css in js if you want
                    select: function(ele){ // a function to execute when the command is selected
                        // console.log( ele.id() ) // `ele` holds the reference to the active element
                    },
                    enabled: true // whether the command is selectable
                    },
                    { // example command
                    fillColor: 'rgba(200, 200, 200, 0.75)', // optional: custom background color for item
                    content: 'woah buddy', // html/text content to be displayed in the menu
                    contentStyle: {}, // css key:value pairs to set the command's css in js if you want
                    select: function(ele){ // a function to execute when the command is selected
                        // console.log( ele.id() ) // `ele` holds the reference to the active element
                    },
                    enabled: true // whether the command is selectable
                    },
                     { // example command
                    fillColor: 'rgba(200, 200, 200, 0.75)', // optional: custom background color for item
                    content: 'a command name', // html/text content to be displayed in the menu
                    contentStyle: {}, // css key:value pairs to set the command's css in js if you want
                    select: function(ele){ // a function to execute when the command is selected
                        // console.log( ele.id() ) // `ele` holds the reference to the active element
                    },
                    enabled: true // whether the command is selectable
                    },
                    { // example command
                    fillColor: 'rgba(200, 200, 200, 0.75)', // optional: custom background color for item
                    content: 'woah buddy', // html/text content to be displayed in the menu
                    contentStyle: {}, // css key:value pairs to set the command's css in js if you want
                    select: function(ele){ // a function to execute when the command is selected
                        // console.log( ele.id() ) // `ele` holds the reference to the active element
                    },
                    enabled: true // whether the command is selectable
                    },
                    { // example command
                    fillColor: 'rgba(200, 200, 200, 0.75)', // optional: custom background color for item
                    content: 'woah buddy', // html/text content to be displayed in the menu
                    contentStyle: {}, // css key:value pairs to set the command's css in js if you want
                    select: function(ele){ // a function to execute when the command is selected
                        // console.log( ele.id() ) // `ele` holds the reference to the active element
                    },
                    enabled: true // whether the command is selectable
                    },
                    
                    
                ], // function( ele ){ return [ /*...*/ ] }, // a function that returns commands or a promise of commands
                fillColor: 'rgba(0, 0, 0, 0.75)', // the background colour of the menu
                activeFillColor: 'rgba(1, 105, 217, 0.45)', // the colour used to indicate the selected command
                activePadding: 20, // additional size in pixels for the active command
                indicatorSize: 24, // the size in pixels of the pointer to the active command
                separatorWidth: 3, // the empty spacing in pixels between successive commands
                spotlightPadding: 4, // extra spacing in pixels between the element and the spotlight
                minSpotlightRadius: 24, // the minimum radius in pixels of the spotlight
                maxSpotlightRadius: 38, // the maximum radius in pixels of the spotlight
                openMenuEvents: 'cxttapstart taphold', // space-separated cytoscape events that will open the menu; only `cxttapstart` and/or `taphold` work here
                itemColor: 'white', // the colour of text in the command's content
                itemTextShadowColor: 'transparent', // the text shadow colour of the command's content
                zIndex: 9999, // the z-index of the ui div
                atMouse: false // draw menu at mouse position
            },
            elements:[
            // { // node a
            //     data: { id: 'a' },
            //     style: {
            //         'background-image': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQU3x9oEaEchpZ5UbuwoYLvzGNzQQ1ws8It-ENWW--H_FDrnoHLA-e67BB6',
            //         'background-fit': 'cover cover',
            //     },

            // }, { // node b
            //     data: { id: 'b' }
            // }, { // edge ab
            //     data: { id: 'ab', source: 'a', target: 'b' }
            // }
            ],
            config: {
                userPanningEnabled: false,
            
                style: [
                    {
                    selector: 'node',
                    style: {
                        'background-color': '#666',
                        'label': 'data(id)'
                    }
                    }, {
                    selector: 'edge',
                    style: {
                        'width': 3,
                        'line-color': '#ccc',
                        'target-arrow-color': '#ccc',
                        'target-arrow-shape': 'triangle'
                    }
                    }
                ],
                layout: {
                    name: 'cose',
                    
                   animate: 'end',

  // Easing of the animation for animate:'end'
  animationEasing: 'ease',

  // The duration of the animation for animate:'end'
  animationDuration: 2000,

  // A function that determines whether the node should be animated
  // All nodes animated by default on animate enabled
  // Non-animated nodes are positioned immediately when the layout starts
  animateFilter: function ( node, i ){ return true; },


  // The layout animates only after this many milliseconds for animate:true
  // (prevents flashing on fast runs)
//   animationThreshold: 250,

//   // Number of iterations between consecutive screen positions update
//   refresh: 10,

//   // Whether to fit the network view after when done
//   fit: true,

//   // Padding on fit
//   padding: 30,

//   // Constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
//   boundingBox: undefined,

//   // Excludes the label when calculating node bounding boxes for the layout algorithm
//   nodeDimensionsIncludeLabels: false,

//   // Randomize the initial positions of the nodes (true) or use existing positions (false)
//   randomize: false,

//   // Extra spacing between components in non-compound graphs
//   componentSpacing: 40,

//   // Node repulsion (non overlapping) multiplier
//   nodeRepulsion: function( node ){ return 2048; },

//   // Node repulsion (overlapping) multiplier
//   nodeOverlap: 4,

//   // Ideal edge (non nested) length
//   idealEdgeLength: function( edge ){ return 32; },

//   // Divisor to compute edge forces
//   edgeElasticity: function( edge ){ return 32; },

//   // Nesting factor (multiplier) to compute ideal edge length for nested edges
//   nestingFactor: 1.2,

//   // Gravity force (constant)
//   gravity: 1,

//   // Maximum number of iterations to perform
//   numIter: 1000,

//   // Initial temperature (maximum node displacement)
//   initialTemp: 1000,

//   // Cooling factor (how the temperature is reduced between consecutive iterations
//   coolingFactor: 0.99,

//   // Lower temperature threshold (below this point the layout will end)
//   minTemp: 1.0
                }
            }
        }
    }
 
 }
 
 </script>
 
 <style>
 
 </style>