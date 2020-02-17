const state = () => ({
  position: {}, // 一进来的城市信息
  city: '' // 这个是切换的城市
})

const getters = {
  getPositionCity(state) {
    return state.position.city
  },
  getCity(state) {
    return state.city
  }
}

const mutations = {
  setPosition(state, val) {
    state.position = val
  },
  setCity(state, val) {
    // console.log(val)
    state.city = val
  }
}

const actions = {
  setPosition({commit}, position) {
    commit('setPosition', position)
  },
  setCity({commit}, position) {
    // console.log(val)
    commit('setCity', position)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
