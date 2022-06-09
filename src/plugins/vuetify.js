import Vue from "vue";
import Vuetify from "vuetify/lib/framework";
import "@/assets/index.scss";

Vue.use(Vuetify);

export default new Vuetify({
  breakpoint: {
    mobileBreakpoint: "sm",
  },
  theme: {
    dark: true,
    themes: {
      dark: {
        primary: "#a3ff00",
        secondary: "#188c00",
        background: "#18181b",
      },
    },
  },
});
