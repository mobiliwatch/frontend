<template>
  <div class="tile" :class="groupClass(group.vertical, sibling)">

    <Group :group="g" :sibling="getSibling(group.groups)" v-for="g in group.groups" />

    <div class="tile" :class="groupClass(false, group.widgets.length)" v-for="w in group.widgets">
      <Widget :widgetId="w" />
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
    sibling: Number,
  },
  methods: {
    getSibling: function (groups) {
      if (this.group.vertical)
        return 0;
      return groups.length;
    },
    groupClass: function (vertical, sibling) {
      const gridClass = { 2: 'is-6', 3: 'is-4', 4: 'is-3' };
      var cl = {};
      if (vertical) {
        cl['is-vertical'] = true;
      }
      if (gridClass[sibling]) {
        cl[gridClass[sibling]] = true;
      }
      return cl;
    },
  },
}
</script>
