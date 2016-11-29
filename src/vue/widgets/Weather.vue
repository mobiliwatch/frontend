<template>
  <div class="weather">
    <h2>Météo à {{ widget.city.name }}</h2>


    <div class="weather" v-if="widget.revision > 0">
      <div>
        <span class="icon is-huge">
          <span class="wi" :class="'wi-owm-' + widget.code"></span>
        </span>
        <h4>{{ weather_status_french }}</h4>
      </div>
      <div>
        <span class="icon is-medium">
          <span class="wi wi-thermometer"></span>
        </span>
        <span>{{ widget.temperature.temp_min }} à {{ widget.temperature.temp_max }} °C</span>
      </div>
      <div>
        <span class="icon is-medium">
          <span class="wi wi-sunrise"></span>
        </span>
        <span>Lever du soleil à {{ widget.sunrise|time }}</span>
      </div>
      <div>
        <span class="icon is-medium">
          <span class="wi wi-sunset"></span>
        </span>
        <span>Coucher du soleil à {{ widget.sunset|time }}</span>
      </div>
      <div>
        <span class="icon is-medium">
          <span class="wi wi-humidity"></span>
        </span>
        <span>{{ widget.humidity }}% d'humidité</span>
      </div>
      <div>
        <span class="icon is-medium">
          <span class="fa fa-clock-o"></span>
        </span>
        <span>Observé il y'a {{ widget.observed|timesince }}h</span>
      </div>
    </div>
  </div>
</template>

<script>
var mixins = require('./mixins.js');

module.exports = {
  mixins : [mixins, ],
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
    line-height: 96px;
    text-align: center;
    vertical-align: top;
    width: 96px;
}
</style>
