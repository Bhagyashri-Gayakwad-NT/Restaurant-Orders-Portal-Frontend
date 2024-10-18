import axios from "axios";

export const login = async (payload) => {
    return await axios.post(`http://localhost:100/users/login`, payload);
}

export const register = async (payload) => {
    return await axios.post(`http://localhost:100/users/register`, payload);
}
