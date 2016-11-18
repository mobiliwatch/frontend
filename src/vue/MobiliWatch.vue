<script>
var toggleButton = require('./ToggleButton.vue');
var Widget = require('./Widget.vue');

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
    'Widget' : Widget,
  },
  data: function() {
    return {
      cssSelector: 'light',
      slug : '',
      screen : null,
      error : null,

      // Demo
      time: '22:50',
      weather: 'pluie',
      lines: [
        {
          name: 'Tram A',
          direction: 'Fontaine-La Poya',
          distance: 5,
          delays: [3, 7, 12]
        },
        {
          name: 'Chrono C4',
          direction: 'Victor Hugo',
          distance: 2,
          delays: [5, 11]
        }
      ]
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
      var url = API_URL + '/screen/demo/'; 
      var options = {
        credentials : true,
      };
      this.$http.get(url, options).then(function(resp){
        this.$set(this, 'screen', resp.body);

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

  <div class="tile is-vertical">
    <div class="tile">

      <div class="tile is-parent">
        <Widget :widget="screen.widgets[0]" />
      </div>
      <div class="tile is-parent">
        <Widget :widget="screen.widgets[1]" />
      </div>

    </div>

    <div class="tile">
      <div class="tile is-parent">
        <Widget :widget="screen.widgets[2]" />
      </div>
    </div>

  </div>

  <div class="tile is-parent is-vertical">
    <Widget :widget="screen.widgets[3]" />
  </div>

</div>


<!--
    <div class="container-fluid" v-cloak>
      <div class="row">
        <div class="col-sm-12 big text-center">
          Mobili<small>.watch</small>
        </div>
      </div>

      <div class="row">
        <div class="col-sm-12 medium">
        </div>
      </div>

      <div class="row">
        <div class="col-sm-6 big text-center" v-bind:class="pannelClass">
          <div>
            {{ time }}
          </div>
        </div>
        <div class="col-sm-6 big text-center" v-bind:class="pannelClass">
          <div>
            {{ weather }}
          </div>
        </div>
      </div>

      <div v-for="line in lines" class="row">
        <div class="col-sm-12">
          <div class="row">
            <div class="col-sm-12 big" v-bind:class="pannelClass">
              <div>
                {{ line.name }} <small>direction</small> {{ line.direction }}
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-3 delays">
              arrêt à {{ line.distance }} min
            </div>
            <div class="col-sm-9 delays">
              prochains :
              <ul>
                <li v-for="delay in line.delays">{{ delay }} min</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      </div>

    <footer class="container-fluid text-center">
      <p>Concours Mobili’Play</p>
    </footer>
-->
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
