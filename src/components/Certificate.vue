<template>
  <v-container fluid>
    <v-card>
      <v-card-title primary-title>
        <div>
          <h3 class="headline mb-0">Печать сертификата</h3>
          <div>Введите данные для поиска участника и печати сертификата участника</div>
        </div>
      </v-card-title>
      <v-card-text>
        <v-autocomplete
          v-model="member"
          :items="records"
          :loading="isLoading"
          :search-input.sync="searchByName"
          hide-no-data
          hide-selected
          item-text="full_name"
          item-value="id"
          label="ФИО"
          placeholder="Введите данные для поиска"
          prepend-icon="mdi-database-search"
          return-object
          clearable
        >
        </v-autocomplete>
        <v-select
          v-model="printTpl"
          :items="printList"
          item-text="label"
          item-value="variant"
          label="Вариант печати"
          prepend-icon="mdi-settings"
        ></v-select>
      </v-card-text>
      <v-card-actions>
        <v-btn color="light-blue darken-3 white--text" :disabled="!memberView.id" @click="printBadge">Печать {{ 'certificate' == printTpl ? 'сертификата' : 'диплома' }} <v-icon right>print</v-icon></v-btn>
        <v-btn color="grey lighten-1" :disabled="!memberView.id" @click="member = null">Сброс <v-icon right>mdi-close-circle</v-icon></v-btn>
      </v-card-actions>
    </v-card>

  </v-container>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'VshouzRegs',
  data: () => ({
    isLoading: false,

    printList: [
        { label: 'Сертификат', variant: 'certificate' },
        { label: 'Диплом', variant: 'diploma' },
    ],
    printTpl: 'certificate',

    records: [],
    member: [],
    searchByName: null
  }),
  computed: {
    memberView () {
      if (! this.member) 
        return _.zipObject(this.$store.state.Member.memberColumns, new Array(this.$store.state.Member.memberColumns.length).fill(''))

      return this.member
    },
    isPrinting () {
      return this.$store.state.Config.isPrinting
    }
  },
  watch: {
    searchByName: _.debounce(function (val) {
      if (! val || 3 > val.length || this.isLoading) 
        return
      if (this.member && this.member.full_name == val)
        return

      this.doSearh('full_name', val)
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
        url: this.$store.state.Config.appUrl+'/print/'+this.printTpl+'/'+this.member.id,
        show: this.$store.state.Config.printShow,
        silent: false
      }

      this.$electron.ipcRenderer.send('print-badge', printParams)
      this.$store.commit('PRINTING')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
