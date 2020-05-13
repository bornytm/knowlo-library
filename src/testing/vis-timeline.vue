<template>
    <div >
        <div class='ttt'>
        uh....
       
        <Timeline v-if="show" ref='timeline' :start='start' :end='end' :items="items" :option="option" :groups="groups" ></Timeline>
        </div>
    </div>
</template>

<script>
import 'vue2vis/dist/vue2vis.css'

import {Timeline}  from 'vue2vis'
console.log(Timeline)
export default {
    components:{ Timeline },
    mounted () {
        setTimeout(() => {
            this.show = true
        }, 1000)
        console.log(this.start)
        console.log(this.end)
        console.log(this.$refs.timeline)
    },
    data() {
		return {
            show: false,
            // start: new Date("January 1, 2020 00:00:30"),
            start: "2014-04-13",
            end: "2014-05-19",
			groups: [
                // {
                //     id: 'g1', 
                //     content:'Tags'
                // },
                // {
                //     id: 'g2', 
                //     content:'Resources'
                // }
            ],
            items: [
                { id: 1, content: "item 1", start: "2014-04-20" },
                { id: 2, content: "item 2", start: "2014-04-14" },
                { id: 3, content: "item 3", start: "2014-04-18" },
                { id: 4, content: "item 4", start: "2014-04-16", end: "2014-04-19" },
                { id: 5, content: "item 5", start: "2014-04-25" },
                { id: 6, content: "item 6", start: "2014-04-27", type: "point" }
            ],
			// items: [
			//     { 
            //         start: new Date(2010, 7, 17),
            //         end: new Date(2010, 7, 18),  // end is optional
            //         id: 'a1', 
            //         content: 'Item one', 
            //         group: 'g1'
            //     },
            //     { 
            //         start:  new Date(2010, 7, 19),
            //         // end: new Date(2010, 7, 21),
            //         id: 'a2', 
            //         content: 'Item two', 
            //         group: 'g2'
            //         },
            //     { 
            //         start:  new Date(2010, 7, 20),
            //         // end: new Date(2010, 7, 21), 
            //         id: 'a3', 
            //         content: 'Item three', 
            //         group: 'g1'
            //         }
            // ],
            option: {
                // stack: false,
                // max: new Date("January 1, 2020 00:04:30"),
                // min: new Date("January 1, 2020 00:00:00"),
                // showMajorLabels: false,
                // stackSubgroups: false,
                // width: '200px',
                // height: '80px',
                // margin: {
                //     item: 20
                // },
                // maxHeight: 400,
                // timeAxis: {scale: 'minute', step: 5}
            }
		}
    },
    methods: {
	    updateItem: function (item) {
            // handle the event
            console.log('update item')
	    }
	}

}
</script>
<style>
.time {
    /* padding: 100px;
    height: 400px;
    width: 400px;
    max-height: 400px */
}
* {
    outline: 1px solid black;
}
.ttt {
    margin: 300px;
}
</style>