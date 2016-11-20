var Vuex = require('vuex');
var _ = require('lodash/core');

module.exports = new Vuex.Store({
  state: {
    updates : [],
    widgets : {},
  },
  mutations: {
    add_update : function(state, payload){

      // Check input
      var widget = state.widgets[payload.widget];
      if(!widget){
        console.warn('No widget found for update', payload);
        return;
      }
      if(!payload.update){
        console.warn('Received empty update data', payload);
        return;
      }

      // Apply changes from payload's update
      widget = _.assignIn(widget, payload.update)
      console.debug('Updated widget', widget.id);
    },
    add_widget : function(state, widget){
      // Store an initial widget declaration in store
      state.widgets[widget.id] = widget;
    },
  }
})

