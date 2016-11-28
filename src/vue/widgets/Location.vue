<template>
  <div class="location">
    <div v-for="line_stop in widget.location.line_stops" v-if="widget.revision > 0">
      {{ line_stop.line.mode }} {{ line_stop.line.name }} direction {{ line_stop.direction.name }}
      <ul v-if="line_stop.times.length > 0">
        <li v-for="t in line_stop.times" >
          {{ t }}
        <li>
      </ul>
      <p v-if="!line_stop.times.length">
        Pas d'horaires.
      </p>
    </div>
  </div>
</template>

<script>
var mixins = require('./mixins.js');

module.exports = {
  mixins : [mixins, ],
  data : function(){
    return {
    };
  },
}
</script>
