<template>
  <div class="container">
    <CurrencyConverter/>
  </div>
</template>
<script>
import CurrencyConverter from '@@/CurrencyConverter'

export default {
  name: 'App',
  components: {CurrencyConverter},
  created() {
    this.$store.dispatch('fetchUserCountry')
  }
}
</script>
<style lang="scss">
  #app{
    background: url('./assets/img/bg.jpg') no-repeat;
    background-size: cover;
  }
  .container{
    max-width: 800px;
  }
</style>
