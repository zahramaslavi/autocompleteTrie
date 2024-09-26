import { Request, Response } from "express";
import Trie from "../repository/trie";

let trie: Trie | null = null;

interface wordsI {
    [key: string]: number;
}

export const initTrie = () => {
    trie = new Trie();
    const words: wordsI = {"best": 10, "bet": 5, "buy": 3, "bee": 4, "bar": 11, "current": 9, "currency": 3, "car": 19, "read": 30, "red": 5, "reading": 4, "beg": 7, "boom": 4, "broom":3, "khoshkholgh": 100, "khosh": 3, "khoshahang": 1};
    
    for (const word in words) {
        trie.insert(word, words[word]);
    }
}

export const searchWord = async (req: Request, res: Response) => {
    try {
        const word = req.params.word;
        const found = trie?.search(word);

        if (!found) {
            // todo: write to log file to be process by worker 
            // or directly somehow send to worker if possible
        }

        res.send(found);
    } catch (error) {
        console.log(`Error happened searching ${req.params.word} : ${error}`);
    }
}

export const getSuggestions = async (req: Request, res: Response) => {
    try {
        const word = req.params.word;
        const suggestions = trie?.topSuggestions(word);

        if (suggestions) {
            res.send(suggestions);
        } else {
            res.status(400).send(`There was an issue getting suggestions for ${word}`);
        }
    } catch (error) {
        console.log(`Error happened searching ${req.params.word} : ${error}`);
    }
}
