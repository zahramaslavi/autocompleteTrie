import React, {useState} from "react";
import { getSuggestions } from "../api/apiClient";

const UseSuggestion = () => {
    const [ suggestions, setSuggestions ] = useState([]);
    const [ loading, setLoading ] = useState(false);

    const handleGetSuggestions = async (word: string) => {
        const sugg = await getSuggestions(word);
        setSuggestions(sugg);
    }


    return {
        suggestions,
        loading,
        handleGetSuggestions
    }
}

export default UseSuggestion;