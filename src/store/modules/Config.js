const state = {
  printShow: false,
  printSilent: true,
  //serverUrl: 'http://oz19.rubaton.ru',
  serverUrl: 'http://rosmed',

  isError: false,
  isPrinting: false
}

const mutations = {
  SET_PRINT_SHOW (state, value) {
    state.printShow = value
  },
  SET_PRINT_SILENT (state, value) {
    state.printSilent = value
  },
  SET_SERVER_URL (state, value) {
    state.serverUrl = value
  },
  PRINTING (state) {
    state.isPrinting = true
  },
  PRINTING_DONE (state) {
    state.isPrinting = false
  },
  ERROR (state, value) {
    state.isError = value
  }
}

export default {
  state,
  mutations
}