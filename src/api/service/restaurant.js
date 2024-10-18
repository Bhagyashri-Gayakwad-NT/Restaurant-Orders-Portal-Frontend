import axios from "axios";

export const getAllRestaurant = async () => {
    return await axios.get(`http://localhost:300/restaurant`);
}