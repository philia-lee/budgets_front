import axiosInstance from "./axiosInstance";


export default {

    async register(form)
    {
        try{
        const response = await axiosInstance.post("/api/auth/register",
        {
            "email": form.email,
            "password": form.password,
            "nickname": form.nickname,
            "birthdate": form.age,
            "gender": form.gender
        })
        
        return "success"
        
        }
    catch(err)
    {
        console.log("안의 콘솔")
        console.log(err.response?.data?.message)
        return err.response?.data?.message
    }
}

}