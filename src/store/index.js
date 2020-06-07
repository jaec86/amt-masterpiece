import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    overlayPos: 'right'
  },
  mutations: {
    setOverlayPos (state, side = null) {
      state.overlayPos = side
    }
  },
  actions: {
    moveOverlay ({ commit }, side) {
      commit('setOverlayPos', side)
      setTimeout(() => {
        commit('setOverlayPos')
      }, 1500)
    }
  }
})
