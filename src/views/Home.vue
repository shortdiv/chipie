<template>
  <div class="home">
    <AccountProfile />
    <BaseMap>
      <template v-slot:default="{ loaded, mapContext }">
        <ContextWrapper :mapContext="mapContext" v-if="loaded">
          <SourceLayer
            :mapContext="mapContext"
            sourceId="goto-chi"
            sourceType="geojson"
            :dataSrc="gotoVenue"
          />
          <SourceLayer
            :mapContext="mapContext"
            sourceId="animated-line"
            sourceType="geojson"
            :dataSrc="directions"
          />
          <AnimateLayer
            v-if="line !== null"
            :map="mapContext"
            :data="directions"
            sourceId="animated-line"
            :time="6"
            :paint="linePaint"
            :layout="lineLayout"
          />
          <FeatureLayer
            :mapContext="mapContext"
            mapId="goto-chi-venue"
            sourceId="goto-chi"
            layerType="symbol"
            imgName="vue"
            imgSize="0.15"
            :img="img"
          />
          <SourceLayer
            :mapContext="mapContext"
            sourceId="yelp"
            sourceType="geojson"
            :dataSrc="yelpData"
          />
          <FeatureLayer
            :mapContext="mapContext"
            mapId="yelp-pops"
            @layer-clicked="
              e => {
                moveMap(mapContext, e);
              }
            "
            sourceId="yelp"
            layerType="symbol"
            imgName="pins"
            imgSize="0.3"
            :img="pins"
          >
            <FeaturePopup>
              <span>Hello Vue Conf!</span>
            </FeaturePopup>
          </FeatureLayer>
        </ContextWrapper>
      </template>
    </BaseMap>
    <div id="sidebar" v-if="dataLoaded">
      <Slider
        v-if="reviewsLoaded && dataLoaded"
        :chiPieFocus="chipieClicked"
        :yelpData="yelpData.features"
        :ratings="rates"
        @rating-selected="setReviewRatings"
        @find-route="findRoute"
      />
    </div>
  </div>
</template>

<script>
import BaseMap from "@/components/BaseMap.vue";
import AnimateLayer from "@/components/AnimateLayer.vue";
import ContextWrapper from "@/components/ContextWrapper.js";
import FeatureLayer from "@/components/FeatureLayer.vue";
import FeaturePopup from "@/components/FeaturePopup.vue";
import SourceLayer from "@/components/SourceLayer.vue";
import AccountProfile from "@/components/AccountProfile.vue";
import Icon from "@/assets/jscamp.png";
import Slider from "@/components/Slider.vue";
import axios from "axios";

import { mapState, mapActions } from "vuex";

