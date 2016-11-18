<template>
  <div class="tile" :class="{'is-vertical': group.vertical}">

    <Group :group="g" v-for="g in group.groups" />

    <div class="tile" v-for="w in group.widgets">
      <Widget :widget="w" />
    </div>

  </div>
</template>

<script>
var Widget = require('./Widget.vue');

module.exports = {
  beforeCreate: function () {
    this.$options.components.Group = require('./Group.vue')
  },
  components: {
    'Widget' : Widget,
  },
  props : {
    group: Object,
  }
}
</script>
