<template>
  <div class="register-container">
    <div class="register-card">
      <h2 class="register-title">회원가입</h2>
      
      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <label class="form-label">이메일</label>
          <input 
            v-model="form.email"
            type="email" 
            required
            class="form-input"
            placeholder="이메일을 입력하세요"
          >
        </div>
        
        <div class="form-group">
          <label class="form-label">비밀번호</label>
          <input 
            v-model="form.password"
            type="password" 
            required
            class="form-input"
            placeholder="비밀번호를 입력하세요"
          >
        </div>
        
        <div class="form-group">
          <label class="form-label">비밀번호 확인</label>
          <input 
            v-model="form.confirmPassword"
            type="password" 
            required
            class="form-input"
            placeholder="비밀번호를 다시 입력하세요"
          >
        </div>
        
        <div class="form-group">
          <label class="form-label">닉네임</label>
          <input 
            v-model="form.nickname"
            type="text" 
            required
            class="form-input"
            placeholder="닉네임을 입력하세요"
          >
        </div>
        
        <button type="submit" class="register-button">
          회원가입
        </button>
      </form>
      
      <div class="login-link">
        <router-link to="/login">
          이미 계정이 있으신가요? 로그인
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'Register',
  setup() {
    const router = useRouter()
    const form = ref({
      email: '',
      password: '',
      confirmPassword: '',
      nickname: ''
    })

    const handleRegister = async () => {
      if (form.value.password !== form.value.confirmPassword) {
        alert('비밀번호가 일치하지 않습니다.')
        return
      }

      try {
        console.log('회원가입 시도:', form.value)
        router.push('/login')
      } catch (error) {
        console.error('회원가입 실패:', error)
      }
    }

    return {
      form,
      handleRegister
    }
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
  padding: 2rem;
}

.register-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  padding: 3rem;
  width: 100%;
  max-width: 400px;
}

.register-title {
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 2rem;
  color: #1f2937;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-weight: 600;
  color: #374151;
  font-size: 0.9rem;
}

.form-input {
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.register-button {
  background: linear-gradient(135deg, #059669, #047857);
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.register-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(5, 150, 105, 0.3);
}

.login-link {
  text-align: center;
  margin-top: 2rem;
}

.login-link a {
  color: #2563eb;
  text-decoration: none;
  font-weight: 500;
}

.login-link a:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .register-card {
    padding: 2rem;
  }
}
</style>
