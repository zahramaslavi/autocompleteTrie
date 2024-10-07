import React, {useState} from "react";
import { getSuggestions, searchWord } from "../api/apiClient";

const UseSuggestion = () => {
    const [ suggestions, setSuggestions ] = useState([]);
    const [ loading, setLoading ] = useState(false);


    const handleGetSuggestions = async (word: string) => {
        const sugg = await getSuggestions(word);
        setSuggestions(sugg);
    }

    const handleSearch = async (word: string) => {
        const res = await searchWord(word);
        console.log(res)
    }


    return {
        suggestions,
        loading,
        handleGetSuggestions,
        handleSearch
    }
}

export default UseSuggestion;