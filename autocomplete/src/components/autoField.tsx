import React, {useState, useEffect, SyntheticEvent} from "react";
import { Autocomplete, TextField } from "@mui/material";
import useSuggestion from "../hooks/useSuggestions";
import { Box } from "@mui/material";

const AutoField: React.FC = () => {
    const [ value, setValue ] = useState<string | null>(null);
    const [ inputValue, setInputValue ] = useState<string>(""); 
    const [ options, setOptions ] = useState<string[]>([]);
    const [ t , setT] = useState<any>(null);
    const { suggestions, handleGetSuggestions, handleSearch, searchedWord} = useSuggestion();

    useEffect(() => {
        setOptions(suggestions);
    }, [suggestions]);

    useEffect(() => {
        return () => {
            clearTimeout(t);
            setT(null);
        };
    }, [inputValue]);
   
    const handleValueChange = async (e: SyntheticEvent<Element, Event>, newValue: string|null) => {
        setValue(newValue);
        if (newValue) {
            console.log("newValue", newValue)
            await handleSearch(newValue);
            setOptions([]);
        }
    }

    const handleInputValueChange = async (e: SyntheticEvent<Element, Event>, newInputValue: string, reason: string) => {
        setInputValue(newInputValue);

        if (reason == "input" && newInputValue.length >= 2) {
            setT(setTimeout(() => {
                console.log("inputValue", newInputValue)
                handleGetSuggestions(newInputValue);
            }, 1000))
        }
    }

    return (
        <Box sx={{paddingTop:4}}>
            <Autocomplete
                inputValue={inputValue}
                value={value}
                onInputChange={handleInputValueChange}
                onChange={handleValueChange}
                id="autocomplete-trie"
                options={options}
                getOptionLabel={(option) => option}
                style={{ width: 300 }}
                renderInput={(params) => (
                <TextField {...params} label="Autocomplete" variant="outlined" />
                )}
                open={options.length > 0}
                filterOptions={(options) => options} 
            />
            <Box sx={{paddingTop: 4}}>
                {searchedWord && `Search result for ${searchedWord}`} 
                {!searchedWord && "Start searching"}
            </Box>
        </Box>
        
    )
}

export default AutoField;