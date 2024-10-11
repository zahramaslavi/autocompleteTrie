import { Router } from "express";
import { searchWord, getSuggestions, getFullTrieJson } from "../controllers";

const routes = Router();

routes.get("/search/:word", searchWord);
routes.get("/suggestions/:word", getSuggestions);
routes.get("/trie/fullTree", getFullTrieJson);

export default routes;
