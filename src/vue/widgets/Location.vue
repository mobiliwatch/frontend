<template>
  <div class="location">

    <div v-for="line_stop in location.line_stops">
      {{ line_stop.line.mode }} {{ line_stop.line.name }} direction {{ line_stop.direction.name }}
    </div>

  </div>
</template>

script>
module.exports = {
  props : {
    location : Object,
  },
  data : function(){
    return {
    };
  }
}
</script>
