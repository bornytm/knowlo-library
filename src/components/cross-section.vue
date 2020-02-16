<template>
  <div>
    <flick 
        class='itemContainer' 
        ref='itemContainer' 
        key="itemContainer" 
        :options="itemContainer" 
        v-on:change='updateSliderPosition'
        >
           
          <slot />
        
    </flick> 

    <q-slider id='slider' class='cs-slider' v-model="slide" :min="0" :max="items.length - 1" @input="selectItem" />
  </div>
    
</template>

<script>
import flick from 'components/flick'

export default {
    name: 'cross-section',
    components: {flick},
    props: ['items','selected'],
    watch: {
        selected: function (x) {
            this.selectItem(this.selected)
        },
        items: function (x) {
            this.$refs.itemContainer.destroy()
            this.$nextTick(() => {
                
                this.$refs.itemContainer.init()

                // allow items to be vertically scrollable. Hacky due to inability to pass styles to scoped components.
                let set = document.getElementsByClassName('flickity-slider')[0].children
                for(let el = 0; el < set.length; el++) {
                    // set[el].classList.add('cell') // the class gets added, but attributes not applied if <style> is scoped
                    set[el].style.overflowY = 'scroll'
                    set[el].style.height = '100%'
                    set[el].style.touchAction = 'pan-y'                     
                }

                // start in the middle...maybe this should be configurable?
                this.selectItem(x.length/2)
                this.updateSliderPosition(x.length/2)
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

<style>

.itemContainer {
    height: 100%;
    width: 100%;
}


/* applied directly on items watch */
/* 
.cell {
    overflow-y:scroll;
    touch-action: pan-y;
    height: 100%;
} */

/* fade in image when loaded */
/* 
.carousel-cell-image {
  transition: opacity 0.4s;
  opacity: 0;
  
}

.carousel-cell-image.flickity-lazyloaded,
.carousel-cell-image.flickity-lazyerror {
  opacity: 1;
} */

#slider {
    width: 80%;
    margin: 0 auto;
    bottom: 40px;
    background-color: #ffffff82;
    /* opacity: 20%; */
    border-radius: 20px;
    /* padding-left: 20px; */
    /* padding-right: 20px; */
}
/* hide progress bar on slider  */
.cs-slider .q-slider__track {
    width: 0!important;
}

template {
    height: 100%;
}
</style>
