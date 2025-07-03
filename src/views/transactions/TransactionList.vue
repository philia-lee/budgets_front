<template>
  <div class="transactions-container">
    <div class="header">
      <h2 class="page-title">거래 내역</h2>
      <router-link to="/transactions/new" class="add-button">
        새 거래 추가
      </router-link>
    </div>

    <div class="filter-card">
      <div class="filter-row">
        <select v-model="filter.period" class="filter-select">
          <option value="all">전체</option>
          <option value="today">오늘</option>
          <option value="week">이번 주</option>
          <option value="month">이번 달</option>
        </select>
        
        <select v-model="filter.type" class="filter-select">
          <option value="all">전체</option>
          <option value="income">수입</option>
          <option value="expense">지출</option>
        </select>
        
        <select v-model="filter.category" class="filter-select">
          <option value="all">모든 카테고리</option>
          <option value="food">식비</option>
          <option value="transport">교통비</option>
          <option value="entertainment">오락</option>
        </select>
      </div>
    </div>

    <div class="transactions-card">
      <div 
        v-for="transaction in filteredTransactions" 
        :key="transaction.id"
        class="transaction-item"
      >
        <div class="transaction-info">
          <div class="transaction-desc">{{ transaction.description }}</div>
          <div class="transaction-meta">
            {{ transaction.category }} • {{ transaction.date }}
          </div>
        </div>
        <div class="transaction-actions">
          <div 
            :class="['transaction-amount', transaction.type]"
          >
            {{ transaction.type === 'income' ? '+' : '-' }}₩{{ transaction.amount.toLocaleString() }}
          </div>
          <div class="action-buttons">
            <button 
              @click="editTransaction(transaction.id)"
              class="action-button edit"
            >
              수정
            </button>
            <button 
              @click="deleteTransaction(transaction.id)"
              class="action-button delete"
            >
              삭제
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'TransactionList',
  setup() {
    const router = useRouter()
    
    const filter = ref({
      period: 'all',
      type: 'all',
      category: 'all'
    })

    const transactions = ref([
      {
        id: 1,
        description: '급여',
        amount: 2500000,
        type: 'income',
        category: '급여',
        date: '2024-01-15'
      },
      {
        id: 2,
        description: '커피',
        amount: 4500,
        type: 'expense',
        category: '식비',
        date: '2024-01-14'
      },
      {
        id: 3,
        description: '지하철',
        amount: 1500,
        type: 'expense',
        category: '교통비',
        date: '2024-01-14'
      }
    ])

    const filteredTransactions = computed(() => {
      return transactions.value.filter(transaction => {
        if (filter.value.type !== 'all' && transaction.type !== filter.value.type) {
          return false
        }
        return true
      })
    })

    const editTransaction = (id) => {
      router.push(`/transactions/${id}/edit`)
    }

    const deleteTransaction = (id) => {
      if (confirm('정말 삭제하시겠습니까?')) {
        transactions.value = transactions.value.filter(t => t.id !== id)
      }
    }

    return {
      filter,
      transactions,
      filteredTransactions,
      editTransaction,
      deleteTransaction
    }
  }
}
</script>

<style scoped>
.transactions-container {
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
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: transform 0.2s, box-shadow 0.2s;
}

.add-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
}

.filter-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.filter-row {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-select {
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.9rem;
  background: white;
  cursor: pointer;
  transition: border-color 0.2s;
}

.filter-select:focus {
  outline: none;
  border-color: #2563eb;
}

.transactions-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.transaction-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #f3f4f6;
  transition: background-color 0.2s;
}

.transaction-item:hover {
  background-color: #f9fafb;
}

.transaction-item:last-child {
  border-bottom: none;
}

.transaction-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.transaction-desc {
  font-weight: 600;
  color: #1f2937;
  font-size: 1.1rem;
}

.transaction-meta {
  font-size: 0.9rem;
  color: #6b7280;
}

.transaction-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.transaction-amount {
  font-weight: bold;
  font-size: 1.1rem;
}

.transaction-amount.income {
  color: #059669;
}

.transaction-amount.expense {
  color: #dc2626;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.action-button {
  padding: 0.25rem 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.action-button.edit {
  background: #dbeafe;
  color: #2563eb;
}

.action-button.edit:hover {
  background: #bfdbfe;
}

.action-button.delete {
  background: #fee2e2;
  color: #dc2626;
}

.action-button.delete:hover {
  background: #fecaca;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .filter-row {
    flex-direction: column;
  }
  
  .transaction-item {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .transaction-actions {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
