<template>
  <div class="time">
    Time is {{ date }}
  </div>
</template>

<script>
var mixins = require('./mixins.js');

module.exports = {
  mixins : [mixins, ],
  data : function(){
    return {
      date : new Date(),
    };
  },
  mounted : function(){
    // Refresh clock every seconds
    setInterval(this.updateDateTime, 1000);
  },
  methods: {
    updateDateTime : function(){
      this.$set(this, 'date', new Date());
    }
  },
};
</script>
