import axiosInstance from "./axiosInstance";

export default {
    
    async add(form) {
    try {
      console.log(form.category)
        const response = await axiosInstance.post('/api/trans', 
         {
            "amount": form.amount,
            "type": form.type,
            "category_id":  parseInt(form.category),
            "description": form.description,
            "date": form.date
            }
        )

      return response.data
      
    } catch (err) {
      // 에러발생시 error글자 리턴

      return 'error'
    }

  },

}
