<script>
var mixins = require('./mixins.js');
var Timepoint = require('./Timepoint.vue');
require("./fonts/stop.svg");

//
// Timeline
//
// Usage:
//

module.exports = {
  mixins : [mixins, ],
  components: {
    'Timepoint': Timepoint,
  },
  props: {
    'times':      Array,
    'timeLength': Number,
    'mode':       String,
  },
  data: function () {
    return {
      timeRatio: 0,
    }
  },
  mounted: function() {
    // 14 is the Timepoint width
    this.timeRatio = (this.$el.offsetWidth - 14)/ this.timeLength;
  },
  computed: {
  },
  methods: {
  }
}
</script>

<template>
  <div class="timeline">
    <div class="timefinishing">
      <img src="./fonts/stop.svg" heigth="32" width="32"/>
    </div>
    <Timepoint v-for="t in times" :time="t.time * 1000" :timeLength="timeLength" :timeRatio="timeRatio" :mode="mode" :key="t.reference" :widgetId="widgetId" />
  </div>
</template>

<style>

  .timeline {
    position: relative;
    display: inline-block;
    width: 95%;
    height: 10px;
    margin: 50px 10px 10px 10px;
    background-color: #2196F3;
    border-radius: 10px;
  }

  .timefinishing {
    position: absolute;
    right: -10px;
    bottom: 10px;
  }

</style>
