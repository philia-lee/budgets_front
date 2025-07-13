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
          <option value="INCOME">수입</option>
          <option value="EXPENSE">지출</option>
        </select>
        
        <select v-model="filter.category" class="filter-select">
          <option value="all">모든 카테고리</option>
          <option v-for="cat in categories" :key="cat.value" :value="cat.value">
            {{ cat.text }} </option>
        </select>
      </div>
    </div>

    <div class="transactions-card">
      <div v-if="filteredTransactions.length === 0" class="no-transactions">
        거래 내역이 없습니다.
      </div>
      <div
        v-for="transaction in filteredTransactions"
        :key="transaction.id"
        class="transaction-item"
      >
        <div class="transaction-info">
          <div class="transaction-desc">{{ transaction.description }}</div>
          <div class="transaction-meta">
            {{ transaction.category }} • {{ formatDate(transaction.date) }}
          </div>
        </div>
        <div class="transaction-actions">
          <div
            :class="['transaction-amount', transaction.type]"
          >
            {{ transaction.type === 'INCOME' ? '+' : '-' }}₩{{ transaction.amount.toLocaleString() }}
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

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import TransactionAPI from '@/service/TransactionAPI'; // 경로가 올바른지 확인해주세요.

const router = useRouter();

const filter = ref({
  period: 'all',
  type: 'all',
  category: 'all'
});

const transactions = ref([]); // 실제 거래 내역 데이터
const categories = ref([]); // 서버에서 가져올 카테고리 목록

// 날짜 포맷 함수 (필요에 따라 더 복잡하게 만들 수 있음)
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// 필터링된 거래 내역
const filteredTransactions = computed(() => {
  const today = new Date();
  const getStartDate = (period) => {
    const date = new Date(today);
    switch (period) {
      case 'today':
        return new Date(date.setHours(0, 0, 0, 0));
      case 'week':
        const day = date.getDay(); // 0 for Sunday, 1 for Monday...
        const diff = date.getDate() - day + (day === 0 ? -6 : 1); // 월요일을 주의 시작으로
        return new Date(date.setDate(diff));
      case 'month':
        return new Date(date.setDate(1));
      default:
        return null;
    }
  };

  const startDate = getStartDate(filter.value.period);

  return transactions.value.filter(transaction => {
    // 1. 기간 필터링
    if (filter.value.period !== 'all' && startDate) {
      const transactionDate = new Date(transaction.date);
      if (transactionDate < startDate) {
        return false;
      }
    }

    // 2. 타입 필터링 (수입/지출)
    // transaction.type과 filter.value.type은 모두 대문자 영어로 가정합니다.
    if (filter.value.type !== 'all' && transaction.type !== filter.value.type) {
      return false;
    }

    // 3. 카테고리 필터링
    // filter.value.category (select에서 선택된 한글 이름)와
    // transaction.category (API 응답에서 받은 한글 이름)을 직접 비교
    if (filter.value.category !== 'all') {
      if (transaction.category !== filter.value.category) {
        return false;
      }
    }

    return true; // 모든 필터를 통과하면 포함
  });
});


// 거래 수정
const editTransaction = (id) => {
  router.push(`/transactions/${id}/edit`);
};

// 거래 삭제
const deleteTransaction = async (id) => {
  if (confirm('정말 삭제하시겠습니까?')) {
    try {
      await TransactionAPI.delete(id);
      
      transactions.value = transactions.value.filter(t => t.id !== id);
      alert('거래가 성공적으로 삭제되었습니다.');
    } catch (error) {
      console.error('거래 삭제 실패:', error);
      alert('거래 삭제에 실패했습니다. 다시 시도해주세요.');
    }
  }
};

// 컴포넌트 마운트 시 거래 내역 및 카테고리 목록 로드
onMounted(async () => {
  try {
    // 1. 거래 내역 로드
    const transactionsResponse = await TransactionAPI.list();
    console.log('거래 내역 로드:', transactionsResponse);
    transactions.value = transactionsResponse;

    // 2. 카테고리 목록 로드 (TransactionAPI에 getCategories 함수가 있다고 가정)
    // 서버에서 [{ id: 1, user_id: 3, name: '식비', type: 'EXPENSE', ... }] 형태를 반환한다고 가정
    const categoriesResponse = await TransactionAPI.getCategories(); // 이 함수가 필요합니다.
    console.log('카테고리 목록 로드:', categoriesResponse);
    
    // 서버 응답의 'name' 필드를 value와 text 모두에 사용 (한글 이름으로 필터링)
    categories.value = categoriesResponse.map(cat => ({ 
      value: cat.name,  // 필터링할 때 사용할 값 (한글)
      text: cat.name    // 사용자에게 보여줄 텍스트 (한글)
    }));
  } catch (error) {
    console.error('데이터 로드 실패:', error);
    alert('데이터를 불러오는 데 실패했습니다.');
  }
});
</script>

<style scoped>
/* 기존 스타일은 변경하지 않았습니다. */
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

.no-transactions {
  padding: 2rem;
  text-align: center;
  color: #6b7280;
  font-size: 1.1rem;
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

.transaction-amount.INCOME {
  color: #059669;
}

.transaction-amount.EXPENSE {
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