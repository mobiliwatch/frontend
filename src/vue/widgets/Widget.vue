<template>
  <div class="tile is-parent" v-if="widget">
    <article class="tile is-child box">
      <div class="content">

        <!-- Debug Tools -->
        <div class="tools is-12" v-if="debug">
          <span class="tag is-success">Version {{ widget.revision }}</span>

          <span class="tag is-dark" v-if="!widget.updated">Pas de mises à jour</span>
          <span class="tag is-info" v-if="widget.updated">Local time {{ widget.updated.local }}</span>
          <span class="tag is-info" v-if="widget.updated">Server time {{ widget.updated.server }}</span>

          <button class="button is-small" v-on:click="toggle_details()">Widget Details</button>

          <div v-if="show_details">
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
          <Disruption v-if="widget.type == 'DisruptionWidget'" :widgetId="widgetId" />
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
var Disruption = require('./Disruption.vue');
var mixins = require('./mixins.js');

// Manual mixin to support computed
module.exports = {
  mixins : [mixins, ],
  components : {
    'Note' : Note,
    'Clock' : Clock,
    'Weather' : Weather,
    'Location' : Location,
    'Disruption' : Disruption,
  },
  data : function(){
    return {
      show_details : false,
    };
  },
  methods : {
    toggle_details : function(){
      this.$set(this, 'show_details', !this.show_details);
    },
  },
  computed : {
    debug : function(){
      return this.$store.state.debug;
    },
  },
};
</script>

<style lang="sass">

div.content {
  height: 100%; /* propagate height */
}

/* Dark mode */
div#wrapper.dark {
  .hero {
    background-color: transparent !important;
  }

  .button:not(.is-primary) {
    background-color: transparent !important;
  }

  .box {
    background-color: transparent !important;
    border: 1px solid #222;
  }

  .box, div.content {
    *, & {
      color: white;
    }
  }

}
</style>
