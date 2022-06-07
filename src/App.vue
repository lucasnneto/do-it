<template>
  <v-app>
    <v-main>
      <HomeScreen />
    </v-main>
  </v-app>
</template>

<script>
import HomeScreen from "./components/HomeScreen";

export default {
  name: "App",

  components: {
    HomeScreen,
  },

  data: () => ({
    //
  }),
};
</script>
