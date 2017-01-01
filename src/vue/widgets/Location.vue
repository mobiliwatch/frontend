<template>
  <div class="location">
    <ResponsDiv
      :schema="[
        { name: 'large',  'min-width': 800 },
        { name: 'medium', 'min-width': 600 },
        { name: 'small',  'min-width': 500 },
        { name: 'tiny'                     }]"
      v-model="divclass" />

    <div class="lines" v-if="pages != null">
      <Transportline :line_stop="ls" :height="line_height" :divclass="divclass" :widgetId="widgetId" v-for="ls in pages[current_page]"/>
    </div>

    <nav class="pagination" v-if="pages != null && pages.length > 1">
      <a class="button" v-on:click="switch_page(current_page - 1)">Précédente</a>
      <a class="button" :class="{'is-primary' : i == current_page}" v-on:click="switch_page(i, $evt)" v-for="(p, i) in pages">{{ i+1 }}</a>
      <a class="button" v-on:click="switch_page(current_page + 1)">Suivante</a>
    </nav>

  </div>
</template>

<script>
var mixins = require('./mixins.js');
var Transportline = require('./Transportline.vue');
var ResponsDiv = require('./ResponsDiv.vue');

module.exports = {
  mixins : [mixins, ],
  components : {
    'Transportline': Transportline,
    'ResponsDiv':    ResponsDiv,
  },
  data : function(){
    return {
      'current_page' : 0, // start on first page
      'nb_pages' : 0, // Total nb of pages
      'line_height' : 250, // Height for every line item
      'interval' : 10000, // In ms between each page change
      'pause' : 60000, // In ms before pages change again (after a manual page selection)
      'timer' : null, // Interval tracker
      'divclass' : undefined,
    };
  },
  watch : {
    divclass: function () {
      this.line_height = { large: 250, medium: 200, small: 180, tiny: 100 }[this.divclass];
    },
  },
  methods : {
    switch_page : function(page_id, evt){
      if(evt)
        evt.preventDefault();

      // By default, switch to next page
      var pause;
      if(page_id == undefined) {
        page_id = this.current_page + 1;
      } else {
        pause = this.pause;
      }

      // Keep inside bounds
      page_id = (page_id + this.nb_pages) % this.nb_pages;

      // Save new page
      this.$set(this, 'current_page', page_id);

      // Trigger next switch
      this.register_switch(pause);
    },
    register_switch : function(pause) {
      // Register the next switch, after clearing previous
      if(!this.widget.auto_pagination)
        return;
      if(this.timer != null)
        clearTimeout(this.timer);
      var timeout = (typeof pause == 'undefined') ? this.interval : pause;
      this.$set(this, 'timer', setTimeout(this.switch_page, timeout));
    },
  },
  computed : {
    'pages' : function(){
      if(this.widget.revision == 0)
         return null;

      // "mobile" layout
      if (window.innerWidth <= 768) {
        this.$set(this, 'nb_pages', 1);
        return [ this.widget.location.line_stops ];
      }

      // Get the height for container
      // Use article height as fallback
      var h = this.$el.clientHeight || 0.9 * this.$el.parentElement.parentElement.clientHeight;

      // Calc nb of items per page
      var per_page = Math.floor(h / this.line_height);
      if(per_page == 0)
        throw new Error('Screen too small, container height', h);

      // Calc nb of pages
      stops = this.widget.location.line_stops;
      this.$set(this, 'nb_pages', Math.ceil(stops.length / per_page));
      var out = [];
      for(var p = 0; p < this.nb_pages; p++){
        out.push(stops.slice(p * per_page, (p+1) * per_page));
      }

      return out;
    },
  },
  mounted : function () {
    // Switch pages regularly
    this.register_switch();
  },
}
</script>

<style scoped lang="sass">
.location {
  /* propagate height */
  height: 100%;

  .pagination {
    height: 6%;
    a {
      margin: 0 3px;
    }
  }

  .lines {
    height: 94%;
  }
}
</style>
