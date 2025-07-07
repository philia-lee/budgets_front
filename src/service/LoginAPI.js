
import { useUserStore } from "@/stores/user"
import axios from 'axios'
import axiosInstance from "./axiosInstance"
import { Base64 } from 'js-base64'
const API_URL = import.meta.env.VITE_API_URL
export default {
  async doLogin(userId, userPw) {
    try {
       
      const response = await axios.post(API_URL+'/api/auth/login', {
        email: userId,
        password: userPw
      })

      const data = response.data
      
      if (!data || !data.accessToken) return 'error'
      
      const token = data.accessToken
      const payload = JSON.parse(Base64.decode(token.split('.')[1]))
      const name = payload.name
      const userStore = useUserStore()
      axiosInstance.setToken(token)
      userStore.login(name, token)

      return "success"
    } catch (err) {
      if (err.response?.data?.code === 400100) return 'notFound'
      return 'error'
    }
  },
   
}

