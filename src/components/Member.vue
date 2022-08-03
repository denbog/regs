<template>
  <v-container fluid>
    <v-card>
      <v-card-title primary-title>
        <div>
          <h3 class="headline mb-0">Поиск по базе</h3>
          <div>Введите данные для поиска участника и распечатки бейджа</div>
        </div>
      </v-card-title>
      <v-card-text>
        <template v-if="editMode">
          <v-text-field
            prepend-icon="mdi-account-card-details"
            label="ФИО"
            v-model="memberEdit.full_name"
          >
          </v-text-field>
          <v-text-field
            prepend-icon="mdi-link"
            readonly
            label="ID (внутренний идентификатор участника)"
            :value="memberEdit.id"
          >
          </v-text-field>
          <v-text-field
            prepend-icon="mdi-briefcase"
            label="Компания"
            v-model="memberEdit.company"
          >
          </v-text-field>
          <v-text-field
            prepend-icon="mdi-account-details"
            label="Должность"
            v-model="memberEdit.position"
          >
          </v-text-field>
          <v-text-field
            prepend-icon="mdi-email"
            label="Электронный адрес"
            v-model="memberEdit.email"
          >
          </v-text-field>
          <v-text-field
            prepend-icon="mdi-phone"
            mask="+# (###) ###-####"
            return-masked-value
            label="Телефон"
            v-model="memberEdit.phone"
          >
          </v-text-field>
          <v-select
            :items="roleList"
            prepend-icon="mdi-message-bulleted"
            label="Статус на мероприятии"
            v-model="memberEdit.event_role"
          ></v-select>
        </template>

        <template v-else>
          <v-autocomplete
            v-model="member"
            :items="records"
            :loading="isLoading"
            :search-input.sync="searchByName"
            hide-no-data
            hide-selected
            item-text="full_name"
            item-value="0"
            label="ФИО"
            placeholder="Введите данные для поиска"
            prepend-icon="mdi-database-search"
            return-object
            clearable
          >
          </v-autocomplete>
          <v-text-field
            prepend-icon="mdi-link"
            readonly
            label="ID (внутренний идентификатор участника)"
            :value="memberView.event_num"
          >
          </v-text-field>
          
          <v-autocomplete
            v-model="member"
            :items="records"
            :loading="isLoading"
            :search-input.sync="searchByCompany"
            hide-no-data
            hide-selected
            item-text="company"
            item-value="0"
            label="Компания"
            placeholder="Введите данные для поиска"
            prepend-icon="mdi-database-search"
            return-object
            clearable
            :default="memberView.company"
          >
          </v-autocomplete>
          <v-text-field
            prepend-icon="mdi-account-details"
            readonly
            label="Должность"
            :value="memberView.position"
          >
          </v-text-field>
          <v-autocomplete
            v-model="member"
            :items="records"
            :loading="isLoading"
            :search-input.sync="searchByMail"
            hide-no-data
            hide-selected
            item-text="email"
            item-value="0"
            label="Электронный адрес"
            placeholder="Введите данные для поиска"
            prepend-icon="mdi-database-search"
            return-object
            clearable
            :default="memberView.email"
          >
          </v-autocomplete>
          <v-text-field
            prepend-icon="mdi-phone"
            readonly
            label="Телефон"
            :value="memberView.phone"
          >
          </v-text-field>
          <v-text-field
            prepend-icon="mdi-message-bulleted"
            readonly
            label="Статус на мероприятии"
            :value="memberRoleView"
          >
          </v-text-field>
        </template>
      </v-card-text>
      <v-card-actions>
        <template v-if="editMode">
          <v-btn color="green darken-3 white--text" :disabled="!canUpdateMember" @click="updateMember">Сохранить <v-icon right>mdi-content-save</v-icon></v-btn>
          <v-btn color="grey lighten-1" @click="editMode = false">Отмена <v-icon right>mdi-keyboard-return</v-icon></v-btn>
        </template>

        <template v-else>
          <v-btn color="light-blue darken-3 white--text" :disabled="!memberIsLoaded" @click="printBadge">Печать бейджа <v-icon right>print</v-icon></v-btn>
          <v-btn color="grey lighten-1" :disabled="!memberIsLoaded" @click="member = null">Сброс <v-icon right>mdi-close-circle</v-icon></v-btn>
          <v-btn color="green darken-3 white--text" :disabled="!memberIsLoaded" @click="enterEditMode">Изменить <v-icon right>mdi-account-edit</v-icon></v-btn>
          <v-spacer></v-spacer>
          <v-tooltip left>
            <v-btn 
              slot="activator"
              fab 
              dark
              :color="memberView.badge_log ? 'error' : 'success'"
              :disabled="!memberIsLoaded" 
              @click.native="sheetPrint = !sheetPrint"
            >
                <v-icon>print</v-icon>
            </v-btn>
            <span>{{ memberView.badge_log ? 'Распечатан' : 'Не распечатан' }}</span>
          </v-tooltip>

          <template v-if="memberRequestStatusView">
            &nbsp;
            <v-tooltip left>
              <v-btn 
                slot="activator"
                fab 
                dark
                :color="memberRequestStatusColor"
                @click.native="sheetStatus = !sheetStatus"
              >
                  <v-icon>attach_money</v-icon>
              </v-btn>
              <span>{{ memberRequestStatusView }}</span>
            </v-tooltip>
          </template>

          <template v-if="sameEmailRecords.length">
            &nbsp;
            <v-tooltip left>
              <v-btn 
                slot="activator"
                fab 
                dark
                color="error"
                @click.native="sheetEmail = !sheetEmail"
              >
                  <v-icon>email</v-icon>
              </v-btn>
              <span>E-mail не уникален</span>
            </v-tooltip>
          </template>

        </template>

      </v-card-actions>
    </v-card>

    <v-bottom-sheet v-model="sheetPrint">
      <v-card>
        <v-card-title primary-title>
          <div class="headline">История печати</div>
        </v-card-title>
        <v-card-text>
          <pre>{{ memberView.badge_log ? memberView.badge_log : 'Печать не проводилась' }}</pre>
        </v-card-text>
      </v-card>
    </v-bottom-sheet>

    <v-bottom-sheet v-model="sheetStatus">
      <v-card>
        <v-card-title primary-title>
          <div class="headline">Данные заявки на сайте</div>
        </v-card-title>
        <v-card-text>
          
          <v-text-field
            prepend-icon="mdi-link"
            readonly
            label="Номер заявки"
            :value="memberView.request_id"
          >
          </v-text-field>
          <v-select
            :items="requestStatusList"
            prepend-icon="mdi-message-bulleted"
            label="Статус заявки на сайте"
            v-model="memberRequestStatus"
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-btn color="green darken-3 white--text" :disabled="memberRequestStatus == memberView.request_status" @click="updateMemberRequestStatus">Сохранить <v-icon right>mdi-content-save</v-icon></v-btn>
          <v-btn color="grey lighten-1" @click="sheetStatus = false">Отмена <v-icon right>mdi-keyboard-return</v-icon></v-btn>
        </v-card-actions>
      </v-card>
    </v-bottom-sheet>

    <v-bottom-sheet v-model="sheetEmail">
      <v-card>
        <v-card-title primary-title>
          <div class="headline">На данный e-mail зарегистрированны</div>
        </v-card-title>
        <v-card-text>
          <v-list>
            <v-list-tile
              v-for="item in sameEmailRecords"
              :key="item.id"
            >
              <v-list-tile-content>
                <v-list-tile-title v-text="item.full_name"></v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-card-text>
      </v-card>
    </v-bottom-sheet>

  </v-container>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'

