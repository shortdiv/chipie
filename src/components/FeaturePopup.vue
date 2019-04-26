<script>
import mapboxgl from "mapbox-gl";
import Vue from "vue";
export default {
  name: "featurePopup",
  inject: ["mapContext", "mapId"],
  props: {
    text: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      popup: null
    };
  },
  methods: {
    createHTML(event) {
      const popupContentVNode = this.$slots.default;
      popupContentVNode[0].children[0].text = event.features[0].properties.name;
      const popupHTML = new Vue({
        data() {
          return {
            msg: event.features[0].properties.name
          };
        },
        render(h) {
          return h("div", popupContentVNode);
        }
      }).$mount().$el.innerHTML;

      return popupHTML;
    }
  },
  mounted() {
    this.mapContext.on("click", this.mapId, event => {
      const popupContent = this.createHTML(event);
      this.popup = new mapboxgl.Popup()
        .setLngLat(event.features[0].geometry.coordinates)
        .setHTML(popupContent)
        .addTo(this.mapContext);
    });
  },
  render() {
    return null;
  },
  beforeDestroy() {
    this.popup.remove();
    this.popup = null;
  }
};
</script>
