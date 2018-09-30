import Vue from 'vue'
import axios from 'axios'

Vue.prototype.$api = axios.create({
  baseURL: '/api/member',
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
})