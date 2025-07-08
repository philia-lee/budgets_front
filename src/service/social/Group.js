import axiosInstance from "./axiosInstance";

export default {
  // 그룹 생성
  async createGroup(name) {
    try {
      await axiosInstance.post("/groups", { name });
      return "success";
    } catch (err) {
      console.log(err.response?.data?.message);
      return err.response?.data?.message;
    }
  },

  // 그룹 이름 수정
  async updateGroupName(groupId, name) {
    try {
      await axiosInstance.put(`/groups/${groupId}`, { name });
      return "success";
    } catch (err) {
      console.log(err.response?.data?.message);
      return err.response?.data?.message;
    }
  },

  // 그룹 삭제
  async deleteGroup(groupId) {
    try {
      await axiosInstance.delete(`/groups/${groupId}`);
      return "success";
    } catch (err) {
      console.log(err.response?.data?.message);
      return err.response?.data?.message;
    }
  },

  // 내가 속한 그룹 목록 조회
  async fetchMyGroups() {
    try {
      const response = await axiosInstance.get("/groups");
      return response.data;
    } catch (err) {
      console.log(err.response?.data?.message);
      return err.response?.data?.message;
    }
  },

  // 특정 그룹 상세 조회
  async fetchGroupDetails(groupId) {
    try {
      const response = await axiosInstance.get(`/groups/${groupId}`);
      return response.data;
    } catch (err) {
      console.log(err.response?.data?.message);
      return err.response?.data?.message;
    }
  },
};
