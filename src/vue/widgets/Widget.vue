<template>
  <div class="tile is-parent">
    <article class="tile is-child notification is-info">
      <div class="content">
        <p class="title">{{ widget.type }} #{{ widget.id }}</p>
        <div class="content">
          <Note v-if="widget.type == 'NoteWidget'" :text="widget.text" />
          <Clock v-if="widget.type == 'ClockWidget'" />
          <Weather v-if="widget.type == 'WeatherWidget'" :weather="widget.weather" />
          <Location v-if="widget.type == 'LocationWidget'" :location="widget.location" />
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

module.exports = {
  components : {
    'Note' : Note,
    'Clock' : Clock,
    'Weather' : Weather,
    'Location' : Location,
  },
  props : {
    widget : Object,
  },
  data : function(){
    return {};
  },
};
</script>
