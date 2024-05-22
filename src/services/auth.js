import axios from "./axios";

export const getFonctions = () => axios.get(`/fonction`);

export default {
    getFonctions
}
