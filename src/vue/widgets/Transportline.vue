<script>
var _ = require('lodash');
var mixins = require('./mixins.js');
var Timeline = require('./Timeline.vue')
// icons from http://www.flaticon.com/packs/vehicles : free license with attribution
require("./fonts/bus.svg");
require("./fonts/car.svg");
require("./fonts/train.svg");
require("./fonts/tram.svg");
require("./fonts/stop.svg");
require("./fonts/ellipsis.svg");
require("./fonts/ellipsis-dark.svg");

module.exports = {
  mixins : [mixins, ],
  components : {
    'Timeline': Timeline
  },
  props: {
    'height' :   Number,
    'line_stop': Object,
    'divclass':  String,
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
    disruptionTypes: function() {
      var disruptions = this.line_stop.direction.disruptions;
      const types = {
        Travaux: { priority: 10, fa: 'fa-exclamation-triangle', color: '#ff3860' /* Bulma's $red*/ },
        /* or fa-bullhorn ? */
      };
      const typeDefault = { priority: 0, fa: 'fa-info-circle' };
      var foundTypes = _.sortBy(_.uniq(_.map(
        _.keyBy(disruptions,
          /* step 1: group by type.Name */
          function (d) {
            return d.type.Name;
          }),
        /* step 2: convert to types */
        function (v, k) {
          if (k in types) {
            return types[k];
          }
          return typeDefault;
        })
        /* step 3: uniq */
        ),
        /* step 4: sort by (ascending) priority */
        [ function (t) {
            return -t.priority;
          },
        ]);
      return foundTypes;
    },
    tline: function() {
      var times = this.line_stop.times;
      var mode = this.line_stop.line.mode;
      var walking_min_time = this.line_stop.stop.walking_min_time * 1000;
      var walking_max_time = this.line_stop.stop.walking_max_time * 1000;
      var duration = 30 * 60 * 1000;
      var that = this;
      var tl = {
        duration:  duration,
        finishing: '<span style="font-size: 3em;" class="fa fa-flag-checkered"></span>',
        style: this.styleGradient(walking_min_time, walking_max_time, duration),
        cb_point:  function(point, delay) {
          if (delay < walking_min_time) {
            point.class.timesignMissed = true;
            point.class.timesignWarning = false;
          } else if (delay < walking_max_time) {
            point.class.timesignWarning = true;
          }
        },
        cb_points: function(points) {
          var delay = undefined;
          for (var i = 0; i < points.length; i++) {
            var point = points[i];
            if (point.delay > walking_min_time) {
              point.class.timesignTarget = true;
              delay = Math.max(0, point.delay - walking_max_time);
              break;
            }
            point.class.timesignTarget = false;
          }
          if (typeof delay == 'undefined' && times.length) {
            var time = times[points.length].time * 1000;
            points.push({
              reference:   '',
              translation: 5.0,
              html:        that.formatOutOfScopePoint(time),
              class:       {}
            });
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
          html:      this.formatPoint(time),
        };
        tl.points.push(point);
      }
      return tl;
    }
  },
  methods: {
    capitalizeFirstLetter: function (string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    formatDistance: function(distance) {
      if (distance < 1000.0) {
        return distance + ' m';
      }
      var hm = Math.floor(distance / 100.0);
      return Math.floor(hm / 10.0) + ',' + (hm % 10) + ' km';
    },
    formatTime: function(timestamp) {
      var date = new Date(timestamp);
      return date.getHours() + ':' + ('0' + date.getMinutes()).substr(date.getMinutes() > 9);
    },
    formatDate: function(timestamp) {
      var now = new Date().getTime() + this.offset;
      const delay24h = 24 * 60 * 60 * 1000,
            delay1w = delay24h * 7;
      const days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
            months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
      if (timestamp < now + delay24h) {
        // less than 24h delay -> nothing required
        return '';
      }
      var date = new Date(timestamp);
      if (timestamp < now + delay1w) {
        // less than 1 week -> day required
        return days[date.getDay()];
      }
      // at least 1 week -> full date
      return days[date.getDay()] + ' ' + date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();
    },
    formatPoint: function(timestamp) {
      var mode = this.line_stop.line.mode;
      return '<img src="./fonts/' + mode + '.svg" height="60" width="60" />' + this.formatTime(timestamp);
    },
    formatOutOfScopePoint: function(timestamp) {
      var mode = this.line_stop.line.mode;
      return '<div class="out-of-scope"> \
                <img src="./fonts/' + mode + '.svg" height="60" width="60" /> \
                <span style="position: relative; left: 20px; bottom: -36px;"> \
                  <img src="./fonts/ellipsis.svg" height="80" width="80" /> \
                </span> \
                <span style="position: relative; left: -40px; bottom: 24px;">' +
                  this.formatDate(timestamp) +
                '</span><br>' +
                this.formatTime(timestamp) +
              '</div>';
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
    textContent: function(html) {
      var newDiv = document.createElement("div");
      newDiv.innerHTML = html;
      return newDiv.textContent;
    },
  },
}
</script>

<template>

  <div :style="{height : height + 'px'}" :class="'transportline-' + this.divclass">
    <div class="columns is-gapless">
      <div class="column">
        <div class="columns is-gapless">
          <div class="column is-fullwidth vertical-centered" style="height: 40px;">
            <span class="font-200">Station <span class="bold">{{ line_stop.stop.name }}&nbsp;</span></span><span class="font-150">- {{ formatDistance(line_stop.stop.distance) }}</span>
          </div>
        </div>
        <div class="columns font-150">
          <div class="column is-2 notification has-text-centered no-wrap" style="min-width: 120px;"
              :style="{
                color:           '#' + line_stop.line.color_front,
                backgroundColor: '#' + line_stop.line.color_back }">
            {{ capitalizeFirstLetter(line_stop.line.mode) }} <span class="bold">{{ line_stop.line.name }}</span>
          </div>
          <div class="column vertical-centered" style="height: 50px;">
            Direction {{ line_stop.direction.name }}
          </div>
        </div>
      </div>
      <div class="column is-3 notification has-text-centered vertical-centered theme-bgcolor-1" style="min-width: 250px;">
        <template v-if="delay > 0">
          <span class="font-150 cut">partez dans</span>
          <span class="font-300 cut bold" v-html="htmlDelay"></span>
        </template>
        <template v-if="delay == 0">
          <span class="font-150 cut">partez</span>
          <span class="font-300 cut now">maintenant</span>
        </template>
        <template v-if="typeof delay == 'undefined'">
          <span class="font-200 cut">aucun passage</span>
          <span class="font-200 cut">imminent</span>
        </template>
      </div>
    </div>
    <div class="columns">
      <div class="column is-1 has-text-centered vertical-centered">
        <span v-for="d in disruptionTypes" class="font-250 cut fa" :class="d.fa" :style="d.color ? { color: d.color } : {}"></span>
      </div>
      <div class="column is-11">
        <Timeline :tline="tline" />
      </div>
    </div>
  </div>
</template>

<style>

.transportline-large {
}

.transportline-medium {
  font-size: 0.7em;
}

.transportline-small {
  font-size: 0.5em;
}

.theme-bgcolor-1 {
  background-color: #00d1b2; /* Bulma's $turquoise */
}

.theme-bgcolor-2 {
  background-color: #ff3860; /* Bulma's $red*/
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

.no-wrap {
  white-space: nowrap;
}

.vertical-centered {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.vertical-centered .cut {
  flex-basis: 100%;
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
  /* color: #23d160; */ /* Bulma's $green */
  right: -40px;
  bottom: 10px;
}

.timesign {
  position: absolute;
  font-size: 2em;
  text-align: center;
  line-height: 150%;
  width: 70px;
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

.out-of-scope {
  position: absolute;
  width: 100%;
  bottom: 0px;
  left: 0;
  white-space: nowrap;
}

</style>
