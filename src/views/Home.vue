<template>
  <div class="home-container">
    <div class="dashboard-card">
      <h2 class="dashboard-title">대시보드</h2>
      <div class="stats-grid">
        <div class="stat-card income">
          <h3 class="stat-title">이번 달 수입</h3>
          <p class="stat-amount">₩2,500,000</p>
        </div>
        <div class="stat-card expense">
          <h3 class="stat-title">이번 달 지출</h3>
          <p class="stat-amount">₩1,800,000</p>
        </div>
        <div class="stat-card balance">
          <h3 class="stat-title">잔액</h3>
          <p class="stat-amount">₩700,000</p>
        </div>
      </div>
    </div>

    <div class="content-grid">
      <div class="card">
        <h3 class="card-title">최근 거래</h3>
        <div class="transaction-list">
          <div class="transaction-item">
            <span class="transaction-desc">커피</span>
            <span class="transaction-amount expense">-₩4,500</span>
          </div>
          <div class="transaction-item">
            <span class="transaction-desc">급여</span>
            <span class="transaction-amount income">+₩2,500,000</span>
          </div>
        </div>
      </div>

      <div class="card">
        <h3 class="card-title">예산 현황</h3>
        <div class="budget-item">
          <div class="budget-header">
            <span>식비</span>
            <span>₩300,000 / ₩500,000</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: 60%"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.dashboard-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.dashboard-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #1f2937;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
}

.stat-card.income {
  background: linear-gradient(135deg, #dcfce7, #bbf7d0);
}

.stat-card.expense {
  background: linear-gradient(135deg, #fee2e2, #fecaca);
}

.stat-card.balance {
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
}

.stat-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #374151;
}

.stat-amount {
  font-size: 2rem;
  font-weight: bold;
  color: #1f2937;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}

.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #1f2937;
}

.transaction-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.transaction-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
}

.transaction-desc {
  font-weight: 500;
  color: #374151;
}

.transaction-amount {
  font-weight: bold;
}

.transaction-amount.income {
  color: #059669;
}

.transaction-amount.expense {
  color: #dc2626;
}

.budget-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.budget-header {
  display: flex;
  justify-content: space-between;
  font-weight: 500;
  color: #374151;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #2563eb;
  transition: width 0.3s ease;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .content-grid {
    grid-template-columns: 1fr;
  }
}
</style>
