// Vue
var Vue = require('vue/dist/vue.js');
var Vuex = require('vuex');
var MobiliWatch = require('vue/MobiliWatch.vue');
Vue.use(require('vue-resource'));
Vue.use(Vuex);

// Css
//require('bootstrap/dist/css/bootstrap.css');
require('bulma/css/bulma.css');
require('css/app.css');

const store = new Vuex.Store({
  state: {
    updates : [],
    widgets : {},
  },
  mutations: {
    add_update : function(state, update){

      // Fetch widget
      var widget = state.widgets[update.widget];
      if(!widget){
        console.warn('Invalid update', update);
        return;
      }

      // Apply change
      // TODO: real logic
      widget.text = update.text;
    },
    add_widget : function(state, widget){
      console.log('Add widget', widget.id);
      state.widgets[widget.id] = widget;
    },
  }
})

// Run our main app
new Vue({
  store, // use store everywhere
  el : '#app',
  components : {
    'MobiliWatch' : MobiliWatch,
  },
  data : {
    'ws' : null,
  },

  mounted : function(){
    var that = this;

    // Setup websocket
    var ws = new WebSocket(WS_URL);
    ws.onopen = function() {
      that.$set(that, 'ws', ws);
      that.ws.onmessage = that.received;
    }
  },

  methods : {

    // Message reception
    received : function(msg){
      console.log('WS message chat', msg);

      // Send in store
      this.$store.commit('add_update', {
        widget : '3aa3b6eb-9b4a-4a46-b4a6-814def7ad23a',
        text : msg.data,
      });
    },
  }
});
