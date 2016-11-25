<template>
  <div class="weather">
    <h2>Météo à {{ widget.city.name }}</h2>
    <span class="icon is-huge">
      <span class="wi wi-night-sleet"></span>
    </span>
    <span class="icon is-huge">
      <span class="wi wi-day-sunny"></span>
    </span>
    <p v-if="widget.code">
      Status: {{ widget.status }}
      <br />
      Code: {{ widget.code }}
      <br />
    </p>
  </div>
</template>

<script>
var mixins = require('./mixins.js');

module.exports = {
  mixins : [mixins, ],
  data : function(){
    return {};
  }
};
</script>

<style lang="sass">
.icon.is-huge {
    display: inline-block;
    font-size: 90px;
    height: 96px;
    line-height: 96px;
    text-align: center;
    vertical-align: top;
    width: 96px;
}
</style>
