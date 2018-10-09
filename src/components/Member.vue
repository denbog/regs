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
            mask="+# (###) ### - ####"
            return-masked-value
            label="Телефон"
            v-model="memberEdit.phone"
          >
          </v-text-field>
          <v-select
            :items="statusList"
            prepend-icon="mdi-message-bulleted"
            label="Статус на мероприятии"
            v-model="memberEdit.status"
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
            item-text="4"
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
            :value="memberView.id"
          >
          </v-text-field>
          
          <v-autocomplete
            v-model="member"
            :items="records"
            :loading="isLoading"
            :search-input.sync="searchByCompany"
            hide-no-data
            hide-selected
            item-text="5"
            item-value="0"
            label="Компания"
            placeholder="Введите данные для поиска"
            prepend-icon="mdi-database-search"
            return-object
            clearable
            :default="memberView.company"
          >
            <template
              slot="item"
              slot-scope="{ item, tile }"
            >
              {{ item[4] }}
            </template>
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
            item-text="7"
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
            :value="memberView.status"
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
          <v-btn color="light-blue darken-3 white--text" :disabled="!memberView.id" @click="printBadge">Печать бейджа <v-icon right>print</v-icon></v-btn>
          <v-btn color="grey lighten-1" :disabled="!memberView.id" @click="member = null">Сброс <v-icon right>mdi-close-circle</v-icon></v-btn>
          <v-btn color="green darken-3 white--text" :disabled="!memberView.id" @click="enterEditMode">Изменить <v-icon right>mdi-account-edit</v-icon></v-btn>
          <v-spacer></v-spacer>
          <v-tooltip left>
            <v-btn 
              slot="activator"
              fab 
              dark
              :color="memberView.date_badge ? 'error' : 'success'"
              :disabled="!memberView.id" 
              @click.native="sheet = !sheet"
            >
                <v-icon>print</v-icon>
            </v-btn>
            <span>{{ memberView.date_badge ? 'Распечатан' : 'Не распечатан' }}</span>
          </v-tooltip>
        </template>

      </v-card-actions>
    </v-card>

    <v-bottom-sheet v-model="sheet">
      <v-card>
        <v-card-title primary-title>
          <div class="headline">История печати</div>
        </v-card-title>
        <v-card-text>
          <pre>{{ memberView.date_badge ? memberView.date_badge : 'Печать не проводилась' }}</pre>
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
    sheet: false,
    editMode: false,

    records: [],
    searchByName: null,
    searchByMail: null,
    searchByCompany: null,

    memberEdit: null,
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
    memberView () {
      if (! this.$store.state.Member.member) 
        return _.zipObject(this.$store.state.Member.memberColumns, new Array(this.$store.state.Member.memberColumns.length).fill(''))

      return _.zipObject(this.$store.state.Member.memberColumns, this.$store.state.Member.member)
    },
    statusList: function() {
      return this.$store.state.Member.statusList
    },
    canUpdateMember: function() {
      return (this.editMode && this.memberEdit.full_name && this.memberEdit.company && this.memberEdit.position && this.memberEdit.email && this.memberEdit.phone)
    }
  },
  watch: {
    searchByName: _.debounce(function (val) {
      if (! val || 3 > val.length || this.isLoading) 
        return
      if (this.$store.state.Member.member && this.$store.state.Member.member[4] == val)
        return

      this.doSearh('full_name', val)
    }, 500),
    searchByMail: _.debounce(function (val) {
      if (! val || 3 > val.length || this.isLoading) 
        return
      if (this.member && this.member[7] == val)
        return

      this.doSearh('email', val)
    }, 500),
    searchByCompany: _.debounce(function (val) {
      if (! val || 3 > val.length || this.isLoading) 
        return

      if (this.member && this.member[5] == val)
        return

      this.doSearh('company', val)
    }, 500)
  },
  methods: {
    doSearh: function(field, val) {
      this.isLoading = true

      this.$api({
        params: {
          filter: field+',cs,'+val,
          order: 'full_name'
        }
      })
        .then(res => {
          this.records = res.data.member.records
        })
        .catch(err => {
          this.$store.commit('ERROR', err)
        })
        .finally(() => (this.isLoading = false))
    },
    printBadge: function() {
      let printParams = {
        url: this.$store.state.Config.serverUrl+'/print/index.php?id='+this.member[0]+'&tpl=badge',
        show: this.$store.state.Config.printShow,
        silent: this.$store.state.Config.printSilent
      }

      this.$electron.ipcRenderer.send('print-badge', printParams)
      this.$store.commit('PRINTING')

      let memberDateBadge = moment().format("DD MMMM YYYY HH:mm") + (this.member[12] ? "\n" + this.member[12] : '')

      this.$store.commit('UPDATE_MEMBER_DATE_BAGE', memberDateBadge)

      this.$api({
        url: '/' + this.member[0],
        method: 'put',
        data: {
          date_badge: memberDateBadge
        }
      })
        .then(() => {
          this.$store.commit('UPDATE_MEMBER_DATE_BAGE', memberDateBadge)
        })
        .catch(err => {
          this.$store.commit('ERROR', err)
        })
    },

    enterEditMode: function() {
      this.memberEdit = _.zipObject(this.$store.state.Member.memberColumns, this.$store.state.Member.member)
      this.editMode = true
    },
    updateMember: function() {
      let fio = this.memberEdit.full_name.split(' ')

      this.memberEdit.surname = fio[0]
      this.memberEdit.name = fio[1] || ''
      this.memberEdit.middle_name = fio[2] || ''

      this.$api({
        method: 'put',
        url: '/' + this.member[0],
        data: this.memberEdit
      })
        .then((res) => {
          if (1 == res.data) {
            this.member = _.values(this.memberEdit)
            this.records = [_.values(this.memberEdit)]
            this.editMode = false
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
