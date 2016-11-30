// Vue
var Vue = require('vue/dist/vue.js');
var Vuex = require('vuex');
var VueRouter = require('vue-router');
Vue.use(require('vue-resource'));
Vue.use(Vuex);
Vue.use(VueRouter);

// Components
var Home = require('vue/Home.vue');
var Screen = require('vue/Screen.vue');

// Css
require('weather-icons/css/weather-icons.css');
require('font-awesome/css/font-awesome.css');
require('bulma/css/bulma.css');
require('css/app.css');

// Setup store
const store = require('./store.js');

// Setup routing
const routes = [
  { name: 'home', path: '/', component: Home},
  { name: 'screen', path: '/screen/:slug', component: Screen},
  { name: 'share', path: '/share/:slug/:token', component: Screen},
];

// Run our main app
new Vue({
  store : store, // use store everywhere
  router : new VueRouter({
    routes : routes
  }),
  el : '#app',
});
