<script>
var mixins = require('./mixins.js');
var Timeline = require('./Timeline.vue')
// icons from http://www.flaticon.com/packs/vehicles : free license with attribution
require("./fonts/bus.svg");
require("./fonts/car.svg");
require("./fonts/train.svg");
require("./fonts/tram.svg");
require("./fonts/stop.svg");

module.exports = {
  mixins : [mixins, ],
  components : {
    'Timeline': Timeline
  },
  props: {
    'height' : Number,
    'line_stop': Object,
  },
  data : function(){
    return {
      delay: undefined,
    };
  },
  computed: {
    htmlDelay: function() {
      if (this.delay) {
        const separator = '<span style="font-size:0.5em; position: relative; bottom:0.25em;"> min </span>';
        var sec = Math.floor(this.delay / 1000) % 60;
        sec = (sec < 10) ? '0' + sec : '' + sec;
        var min = Math.floor(this.delay / 60000);
        return min + separator + sec;
      }
      return '?';
    },
    offset : function() {
      return this.widget.updated.local - this.widget.updated.server;
    },
    tline: function() {
      var times = this.line_stop.times;
      var mode = this.line_stop.line.mode;
      var walking_time = this.line_stop.stop.walking_time * 1000;
      var limit_time = walking_time / 1.5;
      var duration = 30 * 60 * 1000;
      var that = this;
      var tl = {
        duration:  duration,
//      finishing: '<img src="./fonts/stop.svg" heigth="32" width="32"/>',
        finishing: '<span style="font-size: 3em;" class="fa fa-flag-checkered"></span>',
        style: this.styleGradient(limit_time, walking_time, duration),
        cb_point:  function(point, delay) {
          if (delay < limit_time) {
            point.class.timesignMissed = true;
            point.class.timesignWarning = false;
          } else if (delay < walking_time) {
            point.class.timesignWarning = true;
          }
        },
        cb_points: function(points) {
          var delay = undefined;
          for (var i = 0; i < points.length; i++) {
            var point = points[i];
            if (point.delay > limit_time) {
              point.class.timesignTarget = true;
              delay = Math.max(0, point.delay - walking_time);
              break;
            }
            point.class.timesignTarget = false;
          }
          that.$set(that, 'delay', delay);
        },
        points:    [],
      };
      for (var i = 0; i < times.length; i++) {
        var time = times[i].time * 1000;
        var point = {
          reference: times[i].reference,
          time:      time + this.offset,
          html:      this.formatPoint(time, mode),
        };
        tl.points.push(point);
      }
      return tl;
    }
  },
  methods: {
    formatTime: function(timestamp) {
      var date = new Date(timestamp);
      return date.getHours() + ':' + ('0' + date.getMinutes()).substr(date.getMinutes() > 9);
    },
    formatPoint: function(timestamp, mode) {
      return '<img src="./fonts/' + mode + '.svg" height="60" width="60" />' + this.formatTime(timestamp);
    },
    styleGradient: function(t1, t2, ref) {
      const colorBefore = '#ddd',
            colorBetween = '#ff3860', /* Bulma's $red*/
            colorAfter = '#aaa';
      var halftrans = 0.005;
      return 'background: linear-gradient(to left, ' + colorBefore + ', '
        + colorBefore  + ' ' + (t1 / ref - halftrans) * 100 + '%, '
        + colorBetween + ' ' + (t1 / ref + halftrans) * 100 + '%, '
        + colorBetween + ' ' + (t2 / ref - halftrans) * 100 + '%, '
        + colorAfter   + ' ' + (t2 / ref + halftrans) * 100 + '%);';
    },
  },
}
</script>

<template>
  <div :style="{height : height + 'px'}">
    <div class="columns">
      <div class="column is-2 notification has-text-centered font-300"
          :style="{
            color:           '#' + line_stop.line.color_front,
            backgroundColor: '#' + line_stop.line.color_back }">
        {{ line_stop.line.mode }} {{ line_stop.line.name }}
      </div>
      <div class="column is-7 font-150">
        station   <span class="bold">{{ line_stop.stop.name }}</span><br>
        direction <span class="bold">{{ line_stop.direction.name }}</span>
      </div>
      <div class="column is-3 notification has-text-centered theme-bgcolor-1">
        <template v-if="delay > 0">
          <span class="font-150">partez dans</span><br>
          <span class="font-300" v-html="htmlDelay"></span>
        </template>
        <template v-if="delay == 0">
          <span class="font-150">partez</span><br>
          <span class="font-300 now">maintenant</span>
        </template>
        <template v-if="typeof delay == 'undefined'">
          <span class="font-200">aucun</span><br>
          <span class="font-200">passage</span>
        </template>
      </div>
    </div>
    <div class="columns">
      <div class="column is-fullwidth">
        <Timeline :tline="tline" />
      </div>
    </div>
  </div>
</template>

<style>

.theme-bgcolor-1 {
  background-color: #00d1b2; /* Bulma's $turquoise */
}

.font-300 {
  font-size: 3em;
}

.font-250 {
  font-size: 2.5em;
}

.font-200 {
  font-size: 2em;
}

.font-150 {
  font-size: 1.5em;
}

.bold {
  font-weight: bold;
}

@keyframes now {
  from { color: white; }
  to   { color: #00d1b2; }
}

.now {
  animation-name: now;
  animation-duration: 0.5s;
  animation-direction: alternate;
  animation-timing-function: ease-in;
  animation-iteration-count: infinite;
}

.timefinishing {
  position: absolute;
  font-size: 1em;
  color: #23d160; /* Bulma's $green */
  right: -40px;
  bottom: 10px;
}

.timesign {
  position: absolute;
  font-size: 2em;
  text-align: center;
  line-height: 150%;
  right: -30px;
  bottom: -46px;
}

.timesignTarget {
  background-color: black !important;
}

.timesignWarning {
  color:            #ff3860;            /* Bulma's $red*/
  background-color: #ff3860 !important; /* Bulma's $red*/
}

.timesignMissed {
  opacity: 0.3;
}

</style>
