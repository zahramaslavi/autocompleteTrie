import React, {useState, useEffect} from "react";
import { getSuggestions, searchWord, fullTrieJson } from "../api/apiClient";
import UseSuggestionReturnI from "../models/useSuggestionReturnI";
import TrieNode from "@/models/trieNode";

// Todo: handle unhappy pathes too

const UseSuggestion = (): UseSuggestionReturnI => {
    const [ suggestions, setSuggestions ] = useState<string[]>([]);
    const [ loading, setLoading ] = useState<boolean>(false);
    const [trieJson, setTrieJson] = useState<TrieNode|null>(null);
    const [ searchedWord, setSearchedWord ] = useState<string|null>(null);

    const handleGetSuggestions = async (word: string) => {
        const sugg = await getSuggestions(word);
        setSuggestions(sugg);
    }

    const handleSearch = async (word: string) => {
        const res = await searchWord(word);
        if (res) {
            setSearchedWord(word);
        }
    }

    useEffect(() => {
        (async () => {
            const trieJson = await fullTrieJson();
            if (trieJson) {
                setTrieJson(trieJson);
            }
        })() 
    }, []);

    return {
        suggestions,
        loading,
        searchedWord,
        trieJson,
        handleGetSuggestions,
        handleSearch
    }
}

export default UseSuggestion;