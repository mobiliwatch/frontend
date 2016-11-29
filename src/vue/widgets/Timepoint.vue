<script>
var mixins = require('./mixins.js');

//
// Timepoint
//
// Usage:
//

module.exports = {
  mixins : [mixins, ],
  props: {
    'time':      Number,
    'reference': String,
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
/*    tpStyle: function () {
      return { right: this.position + 'px' }
    }*/
  },
  methods: {
    updateDelay: function () {
      this.$set(this, 'delay', this.localTime - new Date().getTime());
    },
    formatDelay: function (ms) {
      var d = Math.floor(ms / 1000)
      if (d < 60)
        return d + ' sec';
      return Math.floor(d / 60) + ' min ' + (d % 60) + ' sec';
    },
  }
}
</script>

<template>
  <div>
    {{ reference }} {{ new Date(time).toTimeString() }} dans {{ formatDelay(delay) }}
  </div>
</template>
/*
<div class="timepoint" v-bind:style="tpStyle">
  <div class="timesign">
    <p>{{ time }}</p>
    <p>bus</p>
  </div>
</div>
*/
<style>

  .timepoint {
    position: absolute;
    height: 14px;
    width: 14px;
    right: 100px;
    bottom: -2px;
    border-radius: 14px;
    border-style: solid;
    border-width: 2px;
    border-color: black;
    background-color: white;
  }

  .timesign {
    position: absolute;
    right: -20px;
    bottom: 15px;
    border-radius: 2px;
    border-style: solid;
    border-width: 1px;
    border-color: black;
    background-color: #ddd;
  }

</style>
