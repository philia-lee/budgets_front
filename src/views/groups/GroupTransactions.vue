<template>
  <div class="transactions-container">
    <div class="header">
      <h2 class="page-title">그룹 내 거래 내역</h2>
      <div class="header-buttons">
        <button @click="showGroupManagement = true" class="manage-button">
          그룹 관리
        </button>
        <router-link
          :to="{ name: 'GroupTransactionCreate', params: { groupId } }"
          class="add-button"
        >
          새 거래 추가
        </router-link>
      </div>
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

    <!-- 그룹 관리 모달 -->
    <div
      v-if="showGroupManagement"
      class="modal-overlay"
      @click="showGroupManagement = false"
    >
      <div class="modal-content group-management-modal" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">그룹 관리</h3>
          <button @click="showGroupManagement = false" class="close-button">
            ✕
          </button>
        </div>

        <div class="modal-body">
          <!-- 그룹 정보 섹션 -->
          <div class="section">
            <h4 class="section-title">그룹 정보</h4>
            <div class="group-info-card">
              <div class="group-avatar-large">
                {{ groupInfo.groupName?.charAt(0) || "G" }}
              </div>
              <div class="group-details">
                <div v-if="!editingGroupName" class="group-name-display">
                  <h5>{{ groupInfo.groupName }}</h5>
                  <button
                    @click="editingGroupName = true"
                    class="edit-name-btn"
                  >
                    이름 변경
                  </button>
                </div>
                <div v-else class="group-name-edit">
                  <input
                    v-model="newGroupName"
                    type="text"
                    class="group-name-input"
                    @keyup.enter="updateGroupName"
                  />
                  <div class="edit-buttons">
                    <button @click="updateGroupName" class="save-btn">
                      저장
                    </button>
                    <button @click="cancelEditName" class="cancel-btn">
                      취소
                    </button>
                  </div>
                </div>
                <p class="member-count">멤버 {{ members.length }}명</p>
              </div>
            </div>
          </div>

          <!-- 멤버 관리 섹션 -->
          <div class="section">
            <div class="section-header">
              <h4 class="section-title">멤버 관리</h4>
              <button
                @click="showInviteForm = !showInviteForm"
                class="invite-btn"
              >
                멤버 초대
              </button>
            </div>

            <!-- 멤버 초대 폼 -->
            <div v-if="showInviteForm" class="invite-form">
              <div class="invite-input-group">
                <input
                  v-model="inviteNickName"
                  type="text"
                  placeholder="닉네임을 입력하세요"
                  class="invite-input"
                />
                <button @click="inviteMember" class="send-invite-btn">
                  초대 보내기
                </button>
              </div>
            </div>

            <!-- 멤버 목록 -->
            <div class="members-list">
              <div
                v-for="member in members"
                :key="member.userId"
                class="member-item"
              >
                <div class="member-info">
                  <div class="member-avatar">
                    {{ member.nickname?.charAt(0) || "U" }}
                  </div>
                  <div class="member-details">
                    <span class="member-name">{{ member.nickname }}</span>
                    <span class="member-email">{{ member.email }}</span>
                  </div>
                  <span v-if="member.role === 'OWNER'" class="owner-badge"
                    >방장</span
                  >
                </div>
                <div>
                  <button
                    v-if="member.role === 'MEMBER'"
                    @click="removeMember(member.userId)"
                    class="remove-member-btn"
                  >
                    강퇴
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 위험 구역 -->
          <div class="section danger-section">
            <h4 class="section-title danger-title">위험 구역</h4>
            <div class="danger-actions">
              <button @click="confirmDeleteGroup" class="delete-group-btn">
                그룹 삭제
              </button>
              <p class="danger-warning">
                그룹을 삭제하면 모든 거래 내역과 멤버가 영구적으로 삭제됩니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 삭제 확인 모달 -->
    <div
      v-if="showDeleteConfirm"
      class="modal-overlay"
      @click="showDeleteConfirm = false"
    >
      <div class="modal-content confirm-modal" @click.stop>
        <div class="confirm-header">
          <h3>그룹 삭제 확인</h3>
        </div>
        <div class="confirm-body">
          <p>
            정말로 <strong>{{ groupInfo.groupName }}</strong> 그룹을
            삭제하시겠습니까?
          </p>
          <p class="warning-text">
            이 작업은 되돌릴 수 없으며, 모든 거래 내역이 삭제됩니다.
          </p>
          <div class="confirm-buttons">
            <button @click="deleteGroup" class="confirm-delete-btn">
              삭제
            </button>
            <button @click="showDeleteConfirm = false" class="cancel-btn">
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import GroupTransaction from "@/service/social/GroupTransaction";
import groupApi from "@/service/social/Group";
import groupMemberApi from "@/service/social/GroupMember";

