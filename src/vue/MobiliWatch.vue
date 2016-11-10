<script>
var toggleButton = require('./ToggleButton.vue');

module.exports = {
  components: {
    'toggle-button': toggleButton
  },
  data: function() {
    return {
      cssSelector: 'light',
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
  computed: {
    pannelClass: function () {
      return this.cssSelector == 'dark' ? [ 'dark-pannel' ] : [ 'light-pannel' ]
    }
  }
};
</script>

<template>
  <div id="wrapper" v-bind:class="{ dark: cssSelector == 'dark' }">

    <div class="container-fluid" v-cloak>
      <div class="row">
        <div class="col-sm-12 big text-center">
          Mobili<small>.watch</small>
        </div>
      </div>

      <div class="row">
        <div class="col-sm-12 medium">
          <toggle-button
            option1="dark"
            option2="light"
            v-model="cssSelector">
          </toggle-button>
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
  </div>
</template>
