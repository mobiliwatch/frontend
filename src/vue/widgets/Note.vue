<template>
  <div class="note" v-html="html_render">
  </div>
</template>

<script>
var mixins = require('./mixins.js');
var markdown = require('markdown').markdown;

module.exports = {
  mixins : [mixins, ],
  data : function(){
    return {};
  },
  computed : {
    html_render : function(){
      // Render text as markdown
      return markdown.toHTML(this.widget.text);
    },
  },
};
</script>
