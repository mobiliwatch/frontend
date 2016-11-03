var vm = new Vue({
  el: '#app',
  data: {
    time: '22:50',
    weather: 'pluie',
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
  }
})
