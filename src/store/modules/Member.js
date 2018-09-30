import Vue from 'vue'

const state = {
  member: null,
  memberColumns: ["id", "surname", "name", "middle_name", "full_name", "company", "position", "email", "phone", "birthday", "status", "date_register", "date_badge", "city", "code"]
}

const mutations = {
  UPDATE_MEMBER (state, member) {
    state.member = member
  },
  UPDATE_MEMBER_DATE_BAGE (state, val) {
    Vue.set(state.member, 12, val)
  }
}

export default {
  state,
  mutations
}
