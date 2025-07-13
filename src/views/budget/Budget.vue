<template>
  <div class="budget-container">
    <div class="header">
      <h2 class="page-title">예산 관리</h2>
      <button @click="showBudgetForm = true" class="add-button">예산 설정</button>
    </div>

    <div class="budget-card">
      <h3 class="card-title">이번 달 예산 현황</h3>
      <div class="budget-list">
        <div
          v-for="budget in budgets"
          :key="budget.id"
          class="budget-item"
          @click="showDetail(budget)"
          style="cursor: pointer;"
        >
          <div class="budget-header">
            <span class="budget-category">
              {{ getCategoryName(budget.category_id) }}
            </span>
            <span class="budget-amounts">
              ₩{{ budget.used_amount?.toLocaleString() ?? '0' }} / ₩{{ budget.amount?.toLocaleString() ?? '0' }}
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
                (₩{{ (budget.used_amount - budget.amount).toLocaleString() }} 초과)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 예산 상세 모달 -->
    <div v-if="selectedBudget" class="modal-overlay" @click="selectedBudget = null">
      <div class="modal-content" @click.stop>
        <h3 class="modal-title">예산 상세 정보</h3>
        <div class="detail-row"><b>카테고리:</b> {{ getCategoryName(selectedBudget.category_id) }}</div>
        <div class="detail-row"><b>예산 금액:</b> ₩{{ selectedBudget.amount?.toLocaleString() ?? '0' }}</div>
        <div class="detail-row"><b>사용 금액:</b> ₩{{ selectedBudget.used_amount?.toLocaleString() ?? '0' }}</div>
        <div class="detail-row"><b>기간:</b> {{ selectedBudget.start_date }} ~ {{ selectedBudget.end_date }}</div>
        <button class="cancel-button" @click="selectedBudget = null" style="margin-top:2rem;">닫기</button>
      </div>
    </div>

    <!-- 예산 설정 모달 -->
    <div v-if="showBudgetForm" class="modal-overlay" @click="showBudgetForm = false">
      <div class="modal-content" @click.stop>
        <h3 class="modal-title">예산 설정</h3>
        <form @submit.prevent="saveBudget" class="budget-form">
          <div class="form-group">
            <label class="form-label">카테고리</label>
            <select v-model.number="budgetForm.category_id" required class="form-select">
              <option disabled value="">카테고리 선택</option>
              <option v-for="(name, id) in CATEGORY_MAP" :key="id" :value="Number(id)">
                {{ name }}
              </option>
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
            />
          </div>
          <div class="form-group">
            <label class="form-label">시작일</label>
            <input
              v-model="budgetForm.startDate"
              type="date"
              required
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label class="form-label">종료일</label>
            <input
              v-model="budgetForm.endDate"
              type="date"
              required
              class="form-input"
            />
          </div>
          <div class="button-group">
            <button type="submit" class="save-button">저장</button>
            <button type="button" @click="showBudgetForm = false" class="cancel-button">취소</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import axiosInstance from '@/service/axiosInstance'

const CATEGORY_MAP = {
  1: '식비',
  2: '교통비',
  3: '문화생활',
  4: '의료/건강',
  5: '쇼핑',
  6: '기타'
}

export default {
  name: 'Budget',
  setup() {
    const showBudgetForm = ref(false)
    const budgetForm = ref({
      category_id: '',
      amount: '',
      startDate: '',
      endDate: ''
    })

    const budgets = ref([])
    const selectedBudget = ref(null)

    const getCategoryName = (category_id) => {
      return CATEGORY_MAP[category_id] || `카테고리 ${category_id}`
    }

    const getProgressClass = (percentage) => {
      if (percentage > 100) return 'danger'
      if (percentage > 80) return 'warning'
      return 'safe'
    }

    // 예산 목록 불러오기 (거래 내역 합산 used_amount 포함)
    const getBudgets = async () => {
      try {
        const response = await axiosInstance.get('/api/budget')
        const data = Array.isArray(response.data) ? response.data : []
        budgets.value = data.map(budget => {
          const used = budget.used_amount || 0
          const limit = budget.amount || 1
          return {
            ...budget,
            percentage: (used / limit) * 100
          }
        })
      } catch (err) {
        console.error('예산 목록 불러오기 실패:', err)
      }
    }

    // 예산 저장 후 바로 목록 갱신
    const saveBudget = async () => {
      try {
        await axiosInstance.post('/api/budget', {
          category_id: budgetForm.value.category_id,
          amount: budgetForm.value.amount,
          startDate: budgetForm.value.startDate,
          endDate: budgetForm.value.endDate
        })
        await getBudgets()
        showBudgetForm.value = false
        budgetForm.value = {
          category_id: '',
          amount: '',
          startDate: '',
          endDate: ''
        }
      } catch (err) {
        console.error('예산 저장 실패:', err)
      }
    }

    // 예산 상세 모달 띄우기
    const showDetail = (budget) => {
      selectedBudget.value = budget
    }

    // 거래 내역 등록/수정 후 예산 자동 갱신을 위해, 
    // transactions 페이지에서 거래 추가/수정 후 이 페이지로 돌아올 때마다 목록을 새로고침
    onMounted(() => {
      getBudgets()
      // 아래 코드는 라우터 네비게이션 후에도 예산 목록을 새로고침함
      if (window && window.addEventListener) {
        window.addEventListener('focus', getBudgets)
      }
    })

    return {
      showBudgetForm,
      budgetForm,
      budgets,
      getProgressClass,
      saveBudget,
      getCategoryName,
      selectedBudget,
      showDetail,
      CATEGORY_MAP
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
.detail-row {
  margin-bottom: 0.8rem;
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
