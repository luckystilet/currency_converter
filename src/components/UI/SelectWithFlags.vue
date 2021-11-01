<template>
  <Multiselect
    @update:modelValue="$emit('selection', $event)"
    ref="multiSelect"
  >
    <template v-slot:singlelabel="{ value }">
      <div class="multiselect-single-label">
        <country-flag :country='value.flag' class="character-label-icon"/>
        {{ value.label }}
      </div>
    </template>
    <template v-slot:option="{ option }">
      <country-flag :country='option.flag' class="character-option-icon"/>
      <template v-if="!option.flag">
        <div style="width: 100%;margin-left: 52px;">{{ option.label }}</div>
      </template>
      <template v-else>{{ option.label }}</template>
    </template>
  </Multiselect>
</template>
<script>
import Multiselect from '@vueform/multiselect'
import CountryFlag from 'vue-country-flag-next'

export default {
  name: 'SelectWithFlags',
  components: { Multiselect, CountryFlag },
  methods: {
    select(value) {
      this.$refs.multiSelect.select(value)
    }
  }
}
</script>
