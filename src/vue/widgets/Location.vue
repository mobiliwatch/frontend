<template>
  <div class="location">
    <div v-for="line_stop in widget.location.line_stops" v-if="widget.revision > 0" :key="line_stop.id">
      <Transportline :line_stop="line_stop" :widgetId="widgetId" />
    </div>
  </div>
</template>

<script>
var mixins = require('./mixins.js');
var Transportline = require('./Transportline.vue')

module.exports = {
  mixins : [mixins, ],
  components : {
    'Transportline': Transportline
  },
  data : function(){
    return {
    };
  },
}
</script>
