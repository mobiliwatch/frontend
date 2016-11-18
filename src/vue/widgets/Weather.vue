<template>
  <div class="location">
    Weather is : {{ weather }}
  </div>
</template>

<script>
module.exports = {
  props : {
    weather : String,
  },
  data : function(){
    return {};
  }
}
</script>
