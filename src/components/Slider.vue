<template>
  <div class="slider">
    <ul>
      <li v-for="(dat, ind) in yelpData" :key="`${ind}`">
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
            <span>{{ dat.properties.rating }}</span> |
            <span>{{ dat.properties.review_count }} reviews</span>
            <div>
              <a :href="stringifyAddress(dat)">Directions</a>
            </div>
          </div>
          <ReviewRatings
            v-if="ratings"
            :id="ind"
            :name="dat.properties.name"
            :priorRating="getRating(dat.properties.name)"
            @rating-selected="selectRating"
          />
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import ReviewRatings from "@/components/ReviewRatings.vue";
export default {
  name: "slider",
  props: {
    yelpData: { type: Array, required: false, default: () => [] },
    ratings: { type: Object, required: false, default: () => {} }
  },
  components: {
    ReviewRatings
  },
  methods: {
    getRating(val) {
      debugger;
      return this.ratings[val] ? this.ratings[val].rating : null;
    },
    stringifyAddress(data) {
      let name = data.properties.name.split(" ").join("+");
      let address = data.properties.location.address1.split(" ").join("+");
      return `https://www.google.com/maps/dir//${name},+${address},+${
        data.properties.location.city
      },+${data.properties.location.state},+${
        data.properties.location.zip_code
      }/@${data.geometry.coordinates[1]},${data.geometry.coordinates[0]},17z`;
    },
    selectRating(val) {
      this.$emit("rating-selected", val);
    }
  },
  mounted() {
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
