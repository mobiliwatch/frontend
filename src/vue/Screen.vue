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
      debug : false,
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

    // Toggle debug mode
    toggle_debug : function(){
      this.$store.commit('toggle_debug');
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
    debug : function(){
      return this.$store.state.debug;
    },
  }
};
</script>

<template>
  <div id="wrapper" class="fullscreen" v-bind:class="cssSelector">

    <nav class="level">
      <div class="level-left">
        <div class="level-item">
          <p class="title" v-if="screen">{{ screen.name }}</p>
          <p class="heading">Mobili.Watch</p>
        </div>
      </div>
      <div class="level-right">
        <div class="level-item">
          <router-link class="button is-success" to="/">Home</router-link>
        </div>
        <div class="level-item">
          <button class="button" v-on:click="toggle_debug" :class="{'is-dark' : debug}">
            <span v-if="debug">Debug ON</span>
            <span v-if="!debug">Debug OFF</span>
          </button>
        </div>
        <div class="level-item">
          <toggle-button
            option1="dark"
            option2="light"
            v-model="cssSelector">
          </toggle-button>
        </div>
      </div>
    </nav>

    <div class="notification is-info" v-if="!error && !screen">
      Chargement...
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

<style lang="sass">
nav {
  padding: 0 5px; 
  margin-bottom: 4px !important;
}

div.tile.is-ancestor {
  padding-left: 10px;
  padding-right: 10px;
}

/* Dark mode */
div#wrapper.dark {

  nav {
    .title {
      color: white;
    }
  }
}
</style>
