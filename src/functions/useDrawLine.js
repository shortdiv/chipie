import { reactive, ref } from "@vue/composition-api";
var turf = require("turf");

export default function useDrawLine(route) {
  const lineString = ref({
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates: [route.geometry.coordinates[0]]
    }
  });
  const line = [route.geometry.coordinates[0]];
  const movePoint = () => {
    const waypointState = reactive({
      timestamp: performance.now(),
      raf: null
    });
    const animateMarker = () => {
      let time = performance.now(); //ms
      const duration = route.properties.duration;
      const distance = route.properties.distance;
      let speed = distance / duration; //in m
      const timeElapsed = time - waypointState.timestamp;
      if (timeElapsed * speed >= distance) {
        cancelAnimationFrame(waypointState.raf);
      } else {
        var distTravelled = timeElapsed * speed;
        var positionNow = turf.along(route, distTravelled, "meters");
        line.push(positionNow.geometry.coordinates);
        lineString.value = {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: line
          }
        };
        waypointState.raf = requestAnimationFrame(animateMarker.bind(this));
      }
    };
    waypointState.raf = requestAnimationFrame(animateMarker.bind(this));
  };

  movePoint();
  return lineString;
}
