<template>
  <v-container fluid>
    <v-card>
      <v-card-title primary-title>
        <div>
          <h3 class="headline mb-0">Статистика по компании</h3>
          <div>Информация об участниках компаний</div>
        </div>
      </v-card-title>
      <v-card-text>
        <v-autocomplete
          v-model="company"
          :items="records"
          :loading="isLoading"
          :search-input.sync="search"
          hide-no-data
          hide-selected
          item-text="company"
          item-value="company"
          label="Название организации"
          placeholder="Введите данные для поиска"
          prepend-icon="mdi-office-building"
          clearable
        >
        </v-autocomplete>

        <template v-if="canDisplayList">
          <v-list subheader>
            <v-subheader>Кому распечатан бейдж ({{ recordsPrinted.length }})</v-subheader>
            <v-list-tile
              v-for="item in recordsPrinted"
              :key="item.id"
            >
              <v-list-tile-content>
                <v-list-tile-title v-text="item.full_name"></v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                  <v-icon color="green darken-3">check</v-icon>
                </v-list-tile-action>
            </v-list-tile>
          </v-list>

          <v-divider></v-divider>

          <v-list subheader>
            <v-subheader>Кто должен прийти ({{ recordsNotPrinted.length }})</v-subheader>
            <v-list-tile
              v-for="item in recordsNotPrinted"
              :key="item.id"
            >
              <v-list-tile-content>
                <v-list-tile-title v-text="item.full_name"></v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                  <v-icon color="red lighten-3">warning</v-icon>
                </v-list-tile-action>
            </v-list-tile>
          </v-list>
        </template>

      </v-card-text>
    </v-card>

    <v-spacer></v-spacer>

    <v-card class="mt-4">
      <v-card-title primary-title>
        <div>
          <h3 class="headline mb-0">Статистика по всем компаниям</h3>
          <div>Отчет по всем компаниям занесенным в базу</div>
        </div>
      </v-card-title>
      <v-card-text>
        <v-btn block color="light-blue darken-3 white--text" @click="downloadBadgeReport">Скачать полный отчет по компаниям</v-btn>
      </v-card-text>
    </v-card>

  </v-container>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'Statistics',
  data: () => ({
    isLoading: false,
    isError: false,

    records: [],
    canDisplayList: false,
    
    company: null,
    search: null
  }),
  computed: {
    badgeReportLink () {
      return this.$store.state.Config.appUrl+'/report/'+this.$store.state.Config.eventId+'/company'
    },
    recordsPrinted () {
      return _.reject(this.records, ['badge_log', ''])
    },
    recordsNotPrinted () {
      return _.filter(this.records, ['badge_log', ''])
    }
  },
  watch: {
    company (val) {
      if (! val)
        this.canDisplayList = false
    },
    search: _.debounce(function (val) {
      if (! val || 3 > val.length || this.isLoading) 
        return

      this.isLoading = true

      let companySelected = !!(this.company && this.company == val)
      let filter = companySelected ? 'eq' : 'like'
      let sortBy = companySelected ? 'full_name' : 'company'
      let pageSize = companySelected ? '50' : '20'

      this.$api({
          params: {
            ['filter[event][eq]']: this.$store.state.Config.eventId,
            ['filter[company]['+filter+']']: val,
            sort: sortBy,
            limit: pageSize
          }
        })
        .then(res => {
          this.records = res.data.data
          this.canDisplayList = companySelected
        })
        .catch(err => {
          this.$store.commit('ERROR', err)
        })
        .finally(() => (this.isLoading = false))
    }, 500)
  },
  methods: {
    downloadBadgeReport () {
      this.$root.$emit('app-download', this.badgeReportLink, 'Статистика по компаниям');
    }
  }
}
</script>