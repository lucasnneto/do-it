<template>
  <div style="position: relative; height: 30px; width: 100%">
    <div
      style="position: absolute; width: 100%; height: 30px"
      :style="`border: 1px solid ${$vuetify.theme.themes.dark.primary}`"
    ></div>
    <div
      style="position: absolute; height: 30px; transition: all 0.3s"
      class="primary"
      :style="{ width: `${level}%` }"
    ></div>
    <div
      style="position: absolute; width: 100%; height: 100%"
      class="d-flex justify-center align-center"
    >
      <p class="ma-0 secondary--text">{{ Math.ceil(level) }}%</p>
    </div>
  </div>
</template>

<script>
export default {
  props: { level: { default: 0 } },
};
</script>

<style></style>
