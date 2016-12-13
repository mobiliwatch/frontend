var Vue = require('vue');
var Vuex = require('vuex');
var _ = require('lodash');

module.exports = new Vuex.Store({
  state: {
    screen : null,
    widgets : {},
    debug : false,
  },
  mutations: {
    update_widget : function(state, payload){

      // Check input
			var widget_id = payload.widget;
      if(!payload.update){
        console.warn('Received empty update data', payload);
        return;
      }
      var widget = state.widgets[widget_id];
      if(!widget){
        if(payload.update.type){
          widget = payload.update; // new one
        }else{
          console.warn('Widget not found', widget_id);
          return;
        }
      }

			// Shallow Clone widgets
			// Deep is not necessary here
			// This triggers global updates in components
			var widgets = _.clone(state.widgets);

      // Merge items from payload update
      var new_widget;
      if (widget.type == 'LocationWidget') {
        // LocationWidget case: detailed merge
        new_widget = _.clone(widget);
        new_widget.location = payload.update.location;
      } else {
        // Common case: basic merge
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
    update_screen : function(state, payload){
      // Update directly the screen structure
      var new_screen = payload.update;
      if(!new_screen){
        console.warn('No screen found in update');
        return;
      }
      Vue.set(state, 'screen', new_screen);
      console.info('Updated screen structure !');
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
