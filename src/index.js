// Vue
var Vue = require('vue/dist/vue.js');
Vue.use(require('vue-resource'));
var MobiliWatch = require('vue/MobiliWatch.vue');

// Css
//require('bootstrap/dist/css/bootstrap.css');
require('bulma/css/bulma.css');
require('css/app.css');

// Run our main app
new Vue({
  el : '#app',
  components : {
    'MobiliWatch' : MobiliWatch,
  },
});
