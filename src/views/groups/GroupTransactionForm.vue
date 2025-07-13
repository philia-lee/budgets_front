<template>
  <div class="form-container">
    <div class="form-card">
      <h2 class="form-title">
        {{ isEdit ? "거래 수정" : "새 거래 추가" }}
      </h2>

      <form @submit.prevent="handleSubmit" class="transaction-form">
        <div class="form-group">
          <label class="form-label">유형</label>
          <div class="radio-group">
            <label class="radio-option">
              <input
                v-model="form.type"
                type="radio"
                value="INCOME"
                class="radio-input"
              />
              <span class="radio-label">수입</span>
            </label>
            <label class="radio-option">
              <input
                v-model="form.type"
                type="radio"
                value="EXPENSE"
                class="radio-input"
              />
              <span class="radio-label">지출</span>
            </label>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">금액</label>
          <input
            v-model.number="form.amount"
            type="number"
            required
            class="form-input"
            placeholder="금액을 입력하세요"
          />
        </div>

        <div class="form-group">
          <label class="form-label">카테고리</label>
          <select v-model.number="form.categoryId" required class="form-select">
            <option value="">카테고리 선택</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">내용</label>
          <input
            v-model="form.description"
            type="text"
            required
            class="form-input"
            placeholder="거래 내용을 입력하세요"
          />
        </div>

        <div class="form-group" v-if="isEdit">
          <label class="form-label">날짜</label>
          <input v-model="form.date" type="date" required class="form-input" />
        </div>

        <div class="button-group">
          <button type="submit" class="submit-button">
            {{ isEdit ? "수정" : "추가" }}
          </button>
          <button type="button" @click="$router.go(-1)" class="cancel-button">
            취소
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { watch } from "vue";
import GroupTransaction from "@/service/social/GroupTransaction";

const router = useRouter();
const route = useRoute();

const groupId = route.params.groupId;

const transactionId = route.params.transactionId;
const isEdit = computed(() => !!transactionId);

const form = ref({
  type: "INCOME",
  amount: "",
  categoryId: "",
  description: "",
  date: new Date().toISOString().split("T")[0],
});

const categories = ref([]);

const loadingCategories = ref(true);

const fetchCategories = async () => {
  loadingCategories.value = true;
  try {
    const data = await GroupTransaction.getCategories();
    categories.value = data;
  } catch (err) {
    alert("카테고리 불러오기 실패");
  } finally {
    loadingCategories.value = false;
  }
};

async function handleSubmit() {
  try {
    if (isEdit.value) {
      console.log("거래 수정:", form.value);

      const payload = {
        ...form.value,
        amount: Number(form.value.amount),
        categoryId: Number(form.value.categoryId),
      };

      const result = await GroupTransaction.updateTransaction(
        groupId,
        transactionId,
        payload
      );

      if (result === "success" || result.includes("successfully")) {
        alert("거래가 수정되었습니다.");
        router.replace(`/groups/${groupId}`);
      } else {
        alert("거래 수정 실패: " + result);
      }
    } else {
      const payload = {
        ...form.value,
        amount: Number(form.value.amount),
        categoryId: Number(form.value.categoryId),
      };

      console.log("payload:", payload);

      const result = await GroupTransaction.createTransaction(groupId, payload);

      if (result === "success" || result.includes("successfully")) {
        console.log(form.value.categoryId);
        alert("거래가 추가되었습니다.");
        router.replace(`/groups/${groupId}`);
      } else {
        alert("거래 추가 실패: " + result);
      }
    }
  } catch (error) {
    console.error("저장 실패:", error);
    alert("서버 오류가 발생했습니다.");
  }
}

const fetchTransaction = async () => {
  if (!isEdit.value) return;

  try {
    const data = await GroupTransaction.fetchOne(groupId, transactionId);
    form.value = {
      type: data.type,
      amount: data.amount,
      categoryId: data.categoryId,
      description: data.description,
      date: data.date.split("T")[0], // yyyy-MM-dd
    };
  } catch (err) {
    alert("거래 정보를 불러오지 못했습니다.");
    router.go(-1);
  }
};

onMounted(async () => {
  await fetchCategories();
  await fetchTransaction();
});
</script>

<style scoped>
.form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
  padding: 2rem;
}

.form-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  padding: 3rem;
  width: 100%;
  max-width: 500px;
}

.form-title {
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 2rem;
  color: #1f2937;
}

.transaction-form {
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

.radio-group {
  display: flex;
  gap: 2rem;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.radio-input {
  width: 1.2rem;
  height: 1.2rem;
  accent-color: #2563eb;
}

.radio-label {
  font-weight: 500;
  color: #374151;
}

.form-input,
.form-select {
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.form-select {
  background: white;
  cursor: pointer;
}

.button-group {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.submit-button {
  flex: 1;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.submit-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
}

.cancel-button {
  flex: 1;
  background: #6b7280;
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.cancel-button:hover {
  background: #4b5563;
}

@media (max-width: 480px) {
  .form-card {
    padding: 2rem;
  }

  .radio-group {
    gap: 1rem;
  }

  .button-group {
    flex-direction: column;
  }
}
</style>
