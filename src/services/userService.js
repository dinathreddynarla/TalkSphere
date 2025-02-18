import axios from "axios";
import { baseUrl } from "../App";

export const createUser = async(token,uid,email,name) =>{
    let data= {
        uid:uid,
        email:email,
        name : name
    }
    try{
        // Create new user
       let response = await axios.post(`${baseUrl}/users`,data, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        return response.data.user
    }catch (error) {
        console.log(error);
        
    }
}

export const updateUser = async(token,userData) =>{
  try{

    //console.log(userData);
    
     let response = await axios.put(`${baseUrl}/users`,userData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        //console.log(response.data.user);
      return response.data.user
  }catch (error) {
      console.log(error);
      
  }
}

export const getUser = async(token) =>{
   
    try{
        // Create new user
       let response =  await axios.get(`${baseUrl}/users`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        //console.log(response);
        //console.log(response.data.user);
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


