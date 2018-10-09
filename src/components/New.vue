<template>
  <v-container fluid>
    <v-card>
      <v-card-title primary-title>
        <div>
          <h3 class="headline mb-0">Добавление участника</h3>
          <div>Введите данные для занесения записи об участнике</div>
        </div>
      </v-card-title>
      <v-card-text>
        <v-text-field
          prepend-icon="mdi-account-card-details"
          label="ФИО"
          v-model="new_member.full_name"
        >
        </v-text-field>
        <v-combobox
          v-model="new_company"
          :items="records"
          :loading="isLoading"
          :search-input.sync="searchByCompany"
          hide-no-data
          hide-selected
          item-text="5"
          item-value="5"
          label="Место работы"
          placeholder="Введите данные для поиска"
          prepend-icon="mdi-database-search"
          clearable
        >
        </v-combobox>
        <v-text-field
          prepend-icon="mdi-account-details"
          label="Должность"
          v-model="new_member.position"
        >
        </v-text-field>
        <v-text-field
          prepend-icon="mdi-city-variant"
          label="Город"
          v-model="new_member.city"
        >
        </v-text-field>
        <v-text-field
          prepend-icon="mdi-phone"
          mask="+# (###) ### - ####"
          return-masked-value
          label="Контактный телефон"
          v-model="new_member.phone"
        >
        </v-text-field>
        <v-text-field
          prepend-icon="mdi-email"
          label="Электронный адрес"
          v-model="new_member.email"
        >
        </v-text-field>
        <v-select
          :items="statusList"
          prepend-icon="mdi-message-bulleted"
          label="Статус на мероприятии"
          v-model="new_member.status"
        ></v-select>
      </v-card-text>
      <v-card-actions>
        <v-btn color="light-blue darken-3 white--text" :disabled="!canAddNewMember" @click="addNewMember">Добавить <v-icon right>person_add</v-icon></v-btn>
        <v-btn color="grey lighten-1" @click="resetNewMember">Сброс <v-icon right>mdi-close-circle</v-icon></v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'

moment.locale('ru')

export default {
  name: 'NewRecord',
  data: () => ({
    isLoading: false,
    isError: false,

    new_member: null,
    new_company: '',

    records: [],
    searchByCompany: null
  }),
  computed: {
    statusList: function() {
      return this.$store.state.Member.statusList
    },
    canAddNewMember: function() {
      return (this.new_member.full_name && this.new_member.company && this.new_member.position && this.new_member.email && this.new_member.phone && this.new_member.city)
    }
  },
  watch: {
    searchByCompany: _.debounce(function (val) {
      if (! val || 3 > val.length || this.isLoading) 
        return

      if (this.new_member.company && this.new_member.company == val)
        return

      this.new_member.company = val
      this.isLoading = true

      this.$api({
        params: {
          filter: 'company,cs,'+val,
          order: 'company'
        }
      })
        .then(res => {
          this.records = res.data.member.records
        })
        .catch(err => {
          this.$store.commit('ERROR', err)
        })
        .finally(() => (this.isLoading = false))

    }, 500)
  },
  methods: {
    addNewMember: function() {
      let app = this
      let fio = this.new_member.full_name.split(' ')

      this.new_member.surname = fio[0]
      this.new_member.name = fio[1] || ''
      this.new_member.middle_name = fio[2] || ''
      this.new_member.on_event = 1
      
      this.new_member.date_register = moment().format("DD MMMM YYYY HH:mm")

      this.$api({
        method: 'post',
        data: this.new_member
      })
      .then(function (response) {
        let newId = response.data;

        app.$api({
          params: {
            filter: 'id,eq,'+newId
          }
        })
        .then(function (response) {
          app.resetNewMember()

          app.$store.commit('UPDATE_MEMBER', response.data.member.records[0])
          app.$router.push('member-page')
        })
        .catch(err => {
          this.$store.commit('ERROR', err)
        })
      })
      .catch(err => {
        this.$store.commit('ERROR', err)
      })
    },
    resetNewMember: function() {
      this.new_member = _.zipObject(this.$store.state.Member.memberColumns, new Array(this.$store.state.Member.memberColumns.length).fill(''))
      this.new_member.status = this.statusList[0]
    }
  },
  created: function () {
    this.resetNewMember()
  }
}
</script>
