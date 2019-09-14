<template>
  <div class="slider">
    <ul class="column-list">
      <li
        v-for="(dat, ind) in yelpData"
        :key="`${ind}`"
        :ref="
          dat.properties.name
            .toLowerCase()
            .split(' ')
            .join('-')
        "
        class="column-list--item"
      >
        <div class="column--item">
          <div class="column--item-img">
            <img
              class="lazy"
              src="../assets/kitchen.jpg"
              :data-src="dat.properties.image_url"
              alt="dat.properties.name"
            />
          </div>
          <div class="restaurant--text">
            <h3>{{ dat.properties.name }}</h3>
          </div>
          <UniversalRating
            :id="ind"
            :review="dat.properties.rating"
            :totalReviews="dat.properties.review_count"
          />
          <ReviewRatings
            v-if="ratings"
            :id="ind"
            :name="dat.properties.name"
            :priorRating="getRating(dat.properties.name)"
            @rating-selected="selectRating"
          />
          <div>
            <!-- <a :href="stringifyAddress(dat)">Directions</a> -->
            <button @click="stringifyAddress(dat)">Directions</button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import UniversalRating from "@/components/UniversalRating.vue";
import ReviewRatings from "@/components/ReviewRatings.vue";
import axios from "axios";

export default {
  name: "slider",
  props: {
    yelpData: { type: Array, required: false, default: () => [] },
    ratings: { type: Object, required: false, default: () => {} },
    chiPieFocus: { type: String }
  },
  components: {
    ReviewRatings,
    UniversalRating
  },
  methods: {
    getRating(val) {
      return this.ratings[val] ? this.ratings[val].rating : null;
    },
    stringifyAddress(data) {
      axios
        .get("/.netlify/functions/directions", {
          params: {
            origin: { longitude: -87.6385644, latitude: 41.8776048 },
            destination: {
              longitude: data.geometry.coordinates[0],
              latitude: data.geometry.coordinates[1]
            }
          }
        })
        .then(res => {
          this.$emit("find-route", res.data.results);
        });
    },
    selectRating(val) {
      this.$emit("rating-selected", val);
    }
  },
  watch: {
    chiPieFocus(val) {
      val = val
        .toLowerCase()
        .split(" ")
        .join("-");
      this.$refs[val][0].scrollIntoView({
        behavior: "smooth"
      });
    }
  },
  mounted() {
    console.log(this.$refs);
    const lazyLoadImages = document.querySelectorAll(".lazy");
    var imageObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var image = entry.target;
          image.src = image.dataset.src;
          image.classList.remove("lazy");
          imageObserver.unobserve(image);
        }
      });
    });
    lazyLoadImages.forEach(img => {
      imageObserver.observe(img);
    });
  }
};
</script>

<style lang="scss" scoped>
.slider {
  width: 12em;
  background: white;
  top: 0;
  bottom: 0;
  left: 0;
  position: fixed;
  overflow-y: scroll;
  overflow-x: hidden;
  ul {
    list-style: none;
    padding: 1em;
  }
  li {
    margin-bottom: 1em;
  }
}
.column {
  &-list--item {
    &:not(:last-child) {
      border-bottom: 1px solid #e6e6e6;
      padding-bottom: 10px;
    }
  }
  &--item {
    cursor: pointer;
    position: relative;
    overflow: hidden;
    &:hover {
      width: 100%;
      img {
        -moz-transform: scale(1.2);
        -webkit-transform: scale(1.2);
        transform: scale(1.2);
      }
    }
    img {
      width: 100%;
      transition: all 0.5s ease-in-out;
    }
    &--img {
      overflow: hidden;
      width: 100%;
    }
  }
}
.restaurant--text {
  h3 {
    margin: 0.25em;
  }
}
label {
  display: inline-block;
  overflow: hidden;
  width: 3em;
  white-space: nowrap;
  cursor: pointer;
  text-indent: 9999px;
  content: "\2605";
  font-size: 1rem;
  &:before {
    display: inline-block;
    text-indent: -9999px;
    content: "\2606";
    color: #888;
  }
}
input {
  display: none;
}
</style>
