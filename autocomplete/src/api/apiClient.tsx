import axios from "axios";


const apiClient = axios.create({
    baseURL: "http://localhost:3001",
    headers: {
        "Content-Type": "application/json",
    },
});

export const getSuggestions: any = async (searchWord: string) => {
    try {
        const res = await apiClient.get(`/search/suggestions/${searchWord}`);
        return res.data;
    } catch (error) {
        console.log("Failed to load options");
        throw error;
    }
}