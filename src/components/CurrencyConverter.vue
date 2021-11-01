<template>
  <div class="currency-converter">
    <h2 class="currency-converter__title">Currency Converter</h2>
    <div class="currency-converter__body">
      <div class="currency-converter__row">
        <div class="currency-converter__col">
          <SelectWithFlags
            ref="currencyOne"
            placeholder="select currency"
            :options="options"
            :object="true"
            @selection="(selectHandler($event, 'one'))"
          />
        </div>
        <div class="currency-converter__col">
          <MyInput
            type="number"
            placeholder="0.00"
            :modelValue="currency.one"
            focus
            @update:modelValue="inputHandler($event, 'one')"
          />
        </div>
      </div>
      <div class="currency-converter__row">
        <div class="col">
          <SelectWithFlags
            ref="currencyTwo"
            placeholder="select currency"
            :options="options"
            :object="true"
            @selection="(selectHandler($event, 'two'))"
          />
        </div>
        <div class="currency-converter__col">
          <MyInput
            type="number"
            placeholder="0.00"
            :modelValue="currency.two"
            @update:modelValue="inputHandler($event, 'two')"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import MyInput from '@@/UI/MyInput'
import SelectWithFlags from '@@/UI/SelectWithFlags'
import { mapState, mapGetters } from 'vuex'
import {debounce} from '../utils'
import {selectConfig} from '../data/selectConfig'

export default {
  name: 'CurrencyConverter',
  components: {MyInput, SelectWithFlags},
  data() {
    return {
      converterSchema: {
        from: 'one',
        to: 'two'
      },
      currency: {
        one: '',
        two: ''
      },
      select: {
        one: null,
        two: null
      },
      options: selectConfig
    }
  },
  computed: {
    ...mapState(['userCountry']),
    ...mapGetters(['currencyCoefficient']),
    isNeedCalculation() {
      return ((this.select.one !== null) && this.select.one.value)
        && ((this.select.two !== null) && this.select.two.value)
        && (this.currency.one || this.currency.two)
        && (this.select.one.value !== this.select.two.value)
    }
  },
  methods: {
    initSelectByUserCountry(country) {
      const res = this.options.find(currency => {
        return currency.fullName.includes(country)
      })
      if (res && res.value) {
        this.$refs.currencyOne.select(res.value)
        this.$refs.currencyTwo.select(res.value !== 'USD' ? 'USD' : 'EUR')
      } else if (!country || !(res && res.value)) {
        this.$refs.currencyOne.select('USD')
        this.$refs.currencyTwo.select('EUR')
      }
    },
    async selectHandler(event, selectName) {
      this.select[selectName] = {...event}
      if (!this.isNeedCalculation) return
      await this.fetchCourse()
      this.tryCalculate()
    },
    async inputHandler(value, fieldName) {
      this.currency[fieldName] = value
      this.converterSchema.from = fieldName
      this.converterSchema.to = fieldName === 'one' ? 'two' : 'one'
      if (!this.isNeedCalculation) return
      await this.debouncedFetchCourse()
      this.tryCalculate()
    },
    async debouncedFetchCourse() {},
    async fetchCourse() {
      const currency = {
        currencyCodeOne: this.select.one.value,
        currencyCodeTwo: this.select.two.value
      }
      return this.$store.dispatch('fetchCourse', currency)
    },
    tryCalculate() {
      const codeFrom = this.select[this.converterSchema.from].value
      const codeTo = this.select[this.converterSchema.to].value
      const currencyCoefficient = this.currencyCoefficient(codeFrom, codeTo)
      const result = Number.parseFloat(this.currency[this.converterSchema.from]) * currencyCoefficient
      const fixedStr = result.toFixed(codeTo === 'BTC' ? 6 : 4).toString()
      this.currency[this.converterSchema.to] = fixedStr
    }
  },
  watch: {
    userCountry: {
      handler: 'initSelectByUserCountry'
    }
  },
  created(){
    this.debouncedFetchCourse = debounce(this.fetchCourse, 30000, true)
  }
}
</script>
