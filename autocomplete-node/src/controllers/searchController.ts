import { Request, Response } from "express";
import Trie, { getSearchCount } from "../repository/trie";
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

// let trie: Trie | null = null;
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
        const found = trieRedis?.search(word);

        if (!found) {
            logger.info(word);
            console.log(word)
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
        const suggestions = await trieRedis?.topSuggestions(word);

        if (suggestions) {
            console.log("sfdszvzxczxc", suggestions)
            res.send(suggestions);
        } else {
            res.status(400).send(`There was an issue getting suggestions for ${word}`);
        }
    } catch (error) {
        console.log(`Error happened searching ${req.params.word} : ${error}`);
    }
}

export const getSearchTimes = async (req: Request, res: Response) => {
    try {
        console.log("sfsdfsdfsdfsd")
        const count = await getSearchCount()
        console.log("sfsdfsdfsdfsd", count)

        res.send({count})
    } catch (error) {
        console.log(`Error happened getting your search times: ${error}`);
    }
}
