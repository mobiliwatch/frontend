var Vue = require('vue');
var Vuex = require('vuex');
var _ = require('lodash');

module.exports = new Vuex.Store({
  state: {
    updates : [],
    widgets : {},
    debug : false,
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
      var new_widget;
      if (widget.type == 'LocationWidget') {
        // LocationWidget case: partial data update
        new_widget = _.clone(widget);
        new_widget.location = payload.update.location;
      } else {
        // Common case: full data update
        new_widget = _.merge(widget, payload.update);
      }

      // Add meta data
      new_widget['updated'] = {
          server : payload.time * 1000,
          local : new Date().getTime(),
      };
      new_widget['revision'] = widget['revision'] + 1;

			widgets[widget_id] = new_widget;

      // Update widgets in state
      Vue.set(state, 'widgets', widgets);
      console.debug('Updated widget', widget_id, payload.update);
    },
    add_widget : function(state, widget){
      // Store an initial widget declaration in store
      widget['revision'] = 0;
      state.widgets[widget.id] = widget;
    },
    toggle_debug : function(state){
      state.debug = !state.debug;
    },
  }
})
