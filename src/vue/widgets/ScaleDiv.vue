<script>

module.exports = {
  props: {
    'schema': Object,
    'value':  Number,
  },
  data: function () {
    return {
      width:  undefined,
      height: undefined,
      area:   undefined,
      ratio:  1.0,
    }
  },
  computed: {
    /* schema, parsed and completed with default values */
    myschema: function() {
      var schema = {
        measure: 'width',       /* 'width' (default), 'height' or 'area' */
        refvalue: undefined,    /* the reference value (boundary included), MANDATORY */
        boundary: 0,            /* the div boundary to pull out from the ratio, default is 0 */
        freedom:  'scale-both'  /* 'scale-up', 'scale-down' or 'scale-both' (default) */
      };
      for (var k in this.schema) {
        var v = this.schema[k];
        switch (k) {
          case 'measure':
            if ([ 'width', 'height', 'area' ].indexOf(v) > -1) {
              schema.measure = v;
            } else {
              console.warn('ScaleDiv: invalid value "' + v + '" for "measure"');
            }
            break;
          case 'refvalue':
            if (typeof v == 'number') {
              schema.refvalue = v;
            } else {
              console.warn('ScaleDiv: invalid value "' + v + '" for "refvalue"');
            }
            break;
          case 'boundary':
            if (typeof v == 'number') {
              schema.boundary = v;
            } else {
              console.warn('ScaleDiv: invalid value "' + v + '" for "boundary"');
            }
            break;
          case 'freedom':
            if ([ 'scale-up', 'scale-down', 'scale-both' ].indexOf(v) > -1) {
              schema.freedom = v;
            } else {
              console.warn('ScaleDiv: invalid value "' + v + '" for "freedom"');
            }
            break;
          default:
            console.warn('ScaleDiv: unknown attribute "' + k + '"')
        }
      }
      if (!schema.refvalue) {
        console.warn('ScaleDiv: "refvalue" attribute is MANDATORY');
      }
      if (schema.boundary >= schema.refvalue) {
        console.warn('ScaleDiv: "boundary" must be smaller than "refvalue"');
      }
      return schema;
    },
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
        this.area = this.width * this.height;
        if (this.myschema.refvalue) {
          var measuredvalue = this[this.myschema.measure];
          var ratio = (measuredvalue - this.myschema.boundary) / (this.myschema.refvalue - this.myschema.boundary);
          switch (this.myschema.freedom) {
            case 'scale-up':
              ratio = Math.max(ratio, 1.0);
              break;
            case 'scale-down':
              ratio = Math.min(ratio, 1.0);
              break;
          }
          //console.log(measuredvalue + ' - ' + this.myschema.boundary + ' vs ' + this.myschema.refvalue + ' - ' + this.myschema.boundary + ' -> ' + ratio);
          this.ratio = ratio;
          this.$emit('input', this.ratio);
        }
      }
    },
  },
}
</script>

<template>
  <div class="scalediv">
  </div>
</template>

<style>
  div.scalediv {
    display: none;
  }
</style>