export default {
  name: "home",
  components: {
    BaseMap,
    AnimateLayer,
    SourceLayer,
    FeatureLayer,
    FeaturePopup,
    ContextWrapper,
    Slider,
    AccountProfile
  },
  data() {
    return {
      line: null,
      rates: {},
      reviewsLoaded: false,
      chipieClicked: "Lou Malnati's Pizzeria",
      dataLoaded: false,
      pins:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEsAAABLCAYAAAA4TnrqAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABAZJREFUeNrsnO1tGkEQhveQ/4cUEAlXEFxAZKgAUkGgAocK4CoAKuCoIJcKOJQCoANflAYoIbPWxEIRYG5n3v1AHmnFD5u9vYd3Z2b3Zi8znu3Pw5c2fQypfabW5dY+8+8HantuW2rVp92vgwlkmWdATwxHYhbcklrpG1zmAdKU2uiCelztwNAWvqBlQFAzVlIbfA8v0AjYLDlYBMlOsx/UOp5dip2eY4K2R12gpQzqO33sAoAy7At3NIZR9MqiQa7YN8VgBSlsHCWsyEDBgGU3CgoCrCUENY8YlLURR+WwyqJBDDnqpWB9UlgVBBaB6nDUaycCy+Zi99Lk1XUazhMCZXisc+/KIlX16GNj0jTRdLxzVBXC/r+JHuAa0xPXwSgLoKqC2vrcr81BZKAccZ3V1dRnPSkNuGSHO740cPpbyXnSPX9Hw77BlcUR8FlhsBMCsBCsPTXcwEeXyNhEWUOFQY5dQbHS7Hc1MvIhehoOhAPM6WYL6V1yHwthNwM0LEl0qjU356ivie1T0EUPBoujoMhPAdKAXJKksg+GKKsjVFWpTYqno0RdUcIqDc4qn1PxWlgfBIPaAmEh+3aGJXnWh3xMVccI693eYWFg1ZGOvx0jrN++E8Ar7fHWpuEA2LdkvQpbSEvyma7CCuDcqkKS/+1RsKQ+awpQlbTPGgKLlha1dOGqWYPA+1oitfI9wXyWtDplzhU2UlBdBVU5uZUmsH4qhPmNBBh/d6OQMmzRsCqFGWRvcsfTqCmomdF7sOt0L02f7uyMvCb02MFe3D09qkWdGsWaL7qm05P4ps8N14qw7M2vuAqnOjE1HkEJrfOW0Z3DhRAPWXvgTF/F97Yayrc22M08H1Z6gaUUFUNaIamkaQxLYe87pK1DLKTXCYKqpQVtrrAWBrtdjLBc2oETLJ73y4RAHTQCk2Q/KyV1LTXO9zjDSkhdByOvjRArKxV1LbVOjYlgJaAuNVU1XkhfWPA+mzCHm96yiaQeTHsavg4q0rxqodmhCiyukqkig6V+KqylPLhYnH2pcfwEBot3JGJw9geEqrSVZbgUch8YVo46YN5KwVc0sErbqUNh8YHu/Jamn2qedSb30ny4cY19RdSuoqfh6+A9RscCDQoKi6Ojj2R17ysphpYc8RZ0gfZTvl6v4qM+awJMJ6BvCPEOi391hP/KffgpL9HwRHTsGb2DnZA3gkQDi4GN6GMldegE6iFExuu1tFvh+Jv1T/1Qy4MsxEUdX8nyAurmX2N3Bph928i11cYqL7FIahqeWHDvrwTVDw0qqLJYXbZYze7ft98AFXrbJ7iy/uVg/Qs52DgWUMFhMbBza7ux76QzelhHKcXxHthC46T+TZuNkJxWRGl/BRgAtAd0cl+QnEwAAAAASUVORK5CYII=",
      layout: { "icon-image": "star-15" },
      img: Icon,
      gotoVenue: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [-87.6385644, 41.8776048]
            },
            properties: {
              name: "JSCamp",
              aka: "cars.com",
              address: "300 South Riverside Plaza"
            }
          }
        ]
      },
      yelpData: {
        type: "FeatureCollection",
        features: []
      },
      linePaint: {
        "line-color": "#888",
        "line-width": 4
      },
      lineLayout: {
        "line-join": "round",
        "line-cap": "round"
      },
      directions: {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: []
        }
      }
    };
  },
  computed: {
    ...mapState("auth", ["currentUser"])
  },
  methods: {
    ...mapActions("reviews", ["getRatings", "setRatings"]),
    moveMap(map, e) {
      map.flyTo({ center: e.features[0].geometry.coordinates, speed: 2.0 });
      this.chipieClicked = e.features[0].properties.name;
    },
    setReviewRatings(val) {
      this.setRatings({ id: this.currentUser.id, ...val });
    },
    geojsonify(response) {
      let features = [];
      response.map(item => {
        features.push({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [item.coordinates.longitude, item.coordinates.latitude]
          },
          properties: {
            ...item
          }
        });
      });
      return {
        type: "FeatureCollection",
        features
      };
    },
    findRoute(route) {
      this.line = route.routes[0];
      this.directions = {
        type: "Feature",
        properties: {
          distance: route.routes[0].distance,
          duration: route.routes[0].duration
        },
        geometry: route.routes[0].geometry
      };
    }
  },
  mounted() {
    axios
      .get("/.netlify/functions/yelp-it", {
        params: {
          location: "chicago,il",
          term: "pizza"
        }
      })
      .then(async res => {
        res = JSON.parse(res.data.results.body);
        const results = this.geojsonify(res.businesses);
        this.dataLoaded = true;
        this.yelpData = results;
        console.log(this.currentUser);
        const r = await this.getRatings(this.currentUser.id);

        if (r.length === 0) {
          this.reviewsLoaded = true;
        }
        for (let i = 0; i < r.length; i++) {
          this.rates[r[i].id] = { ...r[i].data() };
          if (i === r.length - 1) {
            this.reviewsLoaded = true;
          }
        }
      });
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
#sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 12em;
}
</style>
