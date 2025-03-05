import { createContext, useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { getCookie, setCookie } from "../axiosConfig/cookieFunc";
import axiosInstance from "../axiosConfig/axiosConfig";

// Create User Context
const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const addDefaultCategories = async(userId)=>{
    try {
        const response = await axiosInstance.post(`/category/add-default/${userId}`)
        if(response.data){
            console.log("response : " , response.data);
        }
    } catch (error) {
        console.log("error : " , error)
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      let userId = getCookie("user");

      if (!userId) {
        userId = uuidv4();
        addDefaultCategories(userId);
        
        setCookie("user", userId);
      }

      setUser(userId);
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to access user context
export const useUser = () => useContext(UserContext);
