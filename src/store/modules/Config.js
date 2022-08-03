const state = {
  printShow: false,
  printSilent: true,

  //apiUrl: 'http://directus',
  //appUrl: 'http://events',
  apiUrl: 'http://api.rubaton.ru',
  appUrl: 'http://app.rubaton.ru',

  apiAccessToken: 'kmWm1OyKpH49yKMV3b_N55hMaVmYyAW__ZCj3_PRs2E',

  eventApiUrl: '/_/items/event',
  filesApiUrl: '/_/files',
  participantsApiUrl: '/_/items/event_participants',

  eventId: 0,
  eventList: [],

  isError: false,
  isPrinting: false,
  isDowloading: false
}

const mutations = {
  SET_PRINT_SHOW (state, value) {
    state.printShow = value
  },
  SET_PRINT_SILENT (state, value) {
    state.printSilent = value
  },
  SET_API_URL (state, value) {
    state.apiUrl = value
  },
  SET_APP_URL (state, value) {
    state.appUrl = value
  },
  PRINTING (state) {
    state.isPrinting = true
  },
  PRINTING_DONE (state) {
    state.isPrinting = false
  },
  ERROR (state, value) {
    state.isError = value
  },
  SET_EVENT_ID (state, value) {
    state.eventId = value
  },
  SET_EVENT_LIST (state, value) {
    state.eventList = value
  }
}

export default {
  state,
  mutations
}