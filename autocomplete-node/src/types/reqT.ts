import TrieRedis from "../repository/trieRedis";

// Extend the Request interface
declare global {
    namespace Express {
        interface Request {
            redisTrie: TrieRedis | null;
        }
    }
}