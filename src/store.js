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


      //var nw = _.cloneDeep(widget);
      var nw = widget;
      nw = _.merge(nw, payload.update);

      // Apply changes from payload's update
      nw['updated'] = new Date();
      nw['revision'] = nw['revision'] + 1;
      //_.merge(widget, payload.update);

      //_.merge(widget, payload.update);
      console.debug('Updated widget', widget.id, payload.update);

state.widgets[payload.widget] = nw;

      //widget = _.clone(widget);

console.log(state);

return state;
    },
    add_widget : function(state, widget){
      // Store an initial widget declaration in store
      state.widgets[widget.id] = widget;
    },
  }
})

