<template>
  <div class="tile is-parent">
    <article class="tile is-child notification is-info">
      <div class="content">
        <button class="button is-small is-pulled-right" v-on:click="toggle_debug()">Debug</button>


        <!-- Debug Tools -->
        <div v-if="debug">
          <p class="title" v-if="widget">{{ widget.type }}</p>
          <p class="subtitle">{{ widget.id }}</p>
          <pre>{{ widget }}</pre>
        </div>

        <div class="content">
          <Note v-if="widget.type == 'NoteWidget'" :widgetId="widgetId" />
          <Clock v-if="widget.type == 'ClockWidget'" :widgetId="widgetId" />
          <Weather v-if="widget.type == 'WeatherWidget'" :widgetId="widgetId" />
          <Location v-if="widget.type == 'LocationWidget'" :widgetId="widgetId" />
        </div>
      </div>
    </article>
  </div>
</template>

<script>

// Specific implementations
var Note = require('./Note.vue');
var Clock = require('./Clock.vue');
var Weather = require('./Weather.vue');
var Location = require('./Location.vue');
var mixins = require('./mixins.js');

// Manual mixin to support computed
module.exports = {
  mixins : [mixins, ],
  components : {
    'Note' : Note,
    'Clock' : Clock,
    'Weather' : Weather,
    'Location' : Location,
  },
  data : function(){
    return {
      debug : false,
    };
  },
  methods : {
    toggle_debug : function(){
      this.$set(this, 'debug', !this.debug);
    },
  },
};
</script>
