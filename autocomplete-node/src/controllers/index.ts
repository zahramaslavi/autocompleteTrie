import { Request, Response } from "express";
import TrieRedis from "../repository/trieRedis";
const winston = require('winston');

// Create a logger instance
const logger = winston.createLogger({
    level: 'info',  // Log level (error, warn, info, verbose, debug, silly)
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),   // Output to console
        new winston.transports.File({ filename: 'logs/app.log' })  // Output to file
    ],
});

let trieRedis: TrieRedis | null = new TrieRedis();

interface wordsI {
    [key: string]: number;
}

export const initTrie = async () => {
    const words: wordsI = {"best": 10, "bet": 5, "buy": 3, "bee": 4, "bar": 11, "current": 9, "currency": 3, "car": 19, "read": 30, "red": 5, "reading": 4, "beg": 7, "boom": 4, "broom":3, "khoshkholgh": 100, "khosh": 3, "khoshahang": 1};
    
    for (const word in words) {
        const res = await trieRedis.insert(word, words[word]);
    }
}

export const searchWord = async (req: Request, res: Response) => {
    try {
        const word = req.params.word;
        const found = await trieRedis?.search(word);
        
        logger.info(word);
        console.log(found);
        console.log(word);
        res.send(found);
    } catch (error) {
        console.log(`Error happened searching ${req.params.word} : ${error}`);
    }
}

export const getSuggestions = async (req: Request, res: Response) => {
    try {
        const word = req.params.word;
        const suggestions = await trieRedis?.topSuggestions(word);

        if (suggestions) {
            res.send(suggestions);
        } else {
            res.status(400).send(`There was an issue getting suggestions for ${word}`);
        }
    } catch (error) {
        console.log(`Error happened searching ${req.params.word} : ${error}`);
    }
}

export const getFullTrieJson = async (req: Request, res: Response) => {
    try {
        const trieJson = await trieRedis.getFullTrieJson();
        if (trieJson) {
            res.send(trieJson);
        } else {
            res.status(400).send("There was an issue fetching the trie json");
        }
    } catch (error) {
        console.log(`Error happened fetching the trie json: ${error}`);
    }
}

