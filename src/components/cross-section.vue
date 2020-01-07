<template>
  <div>
    <flickity 
        class='itemContainer' 
        ref='itemContainer' 
        key="itemContainer" 
        :options="itemContainer" 
        >
        <div v-for="item in items"
            :key="item"
            > 
            <span>boo</span>
        </div>
    </flickity> 

    <q-slider class='slider' v-model="slide" :min="0" :max="items.length - 1" @input="selectItem" />
  </div>
    
</template>

<script>
import Flickity from 'vue-flickity'

export default {
    name: 'cross-section',
    components: {Flickity},
    mounted () {
        this.$refs.itemContainer.on( 'change', index => { // v-on not working on flickity
            this.updateSliderPosition(index)
        } ) 
    },
    data () {
        return {
            slide: null,
            itemContainer: {
                friction: .3,
                selectedAttraction: this.$q.platform.is.mobile? .05 : .028, // faster snap on mobile
                pageDots: false,
                prevNextButtons: this.$q.platform.is.mobile? false : true, // hide on mobile
                // accessibility: false, // to prevent jumping when focused
            },
            items: [
                1,2,3,43,5,6,4
            ]
        }
    },
    methods: {
        selectItem (selected) {
            this.$refs.itemContainer.select( selected )
        },
        updateSliderPosition ( index) {
            if (this.slide != index) {
                this.slide = index
            }

        }
    }
}
</script>

<style scoped>
.itemContainer div {
    height: 500px;
    width: 80vw;
}
.itemContainer {
    overflow: scroll;
    height: 80vh;
    max-height: 300px;
    width: 100vw;
    padding-top: 50px;
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

/* hide progress bar on slider */
{

}


template {
    height: 100%;
}
</style>