export default {
  name: "TransactionList",
  setup() {
    const router = useRouter();
    const route = useRoute();

    const groupId = route.params.groupId;
    const members = ref([]);
    const groupInfo = ref({});

    const loading = ref(false);
    const transactions = ref([]);
    const categories = ref([]);

    const filter = ref({
      period: "all",
      type: "all",
      category: "all",
    });

    // 그룹 관리 관련 상태
    const showGroupManagement = ref(false);
    const showInviteForm = ref(false);
    const showDeleteConfirm = ref(false);
    const editingGroupName = ref(false);
    const newGroupName = ref("");
    const inviteNickName = ref("");

    const fetchTransactions = async () => {
      loading.value = true;
      const data = await GroupTransaction.fetchAll(groupId);
      transactions.value = data;
      loading.value = false;
    };

    const fetchCategories = async () => {
      try {
        const data = await GroupTransaction.getCategories();
        categories.value = [{ id: 0, name: "all" }, ...data];
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

        if (type !== "all" && transaction.type !== type) {
          return false;
        }

        const categoryName = getCategoryName(transaction.categoryId);
        if (category !== "all" && categoryName !== category) {
          return false;
        }

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
        groupInfo.value = groupDetails;
        newGroupName.value = groupDetails.groupName;
      } catch (err) {
        alert("그룹 정보를 불러오지 못했습니다.");
      }
    };

    const perPerson = computed(() => {
      const count = members.value.length || 1;
      return Math.floor(netTotal.value / count);
    });

    // 그룹 관리 기능들
    const updateGroupName = async () => {
      if (!newGroupName.value.trim()) {
        alert("그룹 이름을 입력해주세요.");
        return;
      }

      try {
        const result = await groupApi.updateGroupName(
          groupId,
          newGroupName.value
        );
        if (result === "success") {
          groupInfo.value.groupName = newGroupName.value;
          editingGroupName.value = false;
          alert("그룹 이름이 변경되었습니다.");
        } else {
          alert("그룹 이름 변경에 실패했습니다.");
        }
      } catch (err) {
        alert("서버 오류가 발생했습니다.");
      }
    };

    const cancelEditName = () => {
      newGroupName.value = groupInfo.value.groupName;
      editingGroupName.value = false;
    };

    const inviteMember = async () => {
      if (!inviteNickName.value.trim()) {
        alert("닉네임을 입력해주세요.");
        return;
      }

      let targetUser = null;

      try {
        // 닉네임으로 유저 조회
        const result = await groupMemberApi.getUserByNickname(
          groupId, // 👈 여기 추가
          inviteNickName.value
        );
        targetUser = result;
        console.log("유저 조회 결과:", targetUser);
      } catch (err) {
        alert("유저를 찾을 수 없습니다.");
        return; // 유저 없으면 초대 진행 안 함
      }

      if (!targetUser) {
        alert("해당 닉네임을 가진 유저가 없습니다.");
        return;
      }

      try {
        // 유저의 id를 사용해 초대
        const result = await groupMemberApi.inviteMember(
          groupId,
          targetUser.id
        );
        console.log(result);
        if (result === "success") {
          alert("초대가 완료되었습니다.");
          inviteNickName.value = "";
          showInviteForm.value = false;
        } else {
          alert("초대 전송에 실패했습니다: " + result);
        }
      } catch (err) {
        alert("서버 오류가 발생했습니다.");
      }

      // 멤버 목록 다시 불러오기
      await fetchGroupMembers();
    };

    const removeMember = async (userId) => {
      if (confirm("정말로 이 멤버를 강퇴하시겠습니까?")) {
        try {
          const result = await groupMemberApi.removeMember(groupId, userId);
          if (result === "success") {
            members.value = members.value.filter((m) => m.userId !== userId);
            alert("멤버가 강퇴되었습니다.");
          } else {
            alert("멤버 강퇴에 실패했습니다: " + result);
          }
        } catch (err) {
          alert("서버 오류가 발생했습니다.");
        }
      }
    };

    const confirmDeleteGroup = () => {
      showDeleteConfirm.value = true;
    };

    const deleteGroup = async () => {
      try {
        const result = await groupApi.deleteGroup(groupId);
        if (result === "success") {
          alert("그룹이 삭제되었습니다.");
          router.push("/groups");
        } else {
          alert("그룹 삭제에 실패했습니다: " + result);
        }
      } catch (err) {
        alert("서버 오류가 발생했습니다.");
      }
      showDeleteConfirm.value = false;
    };

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
      groupInfo,
      showGroupManagement,
      showInviteForm,
      showDeleteConfirm,
      editingGroupName,
      newGroupName,
      inviteNickName,
      updateGroupName,
      cancelEditName,
      inviteMember,
      removeMember,
      confirmDeleteGroup,
      deleteGroup,
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

.header-buttons {
  display: flex;
  gap: 1rem;
}

.page-title {
  font-size: 2rem;
  font-weight: bold;
  color: #1f2937;
}

.manage-button {
  background: linear-gradient(135deg, #7c3aed, #5b21b6);
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.manage-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(124, 58, 237, 0.3);
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

/* 기존 스타일들... */
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
  background-color: #4caf50;
}

.summary-card.expense {
  background-color: #f44336;
}

.summary-card.net {
  background-color: #2196f3;
}

/* 모달 스타일 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  margin: 1rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.group-management-modal {
  max-width: 700px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #6b7280;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.close-button:hover {
  background: #f3f4f6;
}

.modal-body {
  padding: 2rem;
}

.section {
  margin-bottom: 2rem;
}

.section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

/* 그룹 정보 카드 */
.group-info-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 12px;
}

.group-avatar-large {
  width: 4rem;
  height: 4rem;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1.5rem;
}

.group-details {
  flex: 1;
}

.group-name-display {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.group-name-display h5 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.edit-name-btn {
  background: #e5e7eb;
  border: none;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.edit-name-btn:hover {
  background: #d1d5db;
}

.group-name-edit {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.group-name-input {
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
}

.group-name-input:focus {
  outline: none;
  border-color: #2563eb;
}

.edit-buttons {
  display: flex;
  gap: 0.5rem;
}

.save-btn {
  background: #2563eb;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.save-btn:hover {
  background: #1d4ed8;
}

.cancel-btn {
  background: #6b7280;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.cancel-btn:hover {
  background: #4b5563;
}

.member-count {
  margin: 0.5rem 0 0;
  color: #6b7280;
  font-size: 0.9rem;
}

/* 멤버 초대 */
.invite-btn {
  background: #10b981;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.invite-btn:hover {
  background: #059669;
}

.invite-form {
  background: #f0fdf4;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.invite-input-group {
  display: flex;
  gap: 0.5rem;
}

.invite-input {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #d1fae5;
  border-radius: 6px;
  font-size: 0.9rem;
}

.invite-input:focus {
  outline: none;
  border-color: #10b981;
}

.send-invite-btn {
  background: #10b981;
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.2s;
}

.send-invite-btn:hover {
  background: #059669;
}

/* 멤버 목록 */
.members-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.member-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.member-item:hover {
  background: #f3f4f6;
}

.member-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.member-avatar {
  width: 2.5rem;
  height: 2.5rem;
  background: #e5e7eb;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #374151;
}

.member-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.member-name {
  font-weight: 600;
  color: #1f2937;
}

.member-email {
  font-size: 0.8rem;
  color: #6b7280;
}

.owner-badge {
  background: #fbbf24;
  color: #92400e;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
}

.remove-member-btn {
  background: #fee2e2;
  color: #dc2626;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.remove-member-btn:hover {
  background: #fecaca;
}

/* 위험 구역 */
.danger-section {
  border-top: 2px solid #fee2e2;
  padding-top: 2rem;
}

.danger-title {
  color: #dc2626;
}

.danger-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.delete-group-btn {
  background: #dc2626;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  align-self: flex-start;
}

.delete-group-btn:hover {
  background: #b91c1c;
}

.danger-warning {
  color: #6b7280;
  font-size: 0.9rem;
  margin: 0;
}

/* 확인 모달 */
.confirm-modal {
  max-width: 400px;
}

.confirm-header {
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.confirm-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #dc2626;
}

.confirm-body {
  padding: 2rem;
}

.confirm-body p {
  margin-bottom: 1rem;
  color: #374151;
}

.warning-text {
  color: #dc2626;
  font-size: 0.9rem;
}

.confirm-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.confirm-delete-btn {
  flex: 1;
  background: #dc2626;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.confirm-delete-btn:hover {
  background: #b91c1c;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .header-buttons {
    justify-content: center;
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

  .modal-content {
    margin: 0.5rem;
    max-height: 95vh;
  }

  .modal-header,
  .modal-body {
    padding: 1.5rem;
  }

  .group-info-card {
    flex-direction: column;
    text-align: center;
  }

  .invite-input-group {
    flex-direction: column;
  }

  .confirm-buttons {
    flex-direction: column;
  }
}
</style>
