<template>
  <div class="tweet">
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
var moment = require('moment'); // date lib
moment.locale('fr');

module.exports = {
  props : {
    tweet: Object,
  },
  data : function(){
    return {
    };
  },
  computed : {
    diff : function(){
      var created = moment(this.tweet.created * 1000);
      return created.fromNow();
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
