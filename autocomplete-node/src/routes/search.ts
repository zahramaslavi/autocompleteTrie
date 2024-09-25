import { Router } from "express";
import { searchWord, getSuggestions } from "../controllers/searchController";

const searchRouter = Router();

searchRouter.get("/:word", searchWord);
searchRouter.get("/suggestions/:word", getSuggestions);

export default searchRouter;
