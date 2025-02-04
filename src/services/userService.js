import axios from "axios";

export const createUser = async(token,uid,email,name ="Guest") =>{
    let data= {
        uid:uid,
        email:email,
        name : name
    }
    try{
        // Create new user
       let response = await axios.post("https://talksphere-nyay.onrender.com/api/users",data, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        return response.data.user
    }catch (error) {
        console.log(error);
        
    }
}

export const getUser = async(token) =>{
   
    try{
        // Create new user
       let response =  await axios.get("https://talksphere-nyay.onrender.com/api/users", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        console.log(response);
        console.log(response.data.user);
      return response.data.user
        
    }catch (error) {
      if (error.response) {
        console.error("Error fetching user:", error.response.data);
        return { error: true, status: error.response.status };
    } else {
        console.error("Unexpected error:", error);
        return { error: true, status: 500 };
    } 
    }
}