export default {
  name: 'VshouzRegs',
  data: () => ({
    isLoading: false,
    editMode: false,

    sheetPrint: false,
    sheetEmail: false,
    sheetStatus: false,

    records: [],
    sameEmailRecords: [],
    searchByName: null,
    searchByMail: null,
    searchByCompany: null,

    memberEdit: null,
    memberRequestStatus: null
  }),
  computed: {
    member: {
      get () {
        return this.$store.state.Member.member
      },
      set (value) {
        this.$store.commit('UPDATE_MEMBER', value)
      }
    },
    memberIsLoaded () {
      return (this.$store.state.Member.member && _.has(this.$store.state.Member.member, 'id')) 
    },
    memberView () {
      if (! this.$store.state.Member.member) 
        return _.zipObject(this.$store.state.Member.memberColumns, new Array(this.$store.state.Member.memberColumns.length).fill(''))

      return this.$store.state.Member.member
    },
    memberRoleView () {
      return !this.memberIsLoaded
        ? '' 
        : _.get(_.find(this.$store.state.Member.roleList, ['value', this.$store.state.Member.member.event_role]), 'text', '')
    },

    memberRequestStatusView () {
      return !(this.memberIsLoaded && this.$store.state.Member.member.request_status)
        ? '' 
        : _.get(_.find(this.$store.state.Member.requestStatusList, ['value', this.$store.state.Member.member.request_status]), 'text', '')
    },
    memberRequestStatusColor () {
      let color = 'error'

      if (this.memberIsLoaded && this.$store.state.Member.member.request_status) {
        if (-1 !== _.indexOf(this.$store.state.Member.requestStatusSuccess, this.$store.state.Member.member.request_status)) {
          color = 'success'
        } else if (-1 !== _.indexOf(this.$store.state.Member.requestStatusWarning, this.$store.state.Member.member.request_status)) {
          color = 'warning'
        }
      }

      return color
    },

    roleList: function() {
      return this.$store.state.Member.roleList
    },
    requestStatusList: function() {
      return this.$store.state.Member.requestStatusList
    },

    canUpdateMember: function() {
      return (this.editMode && this.memberEdit.full_name && this.memberEdit.company)
    }
  },
  watch: {
    member: function() {
      this.sameEmailRecords = []

      if (this.memberIsLoaded) {
        this.$api({
            params: {
              ['filter[event][eq]']: this.$store.state.Config.eventId,
              ['filter[id][neq]']: this.$store.state.Member.member.id,
              ['filter[email][eq]']: this.$store.state.Member.member.email,
              sort: 'full_name'
            }
          })
          .then(res => {
            this.sameEmailRecords = res.data.data
          })
      }
    },
    sheetStatus: function () {
      this.memberRequestStatus = this.$store.state.Member.member ? this.$store.state.Member.member.request_status : null
    },
    searchByName: _.debounce(function (val) {
      if (! val || 3 > val.length || this.isLoading) 
        return
      if (this.$store.state.Member.member && this.$store.state.Member.member.full_name == val)
        return

      this.doSearh('full_name', val)
    }, 500),
    searchByMail: _.debounce(function (val) {
      if (! val || 3 > val.length || this.isLoading) 
        return
      if (this.member && this.member.email == val)
        return

      this.doSearh('email', val)
    }, 500),
    searchByCompany: _.debounce(function (val) {
      if (! val || 3 > val.length || this.isLoading) 
        return

      if (this.member && this.member.company == val)
        return

      this.doSearh('company', val)
    }, 500)
  },
  methods: {
    doSearh: function(field, val) {
      this.isLoading = true

      this.$api({
        params: {
          ['filter[event][eq]']: this.$store.state.Config.eventId,
          ['filter['+field+'][like]']: val,
          sort: 'full_name'
        }
      })
        .then(res => {
          this.records = res.data.data
        })
        .catch(err => {
          this.$store.commit('ERROR', err)
        })
        .finally(() => (this.isLoading = false))
    },
    printBadge: function() {
      let printParams = {
        url: this.$store.state.Config.appUrl+'/print/badge/'+this.member.id,
        show: this.$store.state.Config.printShow,
        silent: this.$store.state.Config.printSilent
      }

      this.$electron.ipcRenderer.send('print-badge', printParams)
      this.$store.commit('PRINTING')

      let memberBadgeLog = moment().format("DD MMMM YYYY HH:mm") + (this.member.badge_log ? "\n" + this.member.badge_log : '')

      this.$api({
        url: '/' + this.member.id,
        method: 'PATCH',
        data: {
          badge_log: memberBadgeLog
        }
      })
        .then((res) => {
          this.$store.commit('UPDATE_MEMBER_BAGE_LOG', res.data.data.badge_log)
        })
        .catch(err => {
          this.$store.commit('ERROR', err)
        })
    },

    enterEditMode: function() {
      this.memberEdit = _.clone(this.$store.state.Member.member)
      this.editMode = true
    },
    updateMember: function() {
      this.memberEdit.full_name = this.memberEdit.full_name.replace(/\s{2,}/g, ' ')

      let fio = this.memberEdit.full_name.split(' ')
      this.memberEdit.surname = fio[0]
      this.memberEdit.name = fio[1] || ''
      this.memberEdit.middle_name = fio[2] || ''

      this.$api({
        method: 'PATCH',
        url: '/' + this.member.id,
        data: this.memberEdit
      })
        .then((res) => {
          if (res.data.data &&  _.has(res.data.data, 'id')) {
            this.member = res.data.data
            this.records = [res.data.data]
            this.editMode = false
          } else {
            this.$store.commit('ERROR', 'Ошибка обновления')
          }
        })
        .catch(err => {
          this.$store.commit('ERROR', err)
        })
    },
    updateMemberRequestStatus: function() {
      this.$api({
        method: 'PATCH',
        url: '/' + this.member.id,
        data: {
          request_status: this.memberRequestStatus
        }
      })
        .then((res) => {
          if (res.data.data &&  _.has(res.data.data, 'id')) {
            this.member = res.data.data
          } else {
            this.$store.commit('ERROR', 'Ошибка обновления')
          }
        })
        .catch(err => {
          this.$store.commit('ERROR', err)
        })
    }
  },
  mounted: function () {
    if (this.$store.state.Member.member)
      this.records = [this.$store.state.Member.member]
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
