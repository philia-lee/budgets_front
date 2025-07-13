<template>
  <div class="statistics-container">
    <h2 class="page-title">통계 및 분석</h2>
    
    <!-- 월 선택 -->
    <div class="month-selector">
      <label for="month-select">월 선택:</label>
      <input
        id="month-select"
        type="month"
        v-model="selectedMonth"
        @change="fetchStatistics"
        :max="maxMonth"
      />
    </div>

    <div class="charts-grid">
      <!-- 월별 수입/지출 추이 -->
      <div class="chart-card">
        <h3 class="chart-title">월별 수입/지출 추이</h3>
        <canvas ref="trendChart"></canvas>
      </div>
      
      <!-- 카테고리별 지출 비율 -->
      <div class="chart-card">
        <h3 class="chart-title">카테고리별 지출 비율</h3>
        <div class="category-stats">
          <div v-for="category in categoryStats" :key="category.category_id" class="category-item">
            <div class="category-header">
              <span class="category-name">{{ category.category_name }}</span>
              <span class="category-percentage">{{ category.percentage.toFixed(1) }}%</span>
            </div>
            <div class="progress-bar">
              <div 
                class="progress-fill" 
                :style="{ width: category.percentage + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 기간별 요약 -->
    <div class="summary-card">
      <h3 class="summary-title">기간별 요약</h3>
      <div class="summary-grid">
        <div class="summary-item income">
          <div class="summary-amount">₩{{ summary.income.toLocaleString() }}</div>
          <div class="summary-label">이번 달 수입</div>
        </div>
        <div class="summary-item expense">
          <div class="summary-amount">₩{{ summary.expense.toLocaleString() }}</div>
          <div class="summary-label">이번 달 지출</div>
        </div>
        <div class="summary-item savings">
          <div class="summary-amount">₩{{ summary.savings.toLocaleString() }}</div>
          <div class="summary-label">이번 달 저축</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch, nextTick } from 'vue'
import axiosInstance from '@/service/axiosInstance'
import Chart from 'chart.js/auto'

export default {
  name: 'Statistics',
  setup() {
    // 오늘 날짜 기준 기본 월
    const today = new Date()
    const defaultMonth = today.toISOString().slice(0, 7)
    const selectedMonth = ref(defaultMonth)
    const maxMonth = defaultMonth

    // 카테고리별 지출 비율
    const categoryStats = ref([])

    // 월별 수입/지출 추이
    const trendChart = ref(null)
    let chartInstance = null
    const trendData = ref([])

    // 요약 (수입/지출/저축)
    const summary = ref({
      income: 0,
      expense: 0,
      savings: 0
    })

    // 로그인한 사용자 ID (예시: 실제로는 store나 props 등에서 받아와야 함)
    const userId = 3

    // 월별 통계 fetch
    const fetchStatistics = async () => {
      // 1. 월별 수입/지출 추이 (작년 8월~선택월)
      const end = new Date(selectedMonth.value + '-01')
      const start = new Date(end)
      start.setMonth(start.getMonth() - 11) // 12개월 전(포함)
      const startStr = start.toISOString().slice(0, 7) + '-01'
      const endStr = new Date(end.getFullYear(), end.getMonth() + 1, 0).toISOString().slice(0, 10)

      // 2. 카테고리별 지출 비율 (선택월)
      const monthStart = selectedMonth.value + '-01'
      const monthEnd = new Date(end.getFullYear(), end.getMonth() + 1, 0).toISOString().slice(0, 10)

      // 월별 추이
      const monthlyRes = await axiosInstance.post('/api/statistics/monthly-summary', {
        user_id: userId,
        start_date: startStr,
        end_date: endStr,
        category_ids: null
      })
      trendData.value = monthlyRes.data

      // 카테고리별 지출 비율
      const categoryRes = await axiosInstance.post('/api/statistics/category-expense', {
        user_id: userId,
        start_date: monthStart,
        end_date: monthEnd,
        category_ids: null
      })
      categoryStats.value = categoryRes.data

      // 요약 (선택월)
      const thisMonth = monthlyRes.data.find(m => m.month === selectedMonth.value)
      summary.value.income = thisMonth ? Math.round(thisMonth.income) : 0
      summary.value.expense = thisMonth ? Math.round(thisMonth.expense) : 0
      summary.value.savings = thisMonth ? Math.round(thisMonth.net) : 0

      // 차트 렌더링
      await nextTick()
      renderTrendChart()
    }

    // 월별 추이 차트 그리기
    const renderTrendChart = () => {
      if (!trendChart.value) return
      if (chartInstance) {
        chartInstance.destroy()
      }
      const labels = trendData.value.map(m => m.month)
      const incomeData = trendData.value.map(m => m.income)
      const expenseData = trendData.value.map(m => m.expense)
      chartInstance = new Chart(trendChart.value, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: '수입',
              data: incomeData,
              borderColor: '#059669',
              backgroundColor: 'rgba(5, 150, 105, 0.1)',
              tension: 0.2
            },
            {
              label: '지출',
              data: expenseData,
              borderColor: '#dc2626',
              backgroundColor: 'rgba(220, 38, 38, 0.1)',
              tension: 0.2
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: true }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: value => '₩' + value.toLocaleString()
              }
            }
          }
        }
      })
    }

    onMounted(fetchStatistics)
    watch(selectedMonth, fetchStatistics)

    return {
      categoryStats,
      selectedMonth,
      maxMonth,
      summary,
      trendChart
    }
  }
}
</script>

<style scoped>
.statistics-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 1rem;
}

.month-selector {
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}

.chart-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.chart-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #1f2937;
}

.category-stats {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.category-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.category-name {
  font-weight: 600;
  color: #374151;
}

.category-percentage {
  font-weight: 600;
  color: #2563eb;
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
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  border-radius: 6px;
  transition: width 0.8s ease;
}

.summary-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.summary-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #1f2937;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.summary-item {
  text-align: center;
  padding: 2rem;
  border-radius: 12px;
  transition: transform 0.2s;
}

.summary-item:hover {
  transform: translateY(-4px);
}

.summary-item.income {
  background: linear-gradient(135deg, #dcfce7, #bbf7d0);
}

.summary-item.expense {
  background: linear-gradient(135deg, #fee2e2, #fecaca);
}

.summary-item.savings {
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
}

.summary-amount {
  font-size: 2rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.summary-label {
  font-size: 0.9rem;
  color: #6b7280;
  font-weight: 500;
}

@media (max-width: 768px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
  
  .summary-grid {
    grid-template-columns: 1fr;
  }
}
</style>
