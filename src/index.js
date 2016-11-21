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

const store = require('./store.js');

// Run our main app
new Vue({
  store : store, // use store everywhere
  el : '#app',
  components : {
    'MobiliWatch' : MobiliWatch,
  },
});
