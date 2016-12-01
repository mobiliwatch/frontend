<script>
var mixins = require('./mixins.js');
// icons from http://www.flaticon.com/packs/vehicles : free license with attribution
require("./fonts/bus.svg");
require("./fonts/car.svg");
require("./fonts/train.svg");
require("./fonts/tram.svg");

//
// Timepoint
//
// Usage:
//

module.exports = {
  mixins : [mixins, ],
  props: {
    'time':       Number,
    'timeLength': Number,
    'timeRatio':  Number,
    'mode':       String,
  },
  data: function () {
    return {
      delay: undefined,
    }
  },
  mounted: function(){
    setInterval(this.updateDelay, 1000);
  },
  computed: {
    offset : function(){
      return this.widget.updated.local - this.widget.updated.server;
    },
    localTime: function() {
      return this.time + this.offset;
    },
    tpStyle: function () {
      if (this.delay > this.timeLength)
        return { display: 'none' }
      var position = Math.max(this.delay, 0) * this.timeRatio;
      var style = { right: position + 'px' };
      if (this.delay < 5 * 60 * 1000)
        style.color = 'red'
      return style;
    }
  },
  methods: {
    updateDelay: function () {
      this.$set(this, 'delay', this.localTime - new Date().getTime());
    },
    formatTime: function (timestamp) {
      var date = new Date(timestamp);
      return date.getHours() + ':' + ('0' + date.getMinutes()).substr(date.getMinutes() > 9);
    },
  }
}
</script>

<template>
  <div class="timepoint" :style="tpStyle">
    <div class="timesign">
      {{ formatTime(time) }}
      <img :src="'./fonts/' + this.mode + '.svg'" height="40" width="40" />
    </div>
  </div>
</template>

<style>

  .timepoint {
    position: absolute;
    height: 14px;
    width: 14px;
    bottom: -2px;
    border-radius: 14px;
    border-style: solid;
    border-width: 2px;
    border-color: black;
    background-color: white;
  }

  .timesign {
    position: absolute;
    text-align: center;
    line-height: 100%;
    right: -10px;
    bottom: 7px;
  }

</style>
