<template>
  <div class="twitter">
    <h1 v-if="widget.mode == 'search'">Recherche Twitter: {{ widget.search_terms }}</h1>
    <h1 v-if="widget.mode == 'timeline'">Votre flux Twitter</h1>
    <h1 v-if="widget.mode == 'user_tweets'">Vos derniers tweets</h1>

    <Tweet :tweet="t" v-for="t in widget.tweets" />

    <div class="notification is-info" v-if="!widget.tweets">
      Chargement des tweets...
    </div>
  </div>
</template>

<script>
var mixins = require('./mixins.js');
var Tweet = require('./Tweet.vue');

module.exports = {
  mixins : [mixins, ],
  components : {
    'Tweet' : Tweet,
  },
  data : function(){
    return {};
  },
  computed : {
  },
};
</script>
