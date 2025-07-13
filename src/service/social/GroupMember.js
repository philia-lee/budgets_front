import axiosInstance from "../axiosInstance";

export default {
  //그룹 멤버 초대
  async inviteMember(groupId, targetId) {
    try {
      const response = await axiosInstance.post(
        `/api/groups/${groupId}/members/invite`,
        { targetId }
      );
      return response.data?.message || "success";
    } catch (err) {
      console.error(err.response?.data?.message);
      return err.response?.data?.message || "error";
    }
  },

  // 그룹 멤버 강퇴 or 자발적 탈퇴
  async removeMember(groupId, memberId) {
    try {
      const response = await axiosInstance.delete(
        `/api/groups/${groupId}/members/${memberId}`
      );
      return response.data?.message || "success";
    } catch (err) {
      console.error(err.response?.data?.message);
      return err.response?.data?.message || "error";
    }
  },

  // 특정 멤버 조회
  async getMember(groupId, memberId) {
    try {
      const response = await axiosInstance.get(
        `/api/groups/${groupId}/members/${memberId}`
      );
      return response.data; // GroupMemberResponse 객체
    } catch (err) {
      console.error(err.response?.data?.message);
      return null;
    }
  },
};
