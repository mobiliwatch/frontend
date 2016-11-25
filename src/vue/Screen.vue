<script>
var toggleButton = require('./ToggleButton.vue');
var Group = require('./widgets/Group.vue');

module.exports = {
  components: {
    'toggle-button': toggleButton,
    'Group' : Group,
  },
  data: function() {
    return {
      cssSelector: 'light',
      slug : '',
      screen : null,
      error : null,
      ws : null,
    }
  },
  mounted : function(){
    this.load_screen(this.$route.params.slug);
  },
  methods : {
    // Load a screen data and strore them
    load_screen : function(slug){
      // TODO: use global urls
      var api_url = API_URL + '/screen/' + slug + '/'; 
      var ws_url = WS_URL + '/screen/' + slug + '/'; 
      var options = {
        credentials : true,
      };
      this.$http.get(api_url, options).then(function(resp){
        this.$set(this, 'screen', resp.body);

        // Add widgets to stores
        var store = this.$store;
        this.screen.widgets.forEach(function(w){
          store.commit('add_widget', w);
        });

        // Setup Websocket
        var that = this;
        var ws = new WebSocket(ws_url);
        ws.onopen = function() {
          that.$set(that, 'ws', ws);
          that.ws.onmessage = that.ws_received;
        }

      }).catch(function(err){
        console.log('Failed to load screen', err);
        this.$set(this, 'error', err); 
      });
    },

    // Webscoket Message reception
    ws_received : function(msg){

      // Load msg as json
      var payload = JSON.parse(msg.data);
      if(payload.widget && payload.update)
        this.$store.commit('add_update', payload);

      else
        console.warn('Unsupported Websocket message', msg);
    },
  },
  computed: {
    pannelClass: function () {
      return this.cssSelector == 'dark' ? [ 'dark-pannel' ] : [ 'light-pannel' ]
    },
    screenHeight : function(){
      // Calc the remaining height for the tiles
      var height = window.innerHeight;
      var navHeight = 60; // hackish
      return (height - navHeight) + 'px';
    },
  }
};
</script>

<template>
  <div id="wrapper" class="fullscreen" v-bind:class="{ dark: cssSelector == 'dark' }">

    <nav class="nav">
      <div class="nav-left">
        <div class="nav-item">
          <p class="title" v-if="screen">{{ screen.name }}</p>
          <p class="heading">Mobili.Watch</p>
        </div>
      </div>
      <div class="nav-right">
        <div class="nav-item">
          <router-link class="button" to="/">Home</router-link>
        </div>
        <div class="nav-item">
          <toggle-button
            option1="dark"
            option2="light"
            v-model="cssSelector">
          </toggle-button>
        </div>
      </div>
    </nav>

    <div class="notification is-info" v-if="!error && !screen">
      <p v-if="slug">Chargement...</p>
      <p v-if="!slug">Veuillez sélectionner un écran...</p>
    </div>
    <div class="notification is-danger" v-if="error">
      <h4>Erreur !</h4>
      {{ error }}
    </div>

    <div v-if="screen" class="tile is-ancestor" :style="{height: screenHeight}">
      <Group :group="group" v-for="group in screen.groups" />
    </div>
  </div>
</template>

<style>
.nav {
  background: inherit !important;
}

div.tile.is-ancestor {
  padding-left: 10px;
  padding-right: 10px;
}
</style>
