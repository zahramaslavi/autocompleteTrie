import { Router } from "express";
import { Request, Response } from "express";
import { searchWord, getSuggestions, getFullTrieJson } from "../controllers";

const routes = Router();

routes.get('/greet', (req: Request, res: Response) => {
    res.status(200).json({ message: 'Hello, world!' });
});
routes.get("/search/:word", searchWord);
routes.get("/suggestions/:word", getSuggestions);
routes.get("/trie/fullTree", getFullTrieJson);

export default routes;
