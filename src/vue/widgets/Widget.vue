<template>
  <div class="tile is-parent">
    <article class="tile is-child box">
      <div class="content">

        <!-- Debug Tools -->
        <div class="tools is-12">
          <span class="tag is-success">Version {{ widget.revision }}</span>

          <span class="tag is-dark" v-if="!widget.updated">Pas de mises à jour</span>
          <span class="tag is-info" v-if="widget.updated">Mis à jour {{ widget.updated }}</span>

          <button class="button is-small" v-on:click="toggle_debug()">Debug</button>

          <div v-if="debug">
            <p class="title" v-if="widget">{{ widget.type }}</p>
            <p class="subtitle">{{ widget.id }}</p>
            <pre>{{ widget }}</pre>
          </div>
          <hr />
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
