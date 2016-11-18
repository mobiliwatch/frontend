<template>
  <div class="tile is-parent">
    <article class="tile is-child notification is-info">
      <div class="content">
        <p class="title">{{ widget.type }}</p>
        <p class="subtitle">
          Widget #{{ widget.id }}
        </p>
        <div class="content">
          <!-- Content -->
        </div>
      </div>
    </article>
  </div>
</template>

<script>
module.exports = {
  props : {
    widget : Object,
  },
  data : function(){
    return {};
  },
  mounted : function(){
    console.log('Widget', this.widget);
  },
};
</script>
