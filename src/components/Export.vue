<template>
  <v-container fluid>
    <v-card>
      <v-card-title primary-title>
        <div>
          <h3 class="headline mb-0">Экспорт для мобильного приложения</h3>
          <div>Загрузка отчета по участникам конференции для мобильного приложения</div>
        </div>
      </v-card-title>
      <v-card-text>
        <v-switch
          :label="`${eventiciosOnEvent ? 'Отчет по добавленым в программу' : 'Отчет по всеми участниками'}`"
          v-model="eventiciosOnEvent"
        ></v-switch>
        <v-btn block color="light-blue darken-3 white--text" :href="eventiciosLink">Скачать отчет</v-btn>
      </v-card-text>
    </v-card>

    <v-card class="mt-4">
      <v-card-title primary-title>
        <div>
          <h3 class="headline mb-0">Экспорт всей базы</h3>
          <div>Загрузка отчета по всем участникам конференции</div>
        </div>
      </v-card-title>
      <v-card-text>
        <v-btn block color="blue-grey darken-1 white--text" :href="fullReportLink">Скачать отчет</v-btn>
      </v-card-text>
    </v-card>

  </v-container>
</template>

<script>
export default {
  name: 'Export',
  data: () => ({
    eventiciosOnEvent: true
  }),
  computed: {
    eventiciosLink () {
      return this.$store.state.Config.serverUrl + '/report/?tpl=mobile&on_event=' + (this.eventiciosOnEvent ? 1 : 0)
    },
    fullReportLink () {
      return this.$store.state.Config.serverUrl + '/report/?tpl=full'
    }
  }
}
</script>
