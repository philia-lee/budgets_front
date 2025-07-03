<template>
  <div class="login-container">
    <div class="login-card">
      <h2 class="login-title">로그인</h2>
      
      <form @submit.prevent="handleLogin" class="login-form">
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
        
        <button type="submit" class="login-button">
          로그인
        </button>
      </form>
      
      <div class="social-login">
        <div class="divider">또는</div>
        
        <button class="social-button google">
          Google로 로그인
        </button>
        
        <button class="social-button kakao">
          Kakao로 로그인
        </button>
      </div>
      
      <div class="signup-link">
        <router-link to="/register">
          계정이 없으신가요? 회원가입
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'Login',
  setup() {
    const router = useRouter()
    const form = ref({
      email: '',
      password: ''
    })

    const handleLogin = async () => {
      try {
        console.log('로그인 시도:', form.value)
        router.push('/')
      } catch (error) {
        console.error('로그인 실패:', error)
      }
    }

    return {
      form,
      handleLogin
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
  padding: 2rem;
}

.login-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  padding: 3rem;
  width: 100%;
  max-width: 400px;
}

.login-title {
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 2rem;
  color: #1f2937;
}

.login-form {
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

.login-button {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
}

.social-login {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.divider {
  text-align: center;
  color: #6b7280;
  position: relative;
  margin: 1rem 0;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e5e7eb;
  z-index: 1;
}

.divider::after {
  content: '또는';
  background: white;
  padding: 0 1rem;
  position: relative;
  z-index: 2;
}

.social-button {
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.social-button.google {
  background: white;
  color: #374151;
}

.social-button.google:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
}

.social-button.kakao {
  background: #fee500;
  color: #000;
  border-color: #fee500;
}

.social-button.kakao:hover {
  background: #fde047;
}

.signup-link {
  text-align: center;
  margin-top: 2rem;
}

.signup-link a {
  color: #2563eb;
  text-decoration: none;
  font-weight: 500;
}

.signup-link a:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .login-card {
    padding: 2rem;
  }
}
</style>
