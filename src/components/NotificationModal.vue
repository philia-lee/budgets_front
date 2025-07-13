<template>
  <div v-if="show" class="modal-overlay" @click="close">
    <div class="modal-content" @click.stop>
      <h3 class="modal-title">알림</h3>
      <div v-for="n in unreadNotifications" :key="n.id" class="notification-msg">
        {{ n.message }}
      </div>
      <button class="close-btn" @click="close">닫기</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import axiosInstance from '@/service/axiosInstance'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const show = ref(false)
const unreadNotifications = ref([])

const fetchNotifications = async () => {
  if (!userStore.user || !userStore.user.id) return
  const res = await axiosInstance.get(`/api/notifications/${userStore.user.id}`)
  unreadNotifications.value = res.data.filter(n => !n.isRead)
  show.value = unreadNotifications.value.length > 0
}

const close = async () => {
  show.value = false
  for (const n of unreadNotifications.value) {
    await axiosInstance.patch(`/api/notifications/${userStore.user.id}`, { id: n.id, isRead: true })
  }
  unreadNotifications.value = []
}

onMounted(() => {
  fetchNotifications()
  setInterval(fetchNotifications, 10000)
})
watch(() => userStore.user && userStore.user.id, fetchNotifications)
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  width: 100%; max-width: 400px;
  margin: 1rem;
}
.modal-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #1f2937;
}
.notification-msg {
  margin-bottom: 1rem;
  color: #dc2626;
  font-weight: 600;
}
.close-btn {
  background: #6b7280;
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
}
.close-btn:hover {
  background: #4b5563;
}
</style>
