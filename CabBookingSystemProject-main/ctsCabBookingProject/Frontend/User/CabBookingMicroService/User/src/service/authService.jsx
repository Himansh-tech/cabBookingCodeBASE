import axios from "axios";

export const loginUser = async (credentials) => {
  const API_URL = "http://localhost:8086/auth/login";//gateway
  try {
    const response = await axios.post(API_URL, credentials);
    console.log(response.data);
    return response.data;//return data to handlesubmit in login
  } catch (error) {
    throw error.response?.data || { message: "Login failed" };
  }
};

export const handleProfileUpdate = async (userId, token, updatedUserData) => {
  const API_URL = `http://localhost:8086/api/v1/users/updateProfile/${userId}`;
  console.log("Inside HandleProfile");
  try {
    const response = await axios.put(API_URL, updatedUserData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log(response);
    return response.data; // Return data for success feedback in component
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error.response?.data || { message: "Profile update failed" };
  }
};

