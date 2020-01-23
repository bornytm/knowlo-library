<template>
  <div>
    <flick 
        class='itemContainer' 
        ref='itemContainer' 
        key="itemContainer" 
        :options="itemContainer" 
        v-on:changee='updateSliderPosition'
        >
           
            <resource class="item" :key="re.resource.uid"
                      :settings='{}'
                      v-for="re in items"
                      :re="re"
                      :display="'card'"
                      v-on:changedDisplay=""
                    ></resource>
           
        
    </flick> 

    <q-slider class='slider' v-model="slide" :min="0" :max="items.length - 1" @input="selectItem" />
  </div>
    
</template>

<script>
import flick from 'components/flick'
import Flickity from 'vue-flickity'
import resource from 'components/resource'


export default {
    name: 'cross-section',
    components: {flick, Flickity, resource},
    props: ['items'],

    mounted () {
        // this.$refs.itemContainer.on( 'change', index => { // v-on not working on flickity component
        //     console.log('item c changed')
        //     this.updateSliderPosition(index)
        // } ) 
    },
    watch: {
        items: function (x) {
            this.$refs.itemContainer.destroy()
            this.$nextTick(() => {
                this.$refs.itemContainer.init()
                this.updateSliderPosition(0)
            })           
        }
    },

    data () {
        return {
            slide: 0,
            itemContainer: {
                friction: .3,
                selectedAttraction: this.$q.platform.is.mobile? .05 : .028, // faster snap on mobile
                pageDots: false,
                prevNextButtons: this.$q.platform.is.mobile? false : true, // hide on mobile
                // accessibility: false, // to prevent jumping when focused
            }
        }
    },
    methods: {
        selectItem (selected) {     
            this.$refs.itemContainer.selectCell( selected )
        },
        updateSliderPosition (index) {
            if (this.slide != index) {
                this.slide = index
            }
        }
    },
}
</script>

<style scoped>
.itemContainer div {
    height: 100vh;
    width: 80vw;
}
.itemContainer {
    /* overflow: scroll; */
    height: 80vh;
    width: 100vw;
    padding-top: 50px;
}

.item {
    height: 200vh;
    /* overflow-x: scroll; */
    overflow-y:scroll;
  touch-action: pan-y;
}

/* fade in image when loaded */
.carousel-cell-image {
  transition: opacity 0.4s;
  opacity: 0;
  
}

.carousel-cell-image.flickity-lazyloaded,
.carousel-cell-image.flickity-lazyerror {
  opacity: 1;
}

.slider {
    margin: 10vw;
    width: 80vw;
    /* position: fixed;
    bottom: 5%; */
}

.carousel-cell {
 touch-action: pan-y;
}

/* hide progress bar on slider */
{

}


template {
    height: 100%;
}

* {
    outline: 1px solid black;
}
</style>
