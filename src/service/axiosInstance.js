import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosInstance.setToken = function (token) {
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`
}


axiosInstance.interceptors.request.use(config => {
  try {
    // Pinia 스토어에서 사용자 상태를 가져옵니다.
    const userStore = useUserStore(pinia) 
    const { accessToken } = storeToRefs(userStore) // accessToken을 반응형으로 가져옵니다.
    console.log(accessToken.value)
    if (accessToken.value) {
      // accessToken이 존재하면 요청 헤더에 Authorization 토큰을 추가합니다.
      config.headers['Authorization'] = `Bearer ${accessToken.value}`
    }
  } catch (e) {
    // Pinia가 아직 초기화되지 않았을 수 있으므로 오류를 무시합니다.
  }
  return config // 수정된 config를 반환하여 요청을 계속 진행합니다.
})

export default axiosInstance
