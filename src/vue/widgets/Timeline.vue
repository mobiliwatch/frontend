<script>
var mixins = require('./mixins.js');
var Timepoint = require('./Timepoint.vue');

//
// Timeline
//
// Usage:
//

module.exports = {
  mixins : [mixins, ],
  components: {
    'Timepoint': Timepoint,
  },
  props: {
    'times': Array,
  },
  data: function () {
    return {
    }
  },
  computed: {
  },
  methods: {
  }
}
</script>

<template>
  <div>
    <p>
      {{ times.length }} times:
      <span v-for="t in times">
        {{ t.reference }}
      </span>
    </p>
    <ul v-if="times.length > 0">
      <li v-for="t in times"> <!-- :key="t.reference" -->
        <Timepoint :time="t.time * 1000" :reference="t.reference" :widgetId="widgetId" />
      </li>
    </ul>
    <p v-else>
      Pas d'horaires.
    </p>
  </div>
</template>

/*
<div class="timeline">
  <div class="timefinishing">
    F
  </div>
  <timepoint v-for="tp in timepoints" :hour="tp.hour" :position="tp.position">
  </timepoint>
</div>
*/

<style>

  .timeline {
    position: relative;
    display: inline-block;
    width: 100%;
    height: 10px;
    margin: 50px 10px;
    background-color: #2196F3;
    border-radius: 10px;
  }

  .timefinishing {
    position: absolute;
    right: -10px;
    bottom: 10px;
  }

</style>
