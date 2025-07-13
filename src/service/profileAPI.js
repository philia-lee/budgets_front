import axiosInstance from "./axiosInstance"
export default {

    async show()
    {
        try{
        const response = await axiosInstance.get("/api/profile")

        return response.data;
     }
     catch(err)
     {
        
     }
    },

    async update(editData)
    {
        try{
            const response = await axiosInstance.patch("/api/profile",
                {
                    "nickname": editData.name,
                    "birthdate": editData.birthdate,
                    "gender": editData.gender,
                }
            )
        }
        catch(err)
        {
            throw err.response
        }
    }

}