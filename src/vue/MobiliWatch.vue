<script>
var toggleButton = require('./ToggleButton.vue');
var Group = require('./widgets/Group.vue');

// Helpers
function getUrlParameter(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  var results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

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
    }
  },
  mounted : function(){
    // TODO: manage a list of screens
    this.$set(this, 'slug', getUrlParameter('screen'));
    if(this.slug)
      this.load_screen(this.slug);
  },
  methods : {
    // Load a screen data and strore them
    load_screen : function(slug){
      // TODO: use global urls
      var url = API_URL + '/screen/' + slug + '/'; 
      var options = {
        credentials : true,
      };
      this.$http.get(url, options).then(function(resp){
        this.$set(this, 'screen', resp.body);

        // Add widgets to stores
        var store = this.$store;
        this.screen.widgets.forEach(function(w){
          store.commit('add_widget', w);
        });

      }).catch(function(err){
        console.log('Failed to load screen', err);
        this.$set(this, 'error', err); 
      });
    }
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
