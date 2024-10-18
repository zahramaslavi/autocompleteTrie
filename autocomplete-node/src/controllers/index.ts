import { Request, Response } from "express";
import TrieRedis from "../repository/trieRedis";

declare global {
    namespace Express {
        interface Request {
            redisTrie: TrieRedis | null;
        }
    }
}

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


export const searchWord = async (req: Request, res: Response) => {
    try {
        if (req.redisTrie) {
            const word = req.params.word;
            const found = await req.redisTrie.search(word);
            logger.info(word);
            console.log(found);
            console.log(word);
            res.send(found);
        } else {
            throw Error("Failed to connect to redisTrie");
        }      
    } catch (error) {
        console.log(`Error happened searching ${req.params.word} : ${error}`);
    }
}

export const getSuggestions = async (req: Request, res: Response) => {
    try {
        if (req.redisTrie) { 
            const word = req.params.word;
            const suggestions = await req.redisTrie.topSuggestions(word);

            if (suggestions) {
                res.send(suggestions);
            } else {
                res.status(400).send(`There was an issue getting suggestions for ${word}`);
            }
        } else {
            throw Error("Failed to connect to redisTrie");
        }
    } catch (error) {
        console.log(`Error happened searching ${req.params.word} : ${error}`);
    }
}

export const getFullTrieJson = async (req: Request, res: Response) => {
    try {
        if (req.redisTrie) { 
            const trieJson = await req.redisTrie.getFullTrieJson();
            if (trieJson) {
                res.send(trieJson);
            } else {
                res.status(400).send("There was an issue fetching the trie json");
            }
        } else {
            throw Error("Failed to connect to redisTrie");
        }
    } catch (error) {
        console.log(`Error happened fetching the trie json: ${error}`);
    }
}

