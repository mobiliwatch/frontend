<script>
var ReconnectingWebSocket = require('ReconnectingWebSocket');
var Group = require('./widgets/Group.vue');

module.exports = {
  components: {
    'Group' : Group,
  },
  data: function() {
    return {
      slug : '',
      error : null,
      ws : null,
      debug : false,
    }
  },
  mounted : function(){
    this.load_screen(this.$route.params.slug, this.$route.params.token);
  },
  methods : {
    // Load a screen data and strore them
    load_screen : function(slug, token){
      // TODO: use global urls
      var api_url = API_URL + '/screen/' + slug + '/';
      var ws_url = WS_URL + '/screen/' + slug + '/';
      if(token){
        api_url += 'shared/' + token + '/';
        ws_url += 'shared/' + token + '/';
      }
      var options = {
        credentials : true,
      };
      this.$http.get(api_url, options).then(function(resp){
        // add screen to store
        var store = this.$store;
        store.commit('update_screen', {
          update : resp.body,
        });

        // Add widgets to stores
        this.screen.widgets.forEach(function(w){
          store.commit('add_widget', w);
        });

        // Setup Websocket
        var that = this;
        var ws = new ReconnectingWebSocket(ws_url);
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
      if(payload.type == 'widget')
        this.$store.commit('update_widget', payload);

      else if(payload.type == 'screen')
        this.$store.commit('update_screen', payload);

      else
        console.warn('Unsupported Websocket message', msg);
    },

    // Toggle debug mode
    toggle_debug : function(){
      this.$store.commit('toggle_debug');
    },
  },
  computed: {
    screen : function(){
      return this.$store.state.screen;
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
  <div id="wrapper" class="fullscreen" :class="screen.style" v-if="screen">

    <nav class="level">
      <div class="level-left">
        <div class="level-item">
          <img class="brand" src="/images/logo.png" alt="Logo" />
        </div>
        <div class="level-item">
          <p class="title" v-if="screen">{{ screen.name }}</p>
          <p class="heading">Mobili.Watch</p>
        </div>
      </div>
      <div class="level-right" v-if="screen.admin">
        <div class="level-item">
          <router-link class="button is-success" to="/">Home</router-link>
        </div>
        <div class="level-item">
          <button class="button" v-on:click="toggle_debug" :class="{'is-dark' : debug}">
            <span v-if="debug">Debug ON</span>
            <span v-if="!debug">Debug OFF</span>
          </button>
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
      <Group :group="group" :sibling="screen.groups.length" v-for="group in screen.groups" />
    </div>
  </div>
</template>

<style lang="sass">
nav {
  padding: 0 5px;
  margin-bottom: 4px !important;

  img.brand {
    max-height: 42px;
  }
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
