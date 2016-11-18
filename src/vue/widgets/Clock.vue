<template>
  <div class="location">
    Time is {{ date }}
  </div>
</template>

<script>
module.exports = {
  props : {
  },
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
}
</script>
