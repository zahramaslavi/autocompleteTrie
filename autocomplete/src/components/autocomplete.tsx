import React, {useState, useEffect} from "react";
import { Autocomplete, TextField } from "@mui/material";
import useSuggestion from "../hooks/useSuggestions";

const AutoField = () => {
    const [ value, setValue ] = useState<string | null>(null);
    const [ inputValue, setInputValue ] = useState<string>(""); 
    const [ options, setOptions ] = useState<string[]>([]);
    const [ debouncedVal, setDebouncedVal ] = useState<string>("");
    const { suggestions, loading, handleGetSuggestions} = useSuggestion();

    // const handleInputChange = (val: string) => {
    //     console.log("val", val)
    //     setInputValue(val);
        
    // }

    useEffect(() => {
        const t = setTimeout(() => {
            console.log(inputValue)
            setDebouncedVal(inputValue)
            
        }, 1000);

        return () => clearTimeout(t);
    }, [inputValue]);

    useEffect(() => {
        handleGetSuggestions(debouncedVal);
        if (suggestions.length) {
            setOptions(suggestions);
        }
        
        console.log(options)
    }, [debouncedVal, suggestions]);

    return (
        <Autocomplete
            inputValue={inputValue}
            value={value}
            onInputChange={(e: any, newInputValue: string) => setInputValue(newInputValue)}
            onChange={(e: any, newValue: string | null) => {
                setValue(newValue);
            }}
            id="combo-box-demo"
            options={options}
            getOptionLabel={(option) => option}
            style={{ width: 300 }}
            renderInput={(params) => (
            <TextField {...params} label="Combo box" variant="outlined" />
            )}
            open={options.length > 0}
            filterOptions={(options) => options} 
      />
    )
}

export default AutoField;