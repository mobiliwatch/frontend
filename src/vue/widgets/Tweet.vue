<template>
  <div class="tweet" v-if="tweet" v-show="visible">
    <article class="media">
      <div class="media-left">
        <figure class="image is-48x48">
          <img :src="tweet.avatar" alt="Avatar">
        </figure>
      </div>
      <div class="media-content">
        <div class="content">
          <p>
            <strong>{{ tweet.fullname }}</strong> <small>@{{ tweet.user }}</small> &bull; <small>{{ diff }}</small>
            <br>
            {{ tweet.text }}
          </p>
        </div>
      </div>
    </article>
  </div>
</template>

<script>
var mixins = require('./mixins.js');
var moment = require('moment'); // date lib
moment.locale('fr');

module.exports = {
  mixins : [mixins, ],
  props : {
    'tweetId': Number,
  },
  data : function(){
    return {
      visible: true,
    };
  },
  methods : {
    is_visible : function(){
      var maxHeight = window.innerHeight;
      var rect = this.$el.getBoundingClientRect();
      this.$set(this, 'visible', rect.bottom < maxHeight);
    }
  },
  beforeUpdate : function(){
    this.is_visible();
  },
  mounted: function(){
    this.is_visible();
    window.addEventListener('resize', this.is_visible);
  },
  computed : {
    diff : function(){
      var created = moment(this.tweet.created * 1000);
      return created.fromNow();
    },
    tweet : function(){
      if(!this.widget || !this.widget.tweets)
        return;
      return this.widget.tweets[this.tweetId];
    },
  },
};
</script>

<style lang="sass">
div.tweet {
  padding-bottom: 4px;
  margin-bottom: 8px;
  border-bottom: 1px solid #FAFAFA;
}
</style>
