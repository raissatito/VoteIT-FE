import axios from "axios";

const baseUrl = "http://localhost:8000/auth";

const getConfig = () => {
  return {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  };
}

const getAuthConfig = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  };
}

export const login = async (body) => {
    try {
        const response = await axios.post(`${baseUrl}/login`, body, getConfig());
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export const register = async (body) => {
    try {
        const response = await axios.post(`${baseUrl}/register`, body, getConfig());
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export const getUser = async () => {
    try {
        const response = await axios.get(`${baseUrl}/get-user`, getAuthConfig());
        return response.data;
    } catch (error) {
        console.log(error);
    }
}