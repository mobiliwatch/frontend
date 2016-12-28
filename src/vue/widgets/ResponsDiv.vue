<script>

module.exports = {
  props: {
    'schema': Array,
    'value':  String,
  },
  data: function () {
    return {
      width:  undefined,
      height: undefined,
      state:  undefined,
    }
  },
  mounted: function () {
    this.updateSize();
    window.addEventListener('resize', this.updateSize);
  },
  methods: {
    updateSize: function() {
      var parent = this.$el.parentElement;
      if (parent) {
        this.width  = parent.offsetWidth;
        this.height = parent.offsetHeight;
        var state = undefined;
        for (var i = 0; i < this.schema.length; i++) {
          var point = this.schema[i];
          var name = point.name;
          var fail = false;
          for (var att in point) {
            if (att !== 'name') {
              var value = point[att];
              switch(att) {
                case 'min-width':
                  fail = (this.width < value);
                  break;
                case 'max-width':
                  fail = (this.width > value);
                  break;
                case 'min-height':
                  fail = (this.height < value);
                  break;
                case 'max-height':
                  fail = (this.height > value);
                  break;
                default:
                  console.log('ResponsDiv: ignored unknown "' + att + '" attribute');
              }
              if (fail)
                break;
            }
          }
          if (!fail) {
            state = name;
            break;
          }
        }
        this.state = state;
        // console.log('window width: ' + window.innerWidth);
        // console.log('div size: ' + this.width + ' x ' + this.height + ' => ' + this.state);
        this.$emit('input', this.state);
      }
    },
  },
}
</script>

<template>
  <div class="responsdiv">
  </div>
</template>

<style>
  div.responsdiv {
    display: none;
  }
</style>
