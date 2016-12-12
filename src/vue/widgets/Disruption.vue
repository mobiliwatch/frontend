<template>
  <div class="disruptions">
    <h1>Perturbations</h1>

    <div v-if="widget.disruptions">
      <div v-for="d in widget.disruptions">
        <h5>{{ d.name }}</h5>
        <span class="tag">{{ d.type.Name }}</span>
        <div v-html="d.description"></div>

        <hr />
      </div>
    </div>
    <div v-else>
      Pas de perturbations sur vos lignes !
    </div>


  </div>
</template>

<script>
var mixins = require('./mixins.js');

module.exports = {
  mixins : [mixins, ],
};
</script>
