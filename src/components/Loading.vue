<template>
  <v-container fluid>
    <v-card>
      <v-card-title primary-title>
        <div>
          <h3 class="headline mb-0">Получение данных</h3>
        </div>
      </v-card-title>
      <v-card-text>
        <div class="text-xs-center">
          <v-progress-circular v-if="isLoading"
            :size="40"
            color="primary"
            indeterminate
          ></v-progress-circular>
        </div>

        <div class="text-xs-center">
          <h3 class="headline mb-0" v-if="eventTitle">{{ eventTitle }}</h3>
          <p v-else>Идет загрузка данных...</p>
          <v-btn color="grey lighten-1" @click="loadConfig" :disabled="isLoading">Повторить <v-icon right>mdi-refresh</v-icon></v-btn>
        </div>
      </v-card-text>
    </v-card>

  </v-container>
</template>

<script>
import _ from 'lodash'

export default {
  data: () => ({
    isLoading: false,
    eventTitle: ''
  }),
  methods: {
    loadConfig() {
      this.isLoading = true
      this.eventTitle = ''

      this.$api({
        url: this.$store.state.Config.apiUrl + this.$store.state.Config.eventApiUrl,
        params: {
          sort: '-id'
        }
      })
        .then(res => {
          if (!_.isArray(res.data.data)) {
            this.$store.commit('ERROR', true)
            return false
          }

          let events = res.data.data
          let currentEvent = _.find(events, ['current', true])

          this.$store.commit('SET_EVENT_LIST', events)
          if (currentEvent) {
            this.eventTitle = currentEvent.title
            this.$store.commit('SET_EVENT_ID', currentEvent.id)
          }

          this.$router.push('member-page')
        })
        .catch(err => {
          this.$store.commit('ERROR', err)
        })
        .finally(() => (this.isLoading = false))
    }
  },
  mounted: function () {
      this.loadConfig()
  }
}
</script>