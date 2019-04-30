<template>
  <div>
    <fieldset>
      <span>
        <span
          class="universal-ratings--item"
          v-for="item in 5"
          :key="`${id}--${item}`"
        >
          <input type="radio" :value="`${item}`" :checked="review >= item" />
          <label :for="`rating--${id}`"></label>
        </span>
        <span class="universal-ratings--total"
          >{{ totalReviews }} Reviews on Yelp</span
        >
      </span>
    </fieldset>
  </div>
</template>

<script>
export default {
  name: "UniversalRating",
  props: {
    id: { type: Number },
    review: { type: Number },
    totalReviews: { type: Number }
  }
};
</script>

<style lang="scss" scoped>
fieldset {
  border: none;
  padding-top: 0;
  &:before {
    content: "";
    border-top: 1px solid black;
    display: block;
    margin: 10px;
  }
}

.universal-ratings {
  &--item {
    & > input {
      display: none;
      & + label {
        overflow: hidden;
        width: 0.5em;
        white-space: nowrap;
        text-indent: 9999px;
        content: "\2605";
        font-size: 1rem;
        &:before {
          text-indent: -9999px;
          content: "\2606";
          color: #888;
        }
      }
      &:checked ~ label:before {
        content: "\2605";
        color: #d32323;
        text-shadow: 0 0 1px #333;
      }
    }
  }
  &--total {
    display: block;
    font-size: 13px;
  }
}
</style>
