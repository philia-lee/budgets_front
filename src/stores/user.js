import { defineStore } from 'pinia'


export const useUserStore = defineStore('user', {
  state: () => ({
    name: null,
    accessToken: null,
  }),
  actions: {
    login(name,accessToken) {
      this.name = name
      this.accessToken = accessToken
    },
    logout() {
      this.name = null
      this.accessToken = null
      localStorage.removeItem('accessToken')
    },
    setnickname(name) {
      this.name = name
    },

  },
  persist: {
    storage: localStorage,
    paths: ['name','accessToken',],
  },

})
