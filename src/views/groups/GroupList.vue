<template>
  <div class="groups-container">
    <div class="header">
      <h2 class="page-title">그룹 가계부</h2>
      <button 
        @click="showCreateForm = true"
        class="create-button"
      >
        그룹 생성
      </button>
    </div>

    <!-- 내 그룹 목록 -->
    <div class="groups-grid">
      <div 
        v-for="group in groups" 
        :key="group.id"
        class="group-card"
        @click="$router.push(`/groups/${group.id}`)"
      >
        <div class="group-header">
          <div class="group-avatar">
            {{ group.name.charAt(0) }}
          </div>
          <div class="group-info">
            <h3 class="group-name">{{ group.name }}</h3>
            <p class="group-members">{{ group.members.length }}명</p>
          </div>
        </div>
        
        <div class="group-stats">
          <div class="stat-row">
            <span class="stat-label">이번 달 총 지출</span>
            <span class="stat-value">₩{{ group.totalExpense.toLocaleString() }}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">내 지출</span>
            <span class="stat-value">₩{{ group.myExpense.toLocaleString() }}</span>
          </div>
        </div>
        
        <div class="member-avatars">
          <div 
            v-for="member in group.members.slice(0, 3)" 
            :key="member.id"
            class="member-avatar"
          >
            {{ member.name.charAt(0) }}
          </div>
          <div 
            v-if="group.members.length > 3"
            class="member-avatar more"
          >
            +{{ group.members.length - 3 }}
          </div>
        </div>
      </div>
    </div>

    <!-- 그룹 생성 모달 -->
    <div v-if="showCreateForm" class="modal-overlay" @click="showCreateForm = false">
      <div class="modal-content" @click.stop>
        <h3 class="modal-title">새 그룹 생성</h3>
        <form @submit.prevent="createGroup" class="group-form">
          <div class="form-group">
            <label class="form-label">그룹 이름</label>
            <input 
              v-model="groupForm.name" 
              type="text" 
              required
              class="form-input"
              placeholder="그룹 이름을 입력하세요"
            >
          </div>
          <div class="form-group">
            <label class="form-label">설명</label>
            <textarea 
              v-model="groupForm.description"
              class="form-textarea"
              rows="3"
              placeholder="그룹 설명을 입력하세요"
            ></textarea>
          </div>
          <div class="button-group">
            <button type="submit" class="create-button-modal">생성</button>
            <button 
              type="button" 
              @click="showCreateForm = false"
              class="cancel-button"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'GroupList',
  setup() {
    const showCreateForm = ref(false)
    const groupForm = ref({
      name: '',
      description: ''
    })

    const groups = ref([
      {
        id: 1,
        name: '가족 가계부',
        totalExpense: 1500000,
        myExpense: 750000,
        members: [
          { id: 1, name: '김철수' },
          { id: 2, name: '김영희' }
        ]
      },
      {
        id: 2,
        name: '룸메이트',
        totalExpense: 800000,
        myExpense: 400000,
        members: [
          { id: 1, name: '김철수' },
          { id: 3, name: '박민수' },
          { id: 4, name: '이지은' }
        ]
      }
    ])

    const createGroup = () => {
      console.log('그룹 생성:', groupForm.value)
      showCreateForm.value = false
      groupForm.value = { name: '', description: '' }
    }

    return {
      showCreateForm,
      groupForm,
      groups,
      createGroup
    }
  }
}
</script>

<style scoped>
.groups-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  font-size: 2rem;
  font-weight: bold;
  color: #1f2937;
}

.create-button {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.create-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
}

.groups-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.group-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.group-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
}

.group-header {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.group-avatar {
  width: 3rem;
  height: 3rem;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
  margin-right: 1rem;
}

.group-info {
  flex: 1;
}

.group-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.group-members {
  font-size: 0.9rem;
  color: #6b7280;
  margin: 0;
}

.group-stats {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-label {
  font-size: 0.9rem;
  color: #6b7280;
}

.stat-value {
  font-weight: 600;
  color: #1f2937;
}

.member-avatars {
  display: flex;
  gap: -0.5rem;
}

.member-avatar {
  width: 2rem;
  height: 2rem;
  background: #e5e7eb;
  border: 2px solid white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 600;
  color: #374151;
  margin-left: -0.5rem;
}

.member-avatar:first-child {
  margin-left: 0;
}

.member-avatar.more {
  background: #6b7280;
  color: white;
  font-size: 0.7rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  margin: 1rem;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #1f2937;
}

.group-form {
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

.form-input, .form-textarea {
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
  font-family: inherit;
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: #2563eb;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.button-group {
  display: flex;
  gap: 1rem;
}

.create-button-modal {
  flex: 1;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.create-button-modal:hover {
  transform: translateY(-2px);
}

.cancel-button {
  flex: 1;
  background: #6b7280;
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.cancel-button:hover {
  background: #4b5563;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .groups-grid {
    grid-template-columns: 1fr;
  }
}
</style>
