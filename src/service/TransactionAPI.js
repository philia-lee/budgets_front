import axiosInstance from "./axiosInstance";

export default {
  async add(form) {
    try {
      console.log(form.category);
      const response = await axiosInstance.post('/api/trans', {
        "amount": form.amount,
        "type": form.type,
        "category": form.category,
        "description": form.description,
        "date": form.date
      });
      return response.data;
    } catch (err) {
      console.error("거래 추가 실패:", err);
      throw err; 
    }
  },

  async list() {
    try {
      const response = await axiosInstance.get('/api/trans');
      console.log(response);
      return response.data;
    } catch (err) {
      console.error("거래 목록 조회 실패:", err);
      throw err;
    }
  },

  async delete(id) {
    try {
      const response = await axiosInstance.delete(`api/trans/${id}`);
      return response.data;
    } catch (err) {
      console.error(`거래 삭제 실패 (ID: ${id}):`, err);
      throw err;
    }
  },

  async getById(id) {
    try {
      const response = await axiosInstance.get(`/api/trans/${id}`);
      console.log(`거래 ID ${id} 조회 결과:`, response.data);
      return response.data;
    } catch (err) {
      console.error(`거래 조회 실패 (ID: ${id}):`, err);
      throw err;
    }
  },

  async update(id, form) {
    try {
      const payload = {
        "type": form.type,
        "amount": form.amount,
        "category": form.category,
        "description": form.description,
        "date": form.date 
      };
      console.log(payload)
      const response = await axiosInstance.patch(`/api/trans/${id}`, payload); 
      console.log(`거래 ID ${id} 수정 완료:`, response.data);
      return response.data;
    } catch (err) {
      console.error(`거래 수정 실패 (ID: ${id}):`, err);
      throw err;
    }
  },

  async getCategories() {
    try {
      const response = await axiosInstance.get('/api/category');
      console.log(response);
      return response.data;
    } catch (err) {
      console.error("카테고리 조회 실패:", err);
      throw err;
    }
  }
};