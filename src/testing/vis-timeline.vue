<template>
    <div class='time'>
        <!--  test with -->
        <link href="https://cdnjs.cloudflare.com/ajax/libs/vis/4.21.0/vis.min.css" rel="stylesheet">
        <timeline ref='time' :items="items" :start="start" :end="end" :option="option" :groups="groups" :hide-tools=true></timeline>
    </div>
</template>

<script>
import timeline from 'vue-visjs-timeline'
console.log(timeline)
export default {
    components: { timeline },
    mounted () {
        console.log(this.start)
        console.log(this.end)
        console.log(this.$refs.time)
    },
    data() {
		return {
            start: new Date("January 1, 2020 00:00:30"),
            end: new Date("January 1, 2020 00:02:30"),
			groups: [
                {id: 'g1', 
                content:'Tags'
                },
                {id: 'g2', 
                content:'Resources'
                }
			],
			items: [
			    { 
                    start: new Date("January 1, 2020 00:02:25"),
                    // end: new Date(2010, 7, 18),  // end is optional
                    id: 'a1', content: 'Item one', 
                    group: 'g1'
                },
                { 
                    start:  new Date("January 1, 2020 00:01:45"),
                    // end: new Date(2010, 7, 21),
                    id: 'a2', 
                    content: 'Item two', 
                    group: 'g2'
                    },
                { 
                    start:  new Date("January 1, 2020 00:01:00"),
                    // end: new Date(2010, 7, 21), 
                    id: 'a3', 
                    content: 'Item three', 
                    group: 'g1'
                    }
            ],
            option: {
                stack: false,
                max: new Date("January 1, 2020 00:04:30"),
                min: new Date("January 1, 2020 00:00:00"),
                showMajorLabels: false
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
    height: 400px;
    width: 400px;
    max-height: 400px
}
/* * {
    outline: 1px solid black;
} */
</style>