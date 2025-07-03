<template>
  <div class="profile-container">
    <div class="profile-header">
      <h2 class="page-title">마이페이지</h2>
      <button 
        v-if="!isEditing"
        @click="startEdit"
        class="edit-button"
      >
        편집
      </button>
    </div>

    <div class="profile-grid">
      <!-- 프로필 정보 -->
      <div class="profile-card">
        <div class="card-header">
          <h3 class="card-title">프로필 정보</h3>
          <div v-if="isEditing" class="edit-actions">
            <button @click="saveProfile" class="save-button">저장</button>
            <button @click="cancelEdit" class="cancel-button">취소</button>
          </div>
        </div>

        <div class="profile-content">
          <!-- 프로필 사진 -->
          <div class="avatar-section">
            <div class="avatar-container">
              <div class="avatar">
                {{ profileData.name.charAt(0) }}
              </div>
              <button v-if="isEditing" class="avatar-edit-button">
                📷
              </button>
            </div>
            <div class="user-info">
              <h3 class="user-name">{{ profileData.name }}</h3>
              <p class="user-email">{{ profileData.email }}</p>
              <div class="join-date">{{ profileData.joinDate }} 가입</div>
            </div>
          </div>

          <!-- 기본 정보 -->
          <div class="info-grid">
            <div class="info-group">
              <label class="info-label">이름</label>
              <input 
                v-if="isEditing"
                v-model="editData.name"
                class="info-input"
              >
              <p v-else class="info-value">{{ profileData.name }}</p>
            </div>

            <div class="info-group">
              <label class="info-label">이메일</label>
              <input 
                v-if="isEditing"
                v-model="editData.email"
                type="email"
                class="info-input"
              >
              <p v-else class="info-value">{{ profileData.email }}</p>
            </div>

            <div class="info-group">
              <label class="info-label">전화번호</label>
              <input 
                v-if="isEditing"
                v-model="editData.phone"
                class="info-input"
              >
              <p v-else class="info-value">{{ profileData.phone }}</p>
            </div>

            <div class="info-group">
              <label class="info-label">연령대</label>
              <select 
                v-if="isEditing"
                v-model="editData.age"
                class="info-select"
              >
                <option value="20s">20대</option>
                <option value="30s">30대</option>
                <option value="40s">40대</option>
                <option value="50s">50대</option>
              </select>
              <p v-else class="info-value">
                {{ getAgeText(profileData.age) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- 통계 정보 -->
      <div class="stats-card">
        <h3 class="card-title">나의 통계</h3>
        <div class="stats-list">
          <div v-for="stat in stats" :key="stat.label" class="stat-item">
            <span class="stat-label">{{ stat.label }}</span>
            <span class="stat-value">{{ stat.value }}</span>
          </div>
        </div>
      </div>

      <!-- 계정 설정 -->
      <div class="settings-card">
        <h3 class="card-title">계정 설정</h3>
        <div class="settings-list">
          <button class="setting-button">비밀번호 변경</button>
          <button class="setting-button">알림 설정</button>
          <button class="setting-button">데이터 내보내기</button>
          <div class="divider"></div>
          <button class="setting-button danger">계정 삭제</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'Profile',
  setup() {
    const isEditing = ref(false)
    const profileData = ref({
      name: '김철수',
      email: 'kimcs@example.com',
      phone: '010-1234-5678',
      age: '20s',
      joinDate: '2024-01-01',
    })
    const editData = ref({ ...profileData.value })

    const stats = ref([
      { label: '총 거래 수', value: '156건' },
      { label: '이번 달 지출', value: '2,800,000원' },
      { label: '평균 일일 지출', value: '93,333원' },
      { label: '가장 많이 쓴 카테고리', value: '식비' },
    ])

    const getAgeText = (age) => {
      const ageMap = {
        '20s': '20대',
        '30s': '30대',
        '40s': '40대',
        '50s': '50대'
      }
      return ageMap[age] || age
    }

    const startEdit = () => {
      isEditing.value = true
      editData.value = { ...profileData.value }
    }

    const saveProfile = () => {
      profileData.value = { ...editData.value }
      isEditing.value = false
      alert('프로필이 업데이트되었습니다.')
    }

    const cancelEdit = () => {
      editData.value = { ...profileData.value }
      isEditing.value = false
    }

    return {
      isEditing,
      profileData,
      editData,
      stats,
      getAgeText,
      startEdit,
      saveProfile,
      cancelEdit
    }
  }
}
</script>

<style scoped>
.profile-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  font-size: 2rem;
  font-weight: bold;
  color: #1f2937;
}

.edit-button {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.edit-button:hover {
  transform: translateY(-2px);
}

.profile-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

.profile-card, .stats-card, .settings-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.edit-actions {
  display: flex;
  gap: 0.5rem;
}

.save-button {
  background: #059669;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.save-button:hover {
  background: #047857;
}

.cancel-button {
  background: #6b7280;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.cancel-button:hover {
  background: #4b5563;
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e5e7eb;
}

.avatar-container {
  position: relative;
}

.avatar {
  width: 5rem;
  height: 5rem;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  font-weight: bold;
}

.avatar-edit-button {
  position: absolute;
  bottom: -0.25rem;
  right: -0.25rem;
  width: 2rem;
  height: 2rem;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.8rem;
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.user-email {
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.join-date {
  font-size: 0.9rem;
  color: #9ca3af;
  background: #f3f4f6;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  display: inline-block;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.info-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-label {
  font-weight: 600;
  color: #374151;
  font-size: 0.9rem;
}

.info-input, .info-select {
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.info-input:focus, .info-select:focus {
  outline: none;
  border-color: #2563eb;
}

.info-value {
  color: #1f2937;
  font-weight: 500;
  margin: 0;
}

.stats-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f3f4f6;
}

.stat-item:last-child {
  border-bottom: none;
}

.stat-label {
  font-size: 0.9rem;
  color: #6b7280;
}

.stat-value {
  font-weight: 600;
  color: #1f2937;
}

.settings-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.setting-button {
  padding: 1rem;
  border: none;
  border-radius: 8px;
  background: #f9fafb;
  color: #374151;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  text-align: left;
}

.setting-button:hover {
  background: #f3f4f6;
}

.setting-button.danger {
  color: #dc2626;
}

.setting-button.danger:hover {
  background: #fee2e2;
}

.divider {
  height: 1px;
  background: #e5e7eb;
  margin: 0.5rem 0;
}

@media (max-width: 1024px) {
  .profile-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .avatar-section {
    flex-direction: column;
    text-align: center;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
