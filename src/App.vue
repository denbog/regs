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
          <v-img v-if="logo"
            :src="logo"
            aspect-ratio="1"
            class="grey lighten-2"
            contain
            max-width="200px"
          ></v-img>
          <v-switch
            :label="`${printSilent ? 'Быстрая печать' : 'Печать с настройками'}`"
            v-model="printSilent"
          ></v-switch>
          <v-switch
            :label="`${printShow ? 'Показ окна печати бейджа' : 'Скрывать окно печати бейджа'}`"
            v-model="printShow"
          ></v-switch>

          <v-text-field
            prepend-icon="mdi-server-network"
            color="white"
            label="Сервер доступа к API"
            v-model="apiUrl"
            :rules="[rules.required]"
          >
          </v-text-field>
          <v-text-field
            prepend-icon="mdi-server-network"
            color="white"
            label="Сервер приложения"
            v-model="appUrl"
            :rules="[rules.required]"
          >
          </v-text-field>

          <v-select
            :items="eventList"
            prepend-icon="mdi-web"
            label="Использовать мероприятие"
            v-model="eventId"
          ></v-select>

          <v-btn color="red lighten-1" to="/loading">Обновить настройки <v-icon right>mdi-refresh</v-icon></v-btn>
        </v-card-text>
      </v-card>
    </v-navigation-drawer>
    <v-footer class="pa-3" fixed app>
      <div>{{ datenow }}</div>
      <v-spacer></v-spacer>
      <div>Vshouz &copy; 2019</div>
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
import _ from 'lodash'
import moment from 'moment'
import { setTimeout } from 'timers';

moment.locale('ru')

export default {
  name: 'App',
  data () {
    return {
      title: '',
      logo: false,

      rightDrawer: false,
      datenow: '',

      isDownloading: false,
      
      rules: {
        required: value => !!value || 'Обязательное поле'
      }
    }
  },
  computed: {
    eventId: {
      get () {
        return this.$store.state.Config.eventId
      },
      set (value) {
        this.$store.commit('SET_EVENT_ID', value)
      }
    },
    eventList () {
      return !this.$store.state.Config.eventList.length
        ? []
        : _.map(this.$store.state.Config.eventList, function(event) { 
            return {
              value: event.id, 
              text: event.title
            }
          })
    },
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
    appUrl: {
      get () {
        return this.$store.state.Config.appUrl
      },
      set (value) {
        this.$store.commit('SET_APP_URL', value)
      }
    },
    apiUrl: {
      get () {
        return this.$store.state.Config.apiUrl
      },
      set (value) {
        this.$store.commit('SET_API_URL', value)
        this.$api.defaults.baseURL = value + this.$store.state.Config.participantsApiUrl
      }
    }
  },
  methods: {
    time() {
      var app = this
      this.datenow = moment().format("DD MMMM YYYY HH:mm:ss")
      setTimeout(app.time, 1000)
    },
    updateEventinfo() {
      let currentEvent = _.find(this.$store.state.Config.eventList, ['id', this.$store.state.Config.eventId])
      //console.log(currentEvent)
      if (currentEvent) {
        this.title = currentEvent.title
        this.logo = false

        if (0 < currentEvent.logo) {
          this.$api({
            url: this.$store.state.Config.apiUrl + this.$store.state.Config.filesApiUrl + '/' + currentEvent.logo,
          })
            .then(res => {
              this.logo = res.data.data.data.full_url
            })
        }
      }
    }
  },
  created: function () {
    this.$api.defaults.baseURL = this.$store.state.Config.apiUrl + this.$store.state.Config.participantsApiUrl
    this.$api.defaults.headers['Authorization'] = 'Bearer ' + this.$store.state.Config.apiAccessToken

    this.$electron.ipcRenderer.on('print-badge-closed', () => {
      this.$store.commit('PRINTING_DONE')
    })

    this.$electron.ipcRenderer.on('file-download-start', () => {
      this.isDownloading = true
    })
    this.$electron.ipcRenderer.on('file-download-end', () => {
      this.isDownloading = false
    })

    this.$root.$on('app-download', (url, filename) => {
      let headers = new Headers();
      headers.append('x-apikey', this.$store.state.Config.apiAccessToken)

      fetch(url, { 
        method: 'GET',
        headers: headers
      })
        .then(response => response.blob())
        .then(blob  => {
          var url = window.URL.createObjectURL(blob)
          var a = document.createElement('a')
          a.href = url
          a.download = filename+".xlsx"
          document.body.appendChild(a)
          a.click();   
          a.remove()
        });
    })
  },
  mounted: function() {
    this.time()
    
    let debouncedUpdate = _.debounce(this.updateEventinfo, 500);
    this.$store.subscribe((mutation) => {
      switch (mutation.type) {
        case 'SET_EVENT_ID':
          debouncedUpdate()
          break;
      }
    })

    
    this.$router.push('/loading')
    
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