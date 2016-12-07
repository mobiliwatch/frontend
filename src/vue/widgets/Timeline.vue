<script>
var Timepoint = require('./Timepoint.vue');

//
// Timeline
//
// Usage:
//

module.exports = {
  components: {
    'Timepoint': Timepoint,
  },
  props: {
    'tline': Object,
  },
  data: function () {
    return {
      timelineWidth: 0,
      points:        [],
    }
  },
  computed: {
    'timeRatio': function() {
      // 14 is the Timepoint width
      return (this.timelineWidth - 14) / this.tline.duration;
    },
  },
  mounted: function() {
    this.timelineWidth = this.$el.offsetWidth;
    setInterval(this.updatePoints, 1000);
  },
  methods: {
    updatePoints: function () {
      var currentTime = new Date().getTime();
      var points = [];
      for (i = 0; i < this.tline.points.length; i++) {
        var tpoint = this.tline.points[i];
        var delay = tpoint.time - currentTime;
        if (delay <= this.tline.duration) {
          var position = Math.floor(Math.max(delay, 0) * this.timeRatio);
          var point = {
            reference: tpoint.reference,
            delay:     delay,
            position:  position,
            html:      tpoint.html,
            class:     {}
          };
          if (this.tline.cb_point) {
            this.tline.cb_point(point, delay);
          }
          points.push(point);
        }
      }
      if (this.tline.cb_points) {
        this.tline.cb_points(points);
      }
      this.$set(this, 'points', points);
    },
  },
}
</script>

<template>
  <div class="timeline" :style="this.tline.style">
    <div class="timefinishing" v-html="tline.finishing">
    </div>
    <Timepoint v-for="point in points" :point="point" :key="point.reference" />
  </div>
</template>

<style>

  .timeline {
    position: relative;
    display: inline-block;
    width: 80%;
    height: 10px;
    margin: 60px 10px;
    background: #aaa;
    border-radius: 10px;
  }

</style>
