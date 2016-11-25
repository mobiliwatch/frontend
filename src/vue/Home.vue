<template>
  <div>
    Select a screen...

    <section class="hero is-medium is-bold" :class="{'is-info': i % 2 == 0, 'is-dark': i % 2 == 1}" v-for="(screen, i) in screens">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            Ecran {{ screen.name }}
          </h1>
          <h2 class="subtitle">
            <router-link :to="{ name: 'screen', params: { slug: screen.slug }}" class="button is-outlined is-large" :class="{'is-info': i % 2 == 1, 'is-dark': i % 2 == 0}" >
              <span class="icon">
                <span class="fa fa-desktop"></span>
              </span>
              <span>Utiliser cet écran</span>
            </router-link>
          </h2>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
module.exports = {
  data : function(){
    return {
      screens : [],
      error : null,
    };
  },
  mounted : function(){
    this.load_screens();
  },
  methods : {
    // Load screens list
    load_screens : function(slug){
      // TODO: use global urls
      var api_url = API_URL + '/screen/'; 
      var options = {
        credentials : true,
      };
      this.$http.get(api_url, options).then(function(resp){
        this.$set(this, 'screens', resp.body);
      }).catch(function(err){
        console.log('Failed to load screens', err);
        this.$set(this, 'error', err); 
      });
    },
  },
};
</script>
