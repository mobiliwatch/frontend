<script>

//
// Timepoint
//
// Usage:
//

module.exports = {
  props: {
    'point':         Object,
  },
  data: function () {
    return {
    }
  },
}
</script>

<template>
  <div class="timepoint" :class="this.point.class" :style="{ right: point.position + 'px' }">
    <div class="timesign" v-html="this.point.html">
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

</style>
