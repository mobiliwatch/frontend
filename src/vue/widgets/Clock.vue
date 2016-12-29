<template>
<section class="hero">
  <div class="hero-body">
    <div class="container">
      <div class="clock has-text-centered">
        <p class="time" :style="{ 'font-size': timefont * 4 + 'em' }">
          <ScaleDiv
            :schema="{
              refvalue: 170,
              freedom:  'scale-down'
            }"
            v-model="timefont" />
          <span class="hours">
            {{ hours }}
          </span>
          <span class="separator">:</span>
          <span class="minutes">
            {{ minutes }}
          </span>
          <!--
          <span class="separator">:</span>
          <span class="seconds">
            {{ seconds}}
          </span>
          -->
        </p>
        <p class="date" :style="{ 'font-size': datefont * 2 + 'em' }">
          <ScaleDiv
            :schema="{
              refvalue: 350,
              freedom:  'scale-down'
            }"
            v-model="datefont" />
          {{ day }} {{ date }} {{ month }} {{ year }}
        </p>
      </div>
    </div>
  </div>
</section>
</template>

<script>
var mixins = require('./mixins.js');
var ScaleDiv = require('./ScaleDiv.vue');

module.exports = {
  mixins : [mixins, ],
  components : {
    'ScaleDiv': ScaleDiv,
  },
  data : function(){
    return {
      rawDate : new Date(),
    };
  },
  mounted : function(){
    // Refresh clock every seconds
    setInterval(this.updateDateTime, 500);
  },
  methods: {
    updateDateTime : function() {
      this.$set(this, 'rawDate', new Date(new Date().getTime() - this.offset));
    },
    intFormat : function(x){
      return x < 10 ? '0' + x : x;
    }
  },
  computed : {
    offset : function(){
      return this.widget.updated.local - this.widget.updated.server;
    },
    hours : function(){
      return this.intFormat(this.rawDate.getHours());
    },
    minutes : function(){
      return this.intFormat(this.rawDate.getMinutes());
    },
    seconds : function(){
      return this.intFormat(this.rawDate.getSeconds());
    },
    day : function(){
      var days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
      return days[this.rawDate.getDay()];
    },
    date : function(){
      return this.rawDate.getDate();
    },
    month : function(){
      var months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
      return months[this.rawDate.getMonth()];
    },
    year : function(){
      return this.rawDate.getFullYear();
    },
  },
};
</script>

<style lang="sass" scoped>
.clock {
  .time {
  }
  .date {
    color: #888;
  }

  .separator {
    color: #CCC;
  }
}

div#wrapper.dark {
  .date {
    color: #EEE;
  }

  .separator {
    color: #AAA;
  }
}
</style>
