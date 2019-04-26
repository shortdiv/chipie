<template>
  <div>
    <span>My Rating:</span>
    <form>
      <fieldset>
        <span class="ratings-group">
          <input
            type="radio"
            :name="`rating-${id}`"
            :id="`rating--5-${id}`"
            value="5"
            v-model="rating"
          />
          <label :for="`rating--5-${id}`"></label>
          <input
            type="radio"
            :name="`rating-${id}`"
            :id="`rating--4-${id}`"
            value="4"
            v-model="rating"
          />
          <label :for="`rating--4-${id}`"></label>
          <input
            type="radio"
            :name="`rating-${id}`"
            :id="`rating--3-${id}`"
            value="3"
            v-model="rating"
          />
          <label :for="`rating--3-${id}`"></label>
          <input
            type="radio"
            :name="`rating-${id}`"
            :id="`rating--2-${id}`"
            value="2"
            v-model="rating"
          />
          <label :for="`rating--2-${id}`"></label>
          <input
            type="radio"
            :name="`rating-${id}`"
            :id="`rating--1-${id}`"
            value="1"
            v-model="rating"
          />
          <label :for="`rating--1-${id}`"></label>
        </span>
      </fieldset>
    </form>
  </div>
</template>

<script>
export default {
  props: {
    id: { type: Number },
    name: { type: String },
    priorRating: { type: String }
  },
  data() {
    return {
      rating: null
    };
  },
  watch: {
    rating() {
      this.$emit("rating-selected", { name: this.name, rating: this.rating });
    }
  },
  mounted() {
    this.rating = this.priorRating;
  }
};
</script>

<style lang="scss">
fieldset {
  border: none;
  padding-top: 0;
}
.ratings-group {
  direction: rtl;
  unicode-bidi: bidi-override;
  & > input {
    display: none;
    & + label {
      overflow: hidden;
      width: 0.5em;
      white-space: nowrap;
      cursor: pointer;
      text-indent: 9999px;
      content: "\2605";
      font-size: 1rem;
      &:before {
        text-indent: -9999px;
        content: "\2606";
        color: #888;
      }
    }
    &:checked ~ label:before,
    & + label:hover ~ label:before,
    & + label:hover:before {
      content: "\2605";
      color: #e52;
      text-shadow: 0 0 1px #333;
    }
  }
}
</style>
