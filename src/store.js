var Vue = require('vue');
var Vuex = require('vuex');
var _ = require('lodash');

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

      // Merge items from payload update
      widget = _.merge(widget, payload.update);

      // Add meta data
      widget['updated'] = new Date();
      widget['revision'] = widget['revision'] + 1;

      // Update widget in state
      Vue.set(state, 'widgets.'+payload.widget, widget);
      console.debug('Updated widget', widget.id, payload.update);
    },
    add_widget : function(state, widget){
      // Store an initial widget declaration in store
      state.widgets[widget.id] = widget;
    },
  }
})

