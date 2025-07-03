<template>
  <div class="budget-container">
    <div class="header">
      <h2 class="page-title">예산 관리</h2>
      <button 
        @click="showBudgetForm = true"
        class="add-button"
      >
        예산 설정
      </button>
    </div>

    <!-- 전체 예산 현황 -->
    <div class="budget-card">
      <h3 class="card-title">이번 달 예산 현황</h3>
      <div class="budget-list">
        <div v-for="budget in budgets" :key="budget.id" class="budget-item">
          <div class="budget-header">
            <span class="budget-category">{{ budget.category }}</span>
            <span class="budget-amounts">
              ₩{{ budget.spent.toLocaleString() }} / ₩{{ budget.limit.toLocaleString() }}
            </span>
          </div>
          <div class="progress-container">
            <div class="progress-bar">
              <div 
                :class="['progress-fill', getProgressClass(budget.percentage)]"
                :style="{ width: Math.min(budget.percentage, 100) + '%' }"
              ></div>
            </div>
            <div :class="['progress-text', getProgressClass(budget.percentage)]">
              {{ budget.percentage.toFixed(1) }}% 사용
              <span v-if="budget.percentage > 100" class="over-budget">
                (₩{{ (budget.spent - budget.limit).toLocaleString() }} 초과)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 예산 설정 모달 -->
    <div v-if="showBudgetForm" class="modal-overlay" @click="showBudgetForm = false">
      <div class="modal-content" @click.stop>
        <h3 class="modal-title">예산 설정</h3>
        <form @submit.prevent="saveBudget" class="budget-form">
          <div class="form-group">
            <label class="form-label">카테고리</label>
            <select v-model="budgetForm.category" required class="form-select">
              <option value="">카테고리 선택</option>
              <option value="식비">식비</option>
              <option value="교통비">교통비</option>
              <option value="오락">오락</option>
              <option value="쇼핑">쇼핑</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">예산 금액</label>
            <input 
              v-model.number="budgetForm.amount" 
              type="number" 
              required
              class="form-input"
              placeholder="예산 금액을 입력하세요"
            >
          </div>
          <div class="button-group">
            <button type="submit" class="save-button">저장</button>
            <button 
              type="button" 
              @click="showBudgetForm = false"
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
  name: 'Budget',
  setup() {
    const showBudgetForm = ref(false)
    const budgetForm = ref({
      category: '',
      amount: ''
    })

    const budgets = ref([
      {
        id: 1,
        category: '식비',
        limit: 500000,
        spent: 300000,
        percentage: 60
      },
      {
        id: 2,
        category: '교통비',
        limit: 100000,
        spent: 85000,
        percentage: 85
      },
      {
        id: 3,
        category: '오락',
        limit: 200000,
        spent: 250000,
        percentage: 125
      }
    ])

    const getProgressClass = (percentage) => {
      if (percentage > 100) return 'danger'
      if (percentage > 80) return 'warning'
      return 'safe'
    }

    const saveBudget = () => {
      console.log('예산 저장:', budgetForm.value)
      showBudgetForm.value = false
      budgetForm.value = { category: '', amount: '' }
    }

    return {
      showBudgetForm,
      budgetForm,
      budgets,
      getProgressClass,
      saveBudget
    }
  }
}
</script>

<style scoped>
.budget-container {
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

.add-button {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.add-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
}

.budget-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 2rem;
  color: #1f2937;
}

.budget-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.budget-item {
  padding: 1.5rem;
  border: 2px solid #f3f4f6;
  border-radius: 12px;
  transition: border-color 0.2s;
}

.budget-item:hover {
  border-color: #e5e7eb;
}

.budget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.budget-category {
  font-weight: 600;
  font-size: 1.1rem;
  color: #1f2937;
}

.budget-amounts {
  font-weight: 500;
  color: #6b7280;
}

.progress-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.progress-bar {
  width: 100%;
  height: 12px;
  background: #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 6px;
  transition: width 0.8s ease;
}

.progress-fill.safe {
  background: linear-gradient(135deg, #059669, #047857);
}

.progress-fill.warning {
  background: linear-gradient(135deg, #d97706, #b45309);
}

.progress-fill.danger {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
}

.progress-text {
  font-size: 0.9rem;
  font-weight: 500;
}

.progress-text.safe {
  color: #059669;
}

.progress-text.warning {
  color: #d97706;
}

.progress-text.danger {
  color: #dc2626;
}

.over-budget {
  font-weight: 600;
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

.budget-form {
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

.form-input, .form-select {
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-input:focus, .form-select:focus {
  outline: none;
  border-color: #2563eb;
}

.form-select {
  background: white;
  cursor: pointer;
}

.button-group {
  display: flex;
  gap: 1rem;
}

.save-button {
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

.save-button:hover {
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
  
  .budget-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>
