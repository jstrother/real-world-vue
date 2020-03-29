<template>
  <div>
    <h1>Showing Event {{ id }}</h1>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: Number,
      default: 1,
    },
  },
};
</script>

<style scoped></style>
