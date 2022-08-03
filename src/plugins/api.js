import Vue from 'vue'
import axios from 'axios'

Vue.prototype.$api = axios.create({
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})