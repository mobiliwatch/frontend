<template>
  <div class="location">

    <nav class="pagination" v-if="pages != null && pages.length > 1">
      <a class="button" v-on:click="switch_page(current_page - 1)">Previous</a>
      <a class="button" :class="{'is-primary' : i == current_page}" v-on:click="switch_page(i, $evt)" v-for="(p, i) in pages">{{ i+1 }}</a>
      <a class="button" v-on:click="switch_page(current_page + 1)">Next page</a>
    </nav>

    <div class="lines" v-if="pages != null">
      <Transportline :line_stop="ls" :height="line_height" :widgetId="widgetId" v-for="ls in pages[current_page]"/>
    </div>
  </div>
</template>

<script>
var mixins = require('./mixins.js');
var Transportline = require('./Transportline.vue')

module.exports = {
  mixins : [mixins, ],
  components : {
    'Transportline': Transportline
  },
  data : function(){
    return {
      'current_page' : 0, // start on first page
      'nb_pages' : 0, // Total nb of pages
      'line_height' : 240, // Height for every line item
      'interval' : 5000, // In ms between each page change
      'timer' : null, // Interval tracker
    };
  },
  methods : {
    switch_page : function(page_id, evt){
      if(evt)
        evt.preventDefault();

      // By default, switch to next page
      if(page_id == undefined)
        page_id = this.current_page + 1;

      // Keep inside bounds
      page_id = page_id % this.nb_pages;

      // Save new page
      this.$set(this, 'current_page', page_id);

      // Trigger next switch
      this.register_switch();
    },
    register_switch : function(){
      // Register the next switch, after clearing previous
      if(this.timer != null)
        clearTimeout(this.timer);
      this.$set(this, 'timer', setTimeout(this.switch_page, this.interval));
    },
  },
  computed : {
    'pages' : function(){
      if(this.widget.revision == 0)
         return null;

      // Get the height for container
      var h = this.$el.clientHeight;

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

      // Switch pages regularly
      this.register_switch();

      return out;
    },
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
