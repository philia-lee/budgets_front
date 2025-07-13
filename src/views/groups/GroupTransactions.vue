<template>
  <div class="transactions-container">
    <div class="header">
      <h2 class="page-title">그룹 내 거래 내역</h2>
      <router-link
        :to="{ name: 'GroupTransactionCreate', params: { groupId } }"
        class="add-button"
      >
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
          <option v-for="cat in categories" :key="cat.id" :value="cat.name">
            {{ cat.name === "all" ? "모든 카테고리" : cat.name }}
          </option>
        </select>
      </div>
    </div>

    <div class="transactions-card">
      <div
        v-for="transaction in filteredTransactions"
        :key="transaction.transactionId"
        class="transaction-item"
      >
        <div class="transaction-info">
          <div class="transaction-desc">{{ transaction.description }}</div>
          <div class="transaction-meta">
            {{ getCategoryName(transaction.categoryId) }} •
            {{ transaction.date }}
          </div>
        </div>
        <div class="transaction-actions">
          <div :class="['transaction-amount', transaction.type.toLowerCase()]">
            {{ transaction.type === "INCOME" ? "+ " : "- " }}₩{{
              Number(transaction.amount).toLocaleString()
            }}
          </div>
          <div class="action-buttons">
            <button
              @click="editTransaction(transaction.transactionId)"
              class="action-button edit"
            >
              수정
            </button>
            <button
              @click="deleteTransaction(transaction.transactionId)"
              class="action-button delete"
            >
              삭제
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="summary-container">
      <div class="summary-card income">
        <h3>총 수입</h3>
        <p>₩{{ totalIncome.toLocaleString() }}</p>
      </div>
      <div class="summary-card expense">
        <h3>총 지출</h3>
        <p>₩{{ totalExpense.toLocaleString() }}</p>
      </div>
      <div class="summary-card net">
        <h3>합계</h3>
        <p>₩{{ (netTotal || 0).toLocaleString() }}</p>
        <small>1인당: ₩{{ (perPerson || 0).toLocaleString() }}</small>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import GroupTransaction from "@/service/social/GroupTransaction";
import groupApi from "@/service/social/Group";

export default {
  name: "TransactionList",
  setup() {
    const router = useRouter();
    const route = useRoute();

    const groupId = route.params.groupId;
    const members = ref([]);

    const loading = ref(false);
    const transactions = ref([]);
    const categories = ref([]);

    const filter = ref({
      period: "all",
      type: "all",
      category: "all",
    });

    const fetchTransactions = async () => {
      loading.value = true;
      const data = await GroupTransaction.fetchAll(groupId);
      transactions.value = data;
      loading.value = false;
    };

    const fetchCategories = async () => {
      try {
        const data = await GroupTransaction.getCategories();
        categories.value = [
          { id: 0, name: "all" }, // 모든 카테고리
          ...data,
        ];
      } catch (err) {
        alert("카테고리 불러오기 실패");
      }
    };

    const getCategoryName = (categoryId) => {
      const category = categories.value.find((cat) => cat.id === categoryId);
      return category
        ? category.name === "all"
          ? "모든 카테고리"
          : category.name
        : "알수없음";
    };

    const filteredTransactions = computed(() => {
      return transactions.value.filter((transaction) => {
        const { type, category, period } = filter.value;

        // type
        if (type !== "all" && transaction.type !== type) {
          return false;
        }

        // category
        const categoryName = getCategoryName(transaction.categoryId);
        if (category !== "all" && categoryName !== category) {
          return false;
        }

        // period
        const today = new Date();
        const date = new Date(transaction.date);

        if (period === "today") {
          if (date.toDateString() !== today.toDateString()) return false;
        } else if (period === "week") {
          const startOfWeek = new Date(today);
          startOfWeek.setDate(today.getDate() - today.getDay());
          if (date < startOfWeek) return false;
        } else if (period === "month") {
          if (
            date.getMonth() !== today.getMonth() ||
            date.getFullYear() !== today.getFullYear()
          )
            return false;
        }

        return true;
      });
    });

    const editTransaction = (id) => {
      router.push(`/groups/${groupId}/transactions/${id}/edit`);
    };

    const deleteTransaction = async (id) => {
      if (confirm("정말 삭제하시겠습니까?")) {
        const result = await GroupTransaction.deleteTransaction(groupId, id);
        if (result === "success") {
          transactions.value = transactions.value.filter(
            (t) => t.transactionId !== id
          );
        } else {
          alert("삭제에 실패했습니다: " + result);
        }
      }
    };

    const totalIncome = computed(() => {
      return filteredTransactions.value
        .filter((t) => t.type === "INCOME")
        .reduce((sum, t) => sum + Number(t.amount), 0);
    });

    const totalExpense = computed(() => {
      return filteredTransactions.value
        .filter((t) => t.type === "EXPENSE")
        .reduce((sum, t) => sum + Number(t.amount), 0);
    });

    const netTotal = computed(() => totalIncome.value - totalExpense.value);

    const fetchGroupMembers = async () => {
      try {
        const groupDetails = await groupApi.fetchGroupDetails(groupId);
        members.value = groupDetails.members || [];
      } catch (err) {
        alert("그룹 멤버 불러오기 실패");
      }
    };

    // 1인당 금액 계산
    const perPerson = computed(() => {
      const count = members.value.length || 1;
      return Math.floor(netTotal.value / count);
    });

    onMounted(() => {
      fetchCategories();
      fetchTransactions();
      fetchGroupMembers();
    });

    return {
      filter,
      transactions,
      filteredTransactions,
      editTransaction,
      deleteTransaction,
      loading,
      categories,
      getCategoryName,
      totalIncome,
      totalExpense,
      netTotal,
      perPerson,
      members,
    };
  },
};
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

.summary-container {
  display: flex;
  justify-content: space-around;
  gap: 1rem;
  margin: 1rem 0;
}

.summary-card {
  flex: 1;
  text-align: center;
  padding: 1rem;
  border-radius: 8px;
  color: #fff;
  font-weight: bold;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.summary-card h3 {
  margin: 0;
  font-size: 1rem;
  opacity: 0.8;
}

.summary-card p {
  margin: 0.5rem 0 0;
  font-size: 1.2rem;
}

.summary-card.income {
  background-color: #4caf50; /* 초록 */
}

.summary-card.expense {
  background-color: #f44336; /* 빨강 */
}

.summary-card.net {
  background-color: #2196f3; /* 파랑 */
}
</style>
