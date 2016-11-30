<template>
  <div class="location">
    <p>server time: {{ widget.updated ? new Date(widget.updated.server).toString() : '' }} {{ widget.updated ? widget.updated.server : '' }}</p>
    <p>local time:  {{ widget.updated ? new Date(widget.updated.local).toString()  : '' }} {{ widget.updated ? widget.updated.local  : '' }}</p>
    <div v-for="line_stop in widget.location.line_stops" v-if="widget.revision > 0">
      {{ line_stop.line.mode }} {{ line_stop.line.name }} direction {{ line_stop.direction.name }}
      <Timeline :times="line_stop.times" :widgetId="widgetId" />
    </div>
  </div>
</template>

<script>
var mixins = require('./mixins.js');
var Timeline = require('./Timeline.vue')

module.exports = {
  mixins : [mixins, ],
  components : {
    'Timeline': Timeline
  },
  data : function(){
    return {
    };
  },
}
</script>
