<script>

//
// Timepoint
//
// Usage:
//

module.exports = {
  props: {
    'point': Object,
  },
  data: function () {
    return {
    }
  },
}
</script>

<template>
  <div class="timepoint-shifter" :style="'transform: translateX(' + point.translation + '%);'">
    <div class="timepoint" :class="this.point.class">
      <div class="timesign" v-html="this.point.html">
      </div>
    </div>
  </div>
</template>

<style>

  .timepoint-shifter {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 10px;
  }

  .timepoint {
    position: absolute;
    height: 14px;
    width: 14px;
    bottom: -2px;
    left: -2px;
    border-radius: 14px;
    border-style: solid;
    border-width: 2px;
    border-color: black;
    background-color: white;
  }

</style>
