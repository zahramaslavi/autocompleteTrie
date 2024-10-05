import React, {useState, useEffect} from "react";
import { getSuggestions, searchWord, getCount } from "../api/apiClient";

const UseSuggestion = () => {
    const [ suggestions, setSuggestions ] = useState([]);
    const [ loading, setLoading ] = useState(false);
    const [ count, setCount ] = useState(0);

    useEffect(() => {
        (async () => {
            const cnt = await getCount();
            setCount(cnt)
        })()
    }, []);

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
        count,
        handleGetSuggestions,
        handleSearch
    }
}

export default UseSuggestion;