<template>
  <v-app>
    <v-main>
      <Header />
      <router-view :isMobile="isMobile"></router-view>
    </v-main>
  </v-app>
</template>

<script>
import Header from './components/Header';

export default {
  name: "App",
  components: {
    Header,
  },
  mounted() {
    window.onresize = this.getDimensions;
    this.$store.dispatch('getCategories');
    let script = document.createElement("script");

    script.src = "https://unpkg.com/default-passive-events";

    script.type = "text/javascript";

    document.head.appendChild(script);

  },
  methods: {
    getDimensions() {
      this.$store.state.screenWidth = window.innerWidth;
    }
  },
  computed: {
    isMobile() {
      return this.$store.getters.isMobile;
    }
  }
};
</script>

<style>
strong {
  display: flex;
  align-items: center;
}
</style>