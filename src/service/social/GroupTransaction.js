import axiosInstance from "../axiosInstance";

export default {
  // 그룹 거래 생성
  async createTransaction(groupId, payload) {
    try {
      const response = await axiosInstance.post(
        `/api/groups/${groupId}/transactions`,
        payload
      );
      return response.data?.message || "success";
    } catch (err) {
      console.error(err.response?.data?.message);
      return err.response?.data?.message || "error";
    }
  },

  // 그룹 거래 수정
  async updateTransaction(groupId, transactionId, payload) {
    try {
      const response = await axiosInstance.put(
        `/api/groups/${groupId}/transactions/${transactionId}`,
        payload
      );
      return response.data?.message || "success";
    } catch (err) {
      console.error(err.response?.data?.message);
      return err.response?.data?.message || "error";
    }
  },

  //@param {number} groupId
  async fetchAll(groupId) {
    try {
      const response = await axiosInstance.get(
        `/api/groups/${groupId}/transactions`
      );
      return response.data || [];
    } catch (err) {
      console.error(err.response?.data?.message);
      return [];
    }
  },

  // 내가 등록한 거래 조회
  async fetchByUser(groupId) {
    try {
      const response = await axiosInstance.get(
        `/api/groups/${groupId}/transactions/user`
      );
      return response.data || [];
    } catch (err) {
      console.error(err.response?.data?.message);
      return [];
    }
  },

  // 특정 기간 거래 조회
  async fetchByPeriod(groupId, startDate, endDate) {
    try {
      const response = await axiosInstance.get(
        `/api/groups/${groupId}/transactions/period`,
        {
          params: { startDate, endDate },
        }
      );
      return response.data || [];
    } catch (err) {
      console.error(err.response?.data?.message);
      return [];
    }
  },

  // 거래 삭제
  async deleteTransaction(groupId, transactionId) {
    try {
      const response = await axiosInstance.delete(
        `/api/groups/${groupId}/transactions/${transactionId}`
      );
      return response.data?.message || "success";
    } catch (err) {
      console.error(err.response?.data?.message);
      return err.response?.data?.message || "error";
    }
  },

  // 그룹 정산 결과 조회
  async fetchSettlement(groupId) {
    try {
      const response = await axiosInstance.get(
        `/api/groups/${groupId}/transactions/settlement`
      );
      return response.data || [];
    } catch (err) {
      console.error(err.response?.data?.message);
      return [];
    }
  },

  // 이번달 요약
  async fetchMonthlySummary(groupId) {
    try {
      const response = await axiosInstance.get(`/api/groups/${groupId}/transactions/summary`);
      return response.data;
    } catch (err) {
      console.error(err.response?.data?.message);
      return null;
    }
  },
};
