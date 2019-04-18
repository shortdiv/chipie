<template>
  <div></div>
</template>

<script>
import geocoder from "mapbox-gl-geocoder";
import mapboxgl from "mapbox-gl";

export default {
  name: "Geocoder",
  props: {
    mapContext: { type: [Object, null], required: true }
  },
  mounted() {
    this.mapContext.addControl(
      new geocoder({
        accessToken:
          "pk.eyJ1IjoiYWxscnlkZXIiLCJhIjoidWs5cUFfRSJ9.t8kxvO3nIhCaAl07-4lkNw",
        zoom: 14,
        placeholder: "Enter search e.g. Lincoln Park",
        bbox: [-87.9395, 41.6446, -87.5245, 42.0229],
        mapboxgl: mapboxgl
      })
    );
  }
};
</script>

<style lang="scss">
@import "@/styles/geocoder.scss";
</style>
