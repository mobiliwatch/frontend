var Vue = require('vue');

module.exports = {
  props : {
    widgetId: String,
  },
  computed : {
    // Get widget from store
    widget : function(){
      return this.$store.state.widgets[this.widgetId];
    },
    // Get screen from store
    screen : function(){
      return this.$store.state.screen;
    },
  }
};
