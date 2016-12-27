<template>
  <div class="disruptions">
    <h1>Perturbations & informations</h1>

    <div v-for="d in widget.disruptions" class="media">
      <!-- FIXME: multiple calls to disruptionType() function -->
      <div class="media-left">
        <span class="font-250 fa" :class="disruptionType(d).fa" :style="disruptionType(d).color ? { color: disruptionType(d).color } : {}"></span>
      </div>
      <div class="media-content">
        <span class="font-150">{{ d.name }}</span>
      </div>
      <!-- d.description field not used for now -->
    </div>

    <div v-if="widget.disruptions.length == 0" class="media">
      <div class="media-left">
        <span class="font-250 fa fa-check" style="color: #23d160;"></span>
      </div>
      <div class="media-content">
        <span class="font-150">Ni perturbation ni information pour vos lignes</span>
      </div>
    </div>

  </div>
</template>

<script>
var mixins = require('./mixins.js');

module.exports = {
  mixins : [mixins, ],
  methods: {
    /* FIXME: duplicated code with Transportline.vue */
    disruptionType: function (d) {
      const types = {
        Travaux: { priority: 10, fa: 'fa-exclamation-triangle', color: '#ff3860' /* Bulma's $red*/ },
        /* or fa-bullhorn ? */
      };
      const typeDefault = { priority: 0, fa: 'fa-info-circle' };
      var k = d.type.Name;
      if (k in types) {
        return types[k];
      }
      return typeDefault;
    },
  },
};
</script>
