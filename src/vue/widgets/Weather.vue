<template>
  <div class="weather" v-if="widget.revision > 0" :style="{ 'font-size': weatherfont * 1.5 + 'em' }">
    <h3>Météo à {{ widget.city.name }}</h3>
    <hr />

    <ScaleDiv
      :schema="{
        refvalue: 350,
        freedom:  'scale-down'
      }"
      v-model="weatherfont" />

    <div class="media is-fat">
      <div class="media-left">
        <span class="icon is-huge">
          <span class="wi" :class="'wi-owm-' + widget.code"></span>
        </span>
      </div>
      <div class="media-content">
        <p style="font-size: 1.5em;">{{ weather_status_french }}</p>
        <p style="font-size: 1.0em;">En ce moment</p>
      </div>
    </div>

    <div class="media">
      <div class="media-left">
        <span class="icon is-medium">
          <span class="wi wi-thermometer"></span>
        </span>
      </div>
      <div class="media-content">
        <span v-if="widget.temperature.temp_min == widget.temperature.temp_max">{{ widget.temperature.temp_min }} °C</span>
        <span v-else>{{ widget.temperature.temp_min }} à {{ widget.temperature.temp_max }} °C</span>
      </div>
    </div>

    <div class="media" v-if="air_quality">
      <div class="media-left">
        <span class="icon is-medium">
          <span class="wi wi-smog" :style="{color: air_quality.color }" style="text-shadow: 0 0 1px black"></span>
        </span>
      </div>
      <div class="media-content">
        {{ air_quality.text }} qualité de l'air (indice {{ air_quality.y }})
      </div>
    </div>

    <div class="media">
      <div class="media-left">
        <span class="icon is-medium">
          <span class="wi wi-sunrise"></span>
        </span>
      </div>
      <div class="media-content">
        Lever du soleil à {{ widget.sunrise|time }}
      </div>
    </div>

    <div class="media">
      <div class="media-left">
        <span class="icon is-medium">
          <span class="wi wi-sunset"></span>
        </span>
      </div>
      <div class="media-content">
        Coucher du soleil à {{ widget.sunset|time }}
      </div>
    </div>

    <div class="media">
      <div class="media-left">
        <span class="icon is-medium">
          <span class="wi wi-humidity"></span>
        </span>
      </div>
      <div class="media-content">
        {{ widget.humidity }}% d'humidité
      </div>
    </div>
  </div>
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
    return {};
  },
  filters : {
    time : function(timestamp){
      // Outputs only time from a timestamp
      var date = new Date(timestamp * 1000);
      var hours = "0" + date.getHours();
      var minutes = "0" + date.getMinutes();
      return hours.substr(-2) + ':' + minutes.substr(-2);
    },
    timesince : function(timestamp){
      // Difference since time, in hours
      var diff = new Date() - new Date(timestamp * 1000);
      return Math.ceil(diff / (3600*1000));
    },
  },
  computed : {
    air_quality : function(){
      // Texts
      var texts = [
        'Très bonne',
        'Bonne',
        'Bonne',
        'Bonne',
        'Moyen',
        'Médiocre',
        'Médiocre',
        'Médiocre',
        'Mauvaise',
        'Très mauvaise',
      ];

      // Get the air quality for today
      var data = this.widget.air_quality;
      if(!data)
        return null;
      var out = data[data.length - 1];
      out.text = texts[out.y - 1];
      return out;
    },
    weather_status_french : function(){
      // From https://github.com/buche/leaflet-openweathermap/blob/master/leaflet-openweathermap.js
      var translations = {
        200: 'Orage avec pluie légère' // 'Thunderstorm with Light Rain'
        , 201: 'Orage avec pluie' // 'Thunderstorm with Rain'
        , 202: 'Orage avec fortes précipitations' // 'Thunderstorm with Heavy Rain'
      //  , 210: 'Light Thunderstorm'
        , 211: 'Orage'
        , 212: 'Orage violent' // 'Heavy Thunderstorm'
      //  , 221: 'Ragged Thunderstorm'
        , 230: 'Orage avec bruine faible' // 'Thunderstorm with Light Drizzle'
        , 231: 'Orage avec bruine' // 'Thunderstorm with Drizzle'
      //  , 232: 'Thunderstorm with Heavy Drizzle'

      //  , 300: 'Light Intensity Drizzle'
        , 301: 'Bruine' // 'Drizzle'
      //  , 302: 'Heavy Intensity Drizzle'
      //  , 310: 'Light Intensity Drizzle Rain'
      //  , 311: 'Drizzle Rain'
      //  , 312: 'Heavy Intensity Drizzle Rain'
      //  , 321: 'Shower Drizzle'

        , 500: 'Pluie légère' // 'Light Rain'
        , 501: 'Pluie modérée' // 'Moderate Rain'
        , 502: 'Pluie battante' // 'Heavy Intensity Rain'
      //  , 503: 'Very Heavy Rain'
      //  , 504: 'Extreme Rain'
        , 511: 'Pluie verglassante' // 'Freezing Rain'
        , 520: 'Averses de pluie fine' // 'Light Intensity Shower Rain'
      //  , 521: 'Shower Rain'
      //  , 522: 'Heavy Intensity Shower Rain'

        , 600: 'Légers flocons' // 'Light Snow'
        , 601: 'Neige' // 'Snow'
        , 602: 'Fortes chutes de neige' // 'Heavy Snow'
        , 611: 'Neige fondue' // 'Sleet'
        , 621: 'Averses de neige' // 'Shower Snow'
        , 622: 'Fortes chutes de neige' // 'Heavy Shower Snow'

        , 701: 'Brume' // 'Mist'
        , 711: 'Fumée' // 'Smoke'
        , 721: 'Brume' // 'Haze'
        , 731: 'Tourbillons de sable/poussière' // 'Sand/Dust Whirls'
        , 741: 'Brouillard' // 'Fog'
      //  , 751: 'Sand'

        , 800: 'Ciel dégagé' // 'Sky is Clear'
        , 801: 'Ciel voilé'
        , 802: 'Nuageux' // 'Scattered Clouds'
        , 803: 'Nuageux' // 'Broken Clouds'
        , 804: 'Ciel couvert' // 'Overcast Clouds'

        , 900: 'Tornade' // 'Tornado'
        , 901: 'Tempête tropicale'// 'Tropical Storm'
        , 902: 'Ouragan' // 'Hurricane'
        , 903: 'Froid' // 'Cold'
        , 904: 'Chaleur' // 'Hot'
        , 905: 'Venteux' // 'Windy'
        , 906: 'Grêle' // 'Hail'
      };
      if(!this.widget || !this.widget.code)
        return '';
      return translations[this.widget.code];
    }
  },
};
</script>

<style lang="sass">
.icon.is-huge {
    display: inline-block;
    font-size: 90px;
    height: 96px;
    text-align: center;
    width: 96px;
}

.is-fat {
  .media-content {
    margin-top: 6px;
  }
}
.media + .media {
  border-top: 0;
}
</style>
