<template>
  <div class="weather">
    Weather is : {{ widget.weather }}
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
