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
    'line_stop':    Object,
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
//      finishing: '<span style="font-size: 3em;" class="fa fa-flag-checkered"></span>',
        finishing: this.line_stop.stop.name,
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
          for (var i = 0; i < points.length; i++) {
            var point = points[i];
            if (point.delay > limit_time) {
              point.class.timesignTarget = true;
              var delay = Math.max(0, point.delay - walking_time);
              that.$set(that, 'delay', delay);
              break;
            }
            point.class.timesignTarget = false;
          }
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
            colorBetween = 'red',
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
  <div class="transportline">
    <div class="linecontainer">
      <div class="linetitle"
        :style="{
          color:           '#' + line_stop.line.color_front,
          backgroundColor: '#' + line_stop.line.color_back }">
        {{ line_stop.line.mode }} {{ line_stop.line.name }}
      </div>
      <div class="timeleft">
        <template v-if="delay > 0">
          <div class="leavemsg">partez dans</div>
          <div class="leavedelay" v-html="htmlDelay"></div>
        </template>
        <template v-if="delay == 0">
          <div class="leavemsg">partez</div>
          <div class="leavedelay now">maintenant</div>
        </template>
        <template v-if="typeof delay == 'undefined'">
          <div class="leavemsg"> </div>
          <div class="leavedelay"> </div>
        </template>
      </div>
      <div class="linedirection">
        direction {{ line_stop.direction.name }}
      </div>
    </div>
    <Timeline :tline="tline" />
  </div>
</template>

<style>

.linecontainer {
}

.linetitle {
  text-align: center;
  font-size: 3em;
  width: 180px;
  float: left;
  color: black;
  background-color: #FCCD51; /* Transisere default color */
  border-radius: 5px;
}

.timeleft {
  float: right;
  width: 300px;
  text-align: center;
  color: black;
  background-color: #00d1b2;
  border-radius: 5px;
}

.leavemsg {
  font-size: 1.5em;
  line-height: 120%;
}

.leavedelay {
  font-size: 4em;
}

@keyframes now {
  from { color: white; }
  to   { color: #00d1b2; }
}

.leavedelay.now {
  animation-name: now;
  animation-duration: 0.5s;
  animation-direction: alternate;
  animation-timing-function: ease-in;
  animation-iteration-count: infinite;
}

.linedirection {
  font-size: 2em;
  margin-left:  180px;
  margin-right: 300px;
  padding: 0px 10px;
}

.timefinishing {
  position: absolute;
  font-size: 2em;
  text-align: left;
  right: -100px;
  bottom: 20px;
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
  color: red;
  background-color: red !important;
}

.timesignMissed {
  opacity: 0.3;
}

</style>
