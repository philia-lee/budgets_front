<template>
  <div class="statistics-container">
    <h2 class="page-title">통계 및 분석</h2>
    
    <div class="charts-grid">
      <!-- 월별 수입/지출 추이 -->
      <div class="chart-card">
        <h3 class="chart-title">월별 수입/지출 추이</h3>
        <div class="chart-placeholder">
          <div class="chart-icon">📊</div>
          <span class="chart-text">차트 영역 (Chart.js 연동 필요)</span>
        </div>
      </div>
      
      <!-- 카테고리별 지출 비율 -->
      <div class="chart-card">
        <h3 class="chart-title">카테고리별 지출 비율</h3>
        <div class="category-stats">
          <div v-for="category in categoryStats" :key="category.name" class="category-item">
            <div class="category-header">
              <span class="category-name">{{ category.name }}</span>
              <span class="category-percentage">{{ category.percentage }}%</span>
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
          <div class="summary-amount">₩2,500,000</div>
          <div class="summary-label">이번 달 수입</div>
        </div>
        <div class="summary-item expense">
          <div class="summary-amount">₩1,800,000</div>
          <div class="summary-label">이번 달 지출</div>
        </div>
        <div class="summary-item savings">
          <div class="summary-amount">₩700,000</div>
          <div class="summary-label">이번 달 저축</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'Statistics',
  setup() {
    const categoryStats = ref([
      { name: '식비', percentage: 35 },
      { name: '교통비', percentage: 15 },
      { name: '오락', percentage: 20 },
      { name: '쇼핑', percentage: 25 },
      { name: '기타', percentage: 5 }
    ])

    return {
      categoryStats
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

.chart-placeholder {
  height: 250px;
  background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.chart-icon {
  font-size: 3rem;
}

.chart-text {
  color: #6b7280;
  font-weight: 500;
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
