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
			var widget_id = payload.widget;
      var widget = state.widgets[widget_id];
      if(!widget){
        console.warn('No widget found for update', payload);
        return;
      }
      if(!payload.update){
        console.warn('Received empty update data', payload);
        return;
      }

			// Shallow Clone widgets
			// Deep is not necessary here
			// This triggers global updates in components
			var widgets = _.clone(state.widgets);

      // Merge items from payload update
      var new_widget = _.merge(widget, payload.update);

      // Add meta data
      new_widget['updated'] = new Date();
      new_widget['revision'] = widget['revision'] + 1;

			widgets[widget_id] = new_widget;

      // Update widgets in state
      Vue.set(state, 'widgets', widgets);
      console.debug('Updated widget', widget_id, payload.update);
    },
    add_widget : function(state, widget){
      // Store an initial widget declaration in store
      state.widgets[widget.id] = widget;
    },
  }
})

