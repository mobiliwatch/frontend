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
      points: [],
    }
  },
  mounted: function() {
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
          var translation = (1.0 - Math.max(delay, 0) / this.tline.duration) * 100.0;
          var point = {
            reference:   tpoint.reference,
            delay:       delay,
            translation: translation,
            html:        tpoint.html,
            class:       {}
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
<div>
  <div class="timeline-padding">
    <div class="timeline" :style="this.tline.style">
      <div class="timeline-reducer">
        <Timepoint v-for="point in points" :point="point" :key="point.reference" />
      </div>
      <div class="timefinishing" v-html="tline.finishing">
      </div>
    </div>
  </div>
</div>
</template>

<style>

  .timeline-padding {
    position: relative;
    width: 100%;
    height: 110px;
    box-sizing: border-box;
    border-top: 50px solid rgba(0,0,0,0);
    border-bottom: 50px solid rgba(0,0,0,0);
    border-left: 50px solid rgba(0,0,0,0);
    border-right: 50px solid rgba(0,0,0,0);
  }

  .timeline {
    position: absolute;
    width: 100%;
    height: 10px;
    background-color: #aaa;
    border-radius: 10px;
  }

  .timeline-reducer {
    position: absolute;
    width: 100%;
    height: 10px;
    box-sizing: border-box;
    border-right: 10px solid rgba(0,0,0,0);
  }

</style>
