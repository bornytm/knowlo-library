<template>
  <div >
    <div class="row container">
				<!-- <span class="col items-start viewBtn" :class="{'fade': !showViewed}" ><i class="material-icons ">remove_red_eye</i>
          <q-tooltip :disable="!this.$q.cookies.get('showToolTips')" :delay="500" :offset="[0, 5]">show / hide viewed resources</q-tooltip>
        </span> -->

        <!-- display options select -->
        <span class="">
          <q-btn class="viewBtn"  flat round @click.stop.prevent="display = 'list'"><i class="material-icons">view_list</i>
           <q-tooltip :disable="!this.$q.cookies.get('showToolTips')" :delay="500" :offset="[0, 5]">List view</q-tooltip>
          </q-btn>
          <q-btn class="viewBtn" flat round  @click.stop.prevent="display = 'card'"><i class="material-icons">dashboard</i>
           <q-tooltip :disable="!this.$q.cookies.get('showToolTips')" :delay="500" :offset="[0, 5]">Grid view</q-tooltip>
          </q-btn>
          <q-btn class="viewBtn" flat round  ><i class="material-icons">photo_size_select_large</i>
            <q-tooltip :disable="!this.$q.cookies.get('showToolTips')" :delay="500" :offset="[0, 5]">Change Size</q-tooltip>
            <q-popup-edit class="sizeSlider" v-model="test" >
              <q-slider class='slider' v-model="perRow" :min="1" :max="20" :step="1" />
            </q-popup-edit>
          </q-btn>
        </span>

        <!-- order by -->
        <span class='col self-end order'>
          <span class="right orderby">
            <q-btn-dropdown auto-close color="primary" flat dropdown-icon="none">
              <template v-slot:label>
                  {{orderBy}}
                  <q-tooltip :disable="!$q.cookies.get('showToolTips')" :delay="500" :offset="[0, 5]">order by</q-tooltip>
              </template> 
              <q-list>
                <q-item clickable @click="orderBy = 'quality'">
                  <q-item-section >quality</q-item-section>
                </q-item>
                <q-item clickable @click="orderBy = 'complexity'">
                  <q-item-section >complexity</q-item-section>
                </q-item>
                <q-item clickable @click="orderBy = 'added'">
                  <q-item-section >date added</q-item-section>
                </q-item>
                <q-item clickable @click="orderBy = 'votes'">
                  <q-item-section ># of votes</q-item-section>
                </q-item>
                <q-item clickable @click="orderBy = 'views'">
                  <q-item-section ># of views</q-item-section>
                </q-item>
                <q-item disable @click="orderBy = 'activity'">
                  <q-item-section ># of responses</q-item-section>
                </q-item>
                <q-item disable @click="orderBy = 'time'">
                  <q-item-section >time to view</q-item-section>
                </q-item>
              </q-list>         
            </q-btn-dropdown>
              <i @click="descending = !descending; test()" class="material-icons ascDec" :class="{'flipVert': !descending }">
                  sort
                  <q-tooltip :disable="!$q.cookies.get('showToolTips')" :delay="500" :offset="[0, 5]">ascending / descending</q-tooltip>
              </i>
          </span>
        </span>
      </div>
      <!-- <div style="border-bottom:none;">
        <br/>
        <div class="row right quantity">
          <div>Showing {{resources.length}} of {{resourcesRelated}}</div>
          <div v-if='member.uid'><span v-if="showViewed">Including</span><span v-else>Excluding</span> {{resourcesViewed}} viewed</div>
        </div>
      </div> -->
  </div>
</template>

<script>
export default {
  data () {
    return {
      orderBy: "quality",
      showViewed: true,
      display: "card",
      descending: true,
      perRow: 3,
    }
  },
  methods: {
    test () {
      this.$q.notify({
        message: 'Order by ' + this.orderBy + ', ' + (this.descending ? 'high to low' : 'low to high'),
        timeout: 1500,
        position: 'bottom-left',
      })
    }
  }


}
</script>

<style >
.test {
  min-height: 400px;
  display: block;
}
.flipVert {
  transform: scaleY(-1);
}
.ascDec {
  transition: transform .5s;
}

/* is this going to overwrite the style everywhere in the app? It doesn't work when it the CSS is scoped */
.q-btn-dropdown__arrow-container {
  display: none;
}

.sizeSlider {
  /* width: 200px; */
}
.q-popup-edit {
  width: 70%;
}
</style>