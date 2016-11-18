<template>
  <div class="location">

    <div class="row">
      <div class="col-sm-6 big text-center" v-bind:class="pannelClass">
        <div>
          {{ time }}
        </div>
      </div>
      <div class="col-sm-6 big text-center" v-bind:class="pannelClass">
        <div>
          {{ weather }}
        </div>
      </div>
    </div>
    <div v-for="line in lines" class="row">
      <div class="col-sm-12">
        <div class="row">
          <div class="col-sm-12 big" v-bind:class="pannelClass">
            <div>
              {{ line.name }} <small>direction</small> {{ line.direction }}
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-3 delays">
            arrêt à {{ line.distance }} min
          </div>
          <div class="col-sm-9 delays">
            prochains :
            <ul>
              <li v-for="delay in line.delays">{{ delay }} min</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
module.exports = {
  props : {
    location : Object,
  },
  data : function(){
    return {
      // Demo : TRASHME
      lines: [
        {
          name: 'Tram A',
          direction: 'Fontaine-La Poya',
          distance: 5,
          delays: [3, 7, 12]
        },
        {
          name: 'Chrono C4',
          direction: 'Victor Hugo',
          distance: 2,
          delays: [5, 11]
        }
      ]
    };
  }
}
</script>
