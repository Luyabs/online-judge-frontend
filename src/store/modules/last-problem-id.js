const getDefaultState = () => {
  return {
    problemId: -1
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_PROBLEM_ID: (state, questionId) => {
    state.problemId = questionId
  }
}

const actions = {
  setProblemId({ commit, state }, data) {
    commit('SET_PROBLEM_ID', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

