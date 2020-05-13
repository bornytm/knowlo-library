<template>
    <div>
        <Timeline id='tl' ref='time' :start='start' :end='end' :items="items" :options="options" :groups="groups" ></Timeline>
    </div>
</template>

<script>
import 'vue2vis/dist/vue2vis.css'
import {Timeline}  from 'vue2vis'
export default {
    components:{ Timeline },
    mounted () {
        this.$refs.time.addCustomTime( new Date("January 1, 2020 00:00:30"))
    },
    data() {
		return {
            start: new Date("January 1, 2020 00:00:30"),
            end: new Date("January 1, 2020 00:02:30"),
			groups: [
                {
                    id: 'g1', 
                    content:'Tags'
                },
                {
                    id: 'g2', 
                    content:'Resources'
                }
            ],
            items: [
			    { 
                    start: new Date("January 1, 2020 00:02:25"),
                    // end: new Date(2010, 7, 18),  // end is optional
                    id: 'a1', content: 'Item one in g1', 
                    group: 'g1',
                },
                { 
                    start: new Date("January 1, 2020 00:02:26"),
                    // end: new Date(2010, 7, 18),  // end is optional
                    id: 'a4', content: 'Item ggggg in g1', 
                    group: 'g1'
                },
                { 
                    start:  new Date("January 1, 2020 00:01:45"),
                    // end: new Date(2010, 7, 21),
                    id: 'a2', 
                    content: 'helooooo in g2', 
                    group: 'g2',
                    type: 'point'
                    },
                { 
                    start:  new Date("January 1, 2020 00:01:00"),
                    // end: new Date(2010, 7, 21), 
                    id: 'a3', 
                    content: 'Item three', 
                    group: 'g1'
                    }
            ],
            options: {
                stack: false,
                max: new Date("January 1, 2020 00:04:30"),
                min: new Date("January 1, 2020 00:00:00"),
                // editable: true,
                // selectable: true,
                stackSubgroups: false,
                showMajorLabels: false,
                // snap: null,
                zoomMin: 1000,
                format: {
                    minorLabels: {
                        second: 'm:ss',
                        minute: 'm:ss',
                        hour: 'm:ss'
                    }
                }
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
#tl {
    /* margin: 300px */
}
</style>