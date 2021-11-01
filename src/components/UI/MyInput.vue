<template>
  <input
    class="my-input"
    ref="input"
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    @keydown="keyDownHandler"
    @input="inputHandler"
  >
</template>
<script>
export default {
  name: 'MyInput',
  props: {
    type: {type: String, default: 'text'},
    modelValue: {type: [String, Number]},
    placeholder: {type: String, default: '...'},
    focus: {type: Boolean}
  },
  methods: {
    numbersOnly(event) {
      const {keyCode} = event
      const isNotNumber = keyCode < 48 || keyCode > 57
      const isNotDot = keyCode !== 190
      const isNotControls = (keyCode !== 8) && (keyCode !== 37) && (keyCode !== 39)
      if (isNotNumber && isNotDot && isNotControls) {
        event.preventDefault()
      }
    },
    keyDownHandler(event) {
      if (this.type === 'number') {
        // need preventDefault() for 1212e10 numbers
        // input not cancelable
        this.numbersOnly(event)
      }
    },
    inputHandler(event) {
      const value = event.target.value
      const key = event.data
      if (this.type === 'number' && !value) return
      // 1212. = not valid value for event.target.value = undefined
      // prevent emit in that case
      this.$emit('update:modelValue', value)
    }
  },
  mounted(){
    if (this.focus) this.$refs.input.focus()
  }
}
</script>
