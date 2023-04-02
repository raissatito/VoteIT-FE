import axios from "axios";

const baseUrl = "http://localhost:8000";

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

export const getAllRooms = async (body) => {
    try {
        const response = await axios.get(`${baseUrl}/get-all-rooms`, body, getConfig());
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export const createRoom = async (body) => {
    try {
        const response = await axios.post(`${baseUrl}/create-room`, body, getAuthConfig());
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export const createVoteOptions = async (body) => {
    try {
        const response = await axios.post(`${baseUrl}/create-option`, body, getAuthConfig());
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export const getRoomDetail = async (roomId) => {
    try {
        const response = await axios.get(`${baseUrl}/get-room/${roomId}`, getConfig());
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export const getVoteOptions = async (roomId) => {
    try {
        const response = await axios.get(`${baseUrl}/get-vote-option/${roomId}`, getConfig());
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export const vote = async (body) => {
    try {
        const response = await axios.post(`${baseUrl}/vote`, body, getAuthConfig());
        return response.data;
    } catch (error) {
        console.log(error);
    }
}