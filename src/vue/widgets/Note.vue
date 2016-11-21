<template>
  <div class="note">
    {{ widget.text }}
  </div>
</template>

<script>
var mixins = require('./mixins.js');

module.exports = {
  mixins : [mixins, ],
  data : function(){
    return {};
  },
};
</script>
