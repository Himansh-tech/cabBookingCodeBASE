import axios from 'axios';

const BASE_API_URL = "http://localhost:8086/auth";//api gateway

//sending user registration data to backend
const registerUser = async (userData) => {
    try {
        console.log("Sending user data:", userData);
        const response = await axios.post(`${BASE_API_URL}/register/user`, userData);//pause here until data is done sendin and gets repsone back
        //call api gateway, there request is sent to RouteValidator for checking
        
        
        if (response.status == 200 || response.status == 201) {
            const backendResponse = response.data; 
            console.log("Full backend response:", backendResponse);

           
            const userDataFromResponse = backendResponse.data;

            return backendResponse; // Return the full backend response for further handling if needed
        } else {
            console.warn(`Unexpected status code: ${response.status}`);
            throw new Error(`Registration failed with status code ${response.status}`);
        }
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || "Unknown error occurred";//error.meesage is axios's default error message
        console.error("Registration error:", errorMessage);
        throw new Error(errorMessage);//can be catche by handlesubmit
    }
};

const registerService = {
    registerUser,
};

export default registerService;
