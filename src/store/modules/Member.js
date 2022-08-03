import Vue from 'vue'

const state = {
  member: null,
  memberColumns: ["id", "surname", "name", "middle_name", "full_name", "company", "position", "email", "phone", "city", "event_role", "badge_log", "request_id", "request_status"],
  roleList: [
    {value: 'member', text: 'Участник'},
    {value: 'speaker', text: 'Докладчик'},
    {value: 'smi', text: 'СМИ'},
    {value: 'sponsor', text: 'Экспонент/Спонсор'},
    {value: 'organizer', text: 'Организатор'}
  ],
  requestStatusList: [
    {value: 'payment-data', text: 'Новая заявка'},
    {value: 'in-payment', text: 'Ожидается оплата'},
    {value: 'payed', text: 'Оплачен'},
    {value: 'partial-payment', text: 'Частичная оплата'},
    {value: 'quota', text: 'Квота'},
    {value: 'deleted', text: 'Удален'}
  ],
  requestStatusSuccess: ['payed', 'quota'],
  requestStatusWarning: ['partial-payment']
}

const mutations = {
  UPDATE_MEMBER (state, member) {
    state.member = member
  },
  UPDATE_MEMBER_BAGE_LOG (state, val) {
    Vue.set(state.member, 'badge_log', val)
  }
}

export default {
  state,
  mutations
}
