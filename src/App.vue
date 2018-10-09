<template>
  <v-app>
    <v-toolbar
      app
      clipped-left
    >
      <v-btn icon to="/new">
        <v-icon>person_add</v-icon>
      </v-btn>
      <v-btn icon to="/">
        <v-icon>folder_shared</v-icon>
      </v-btn>
      <v-btn icon to="/statistics">
        <v-icon>mdi-information-outline</v-icon>
      </v-btn>
      <v-btn icon to="/export">
        <v-icon>import_export</v-icon>
      </v-btn>
      <v-btn icon to="/certificate">
        <v-icon>mdi-certificate</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>settings</v-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
      <router-view></router-view>
    </v-content>
    <v-navigation-drawer
      dark
      right
      v-model="rightDrawer"
      width="450"
      fixed
      app
    >
      <v-toolbar flat>
        <v-list>
          <v-list-tile>
            <v-list-tile-title class="title">
              Настройки
            </v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-toolbar>
      <v-card tile flat>
        <v-card-text>
          <v-switch
            :label="`${printSilent ? 'Быстрая печать' : 'Печать с настройками'}`"
            v-model="printSilent"
          ></v-switch>
          <v-switch
            :label="`${printShow ? 'Показ окна печати бейджа' : 'Скрывать окно печати бейджа'}`"
            v-model="printShow"
          ></v-switch>

          <v-text-field
            append-icon="mdi-server-network"
            color="white"
            label="Сервер доступа к API"
            v-model="serverUrl"
            :rules="[rules.required]"
          >
          </v-text-field>
        </v-card-text>
      </v-card>
    </v-navigation-drawer>
    <v-footer class="pa-3" fixed app>
      <div>{{ datenow }}</div>
      <v-spacer></v-spacer>
      <div>Vshouz &copy; 2018</div>
    </v-footer>

    <v-dialog 
      v-model="isError"
      max-width="290"
    >
      <v-card
        color="red lighten-2"
        dark
      >
        <v-card-title class="headline">Ошибка</v-card-title>

        <v-card-text>
          Во время выполнения приложения произошла ошибка
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="white"
            flat="flat"
            @click="isError = false"
          >
            Закрыть
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="isDownloading"
      persistent
      width="300"
    >
      <v-card
        color="light-blue lighten-1"
        dark
      >
        <v-card-text>
          Идет загрузка файла
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="isPrinting"
      persistent
      width="300"
    >
      <v-card
        color="light-blue lighten-1"
        dark
      >
        <v-card-text>
          Идет печать
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>

  </v-app>
</template>

<script>
import moment from 'moment'

moment.locale('ru')

export default {
  name: 'App',
  data () {
    return {
      title: 'РОСМЕДОБР-2018',
      rightDrawer: false,
      datenow: '',

      isDownloading: false,
      
      rules: {
        required: value => !!value || 'Обязательное поле'
      }
    }
  },
  computed: {
    isError: {
      get () {
        return this.$store.state.Config.isError
      },
      set (value) {
        this.$store.commit('ERROR', value)
      }
    },
    isPrinting () {
      return this.$store.state.Config.isPrinting
    },
    printSilent: {
      get () {
        return this.$store.state.Config.printSilent
      },
      set (value) {
        this.$store.commit('SET_PRINT_SILENT', value)
      }
    },
    printShow: {
      get () {
        return this.$store.state.Config.printShow
      },
      set (value) {
        this.$store.commit('SET_PRINT_SHOW', value)
      }
    },
    serverUrl: {
      get () {
        return this.$store.state.Config.serverUrl
      },
      set (value) {
        this.$store.commit('SET_SERVER_URL', value)
        this.$api.defaults.baseURL = value + '/api/member'
      }
    }
  },
  methods: {
    time() {
      var app = this
      this.datenow = moment().format("DD MMMM YYYY HH:mm:ss")
      setTimeout(app.time, 1000)
    }
  },
  created: function () {
    this.$api.defaults.baseURL = this.$store.state.Config.serverUrl + '/api/member'

    this.$electron.ipcRenderer.on('print-badge-closed', () => {
      this.$store.commit('PRINTING_DONE')
    })

    this.$electron.ipcRenderer.on('file-download-start', () => {
      this.isDownloading = true
    })
    this.$electron.ipcRenderer.on('file-download-end', () => {
      this.isDownloading = false
    })
  },
  mounted: function() {
    this.time()
  }
}
</script>

<style>
  html {
    overflow-y: auto;
  }
  .v-toolbar .v-btn .v-icon {
    font-size: 30px;
  }
</style>