<template>
  <div class="home">
    <BaseMap>
      <template v-slot:default="{ loaded, mapContext }">
        <ContextWrapper :mapContext="mapContext" v-if="loaded">
          <SourceLayer
            :mapContext="mapContext"
            sourceId="goto-chi"
            sourceType="geojson"
            :dataSrc="gotoVenue"
          />
          <FeatureLayer
            :mapContext="mapContext"
            mapId="goto-chi-venue"
            sourceId="goto-chi"
            layerType="symbol"
            :img="img"
          />
          <Geocoder :mapContext="mapContext" />
        </ContextWrapper>
      </template>
    </BaseMap>
  </div>
</template>

<script>
import BaseMap from "@/components/BaseMap.vue";
import ContextWrapper from "@/components/ContextWrapper.js";
import FeatureLayer from "@/components/FeatureLayer.vue";
import SourceLayer from "@/components/SourceLayer.vue";
import Icon from "@/assets/logo.png";
import Geocoder from "@/components/Geocoder.vue";

export default {
  name: "home",
  components: {
    BaseMap,
    SourceLayer,
    FeatureLayer,
    ContextWrapper,
    Geocoder
  },
  data() {
    return {
      img: Icon,
      gotoVenue: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [-87.604159, 41.89183]
            },
            properties: {
              name: "GoTo Chicago",
              aka: "Navy Pier"
            }
          }
        ]
      }
    };
  }
};
</script>

<style lang="scss" scoped>
body {
  margin: 0;
  padding: 0;
}
#map {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}
</style>
