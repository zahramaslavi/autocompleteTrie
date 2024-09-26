import axios from "axios";


const apiClient = axios.create({
    baseURL: "http://localhost:3001",
    headers: {
        "Content-Type": "application/json",
    },
});

export const getSuggestions: any = async (prefix: string) => {
    try {
        const res = await apiClient.get(`/search/suggestions/${prefix}`);
        return res.data;
    } catch (error) {
        console.log("Failed to load options");
        throw error;
    }
}

export const searchWord: any = async (searchWord: string) => {
    try {
        const res = await apiClient.get(`/search/${searchWord}`);
        return res.data;
    } catch (error) {
        console.log(`Failed to search word ${searchWord}`);
        throw error;
    }
} 