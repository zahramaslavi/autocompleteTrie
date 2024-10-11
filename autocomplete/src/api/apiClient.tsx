import axios from "axios";
import TrieNode from "../models/trieNode";


const apiClient = axios.create({
    baseURL: "http://localhost:3001",
    headers: {
        "Content-Type": "application/json",
    },
});

export const getSuggestions= async (prefix: string): Promise<string[]> => {
    try {
        const res = await apiClient.get(`/suggestions/${prefix}`);
        return res.data;
    } catch (error) {
        console.log(`Failed to load options: ${error}`);
        throw error;
    }
}

export const searchWord = async (searchWord: string): Promise<boolean> => {
    try {
        const res = await apiClient.get(`/search/${searchWord}`);
        return res.data;
    } catch (error) {
        console.log(`Failed to search word ${searchWord} : ${error}`);
        throw error;
    }
}

// This was intended for usage in a Trie graph with D3. However, I did not like the feature and I removed the graph part from the code 
export const fullTrieJson: any = async (): Promise<TrieNode> => {
    try {
        const res = await apiClient.get("/trie/fullTree");
        return res.data;
    } catch (error) {
        console.log(`Failed to fetch trie: ${error}`);
        throw error;
    }
} 
