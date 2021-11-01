import {createStore} from 'vuex'
import axios from 'axios'

export default createStore({
  state: {
    privateCourse: [],
    currencyTypes: {
      common: ['RUR', 'USD', 'EUR', 'BTC'],
      world: ['CAD', 'CHF', 'CZK', 'GBP', 'ILS', 'JPY', 'NOK', 'PLZ', 'SEK']
    },
    userCountry: ''
  },
  mutations: {
    setPrivateCourse(state, data) {
      state.privateCourse = data
    },
    setUserCountry(state, country) {
      state.userCountry = country
    }
  },
  actions: {
    async fetchCourse({state, commit, dispatch}, {currencyCodeOne, currencyCodeTwo}) {
      const needCommon = state.currencyTypes.common.includes(currencyCodeOne)
          || state.currencyTypes.common.includes(currencyCodeTwo)
      const needWorld = state.currencyTypes.world.includes(currencyCodeOne)
          || state.currencyTypes.world.includes(currencyCodeTwo)
      let result = []
      if (needCommon) {
        result = await dispatch('fetchPrivateCourse', 'common')
      }
      if (needWorld) {
        const data = await dispatch('fetchPrivateCourse', 'world')
        result = [...result, ...data]
      }
      commit('setPrivateCourse', result)
    },
    async fetchPrivateCourse(context, type) {
      const privateAPI = 'https://api.privatbank.ua/p24api/pubinfo'
      try {
        const {data} = await axios(privateAPI, {
          params: {
            exchange: true,
            json: true,
            coursid: type === 'world' ? 12 : 11
          }
        })
        return data
      } catch (e) {
        console.warn(e.message)
        return []
      }
    },
    fetchUserCountry({commit}) {
      const countryBy_IP_API = 'https://extreme-ip-lookup.com/json/'
      axios(countryBy_IP_API)
        .then(({data}) => {
          commit('setUserCountry', data.country)
        })
        .catch((data, status) => {
          console.log('fetchUserCountry Request failed')
        })
      // setTimeout(()=>{
      //   commit('setUserCountry', 'Ukraine')
      // }, 0)
    }
  },
  getters: {
    currencyObj: state => code => {
      return state.privateCourse.find(currency => currency.ccy === code)
    },
    currencyCoefficient: (state, getters) => (currencyCodeFrom, currencyCodeTo) => {
      if (currencyCodeFrom === 'UAN') {
        const currencyObj = getters.currencyObj(currencyCodeTo)
        return 1 / currencyObj.sale
      } else if (currencyCodeTo === 'UAN') {
        const currencyObj = getters.currencyObj(currencyCodeFrom)
        return currencyObj.buy
      } else {
        const currencyObjFrom = getters.currencyObj(currencyCodeFrom)
        const fromConvertedTo_UAN = currencyObjFrom.sale
        const currencyObjTo = getters.currencyObj(currencyCodeTo)
        return fromConvertedTo_UAN / currencyObjTo.buy
      }
    }
  },
  modules: {
  }
})
