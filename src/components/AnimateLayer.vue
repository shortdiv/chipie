<script>
import useDrawLine from "../functions/useDrawLine.js";
import { watch } from "@vue/composition-api";

export default {
  name: "PointLayer",
  props: {
    map: Object,
    data: Object,
    sourceId: String,
    time: Number,
    layout: Object,
    paint: Object
  },
  setup(props) {
    props.map.addLayer({
      id: "animated-line-draw",
      source: props.sourceId,
      type: "line",
      layout: props.layout,
      paint: props.paint
    });
    const waypointVal = useDrawLine(props.data, props.time); // logic inside useLogicA may mutate valueA
    watch(
      () => waypointVal.value,
      val => {
        if (props.map.getSource(props.sourceId) !== undefined) {
          props.map.getSource(props.sourceId).setData(val);
        }
      }
    );
  },
  render() {
    return null;
  }
};
</script>
