import Redis from "ioredis";
import ts from "typescript";

const redis = new Redis({
    host: 'redis-server',
    port: 6379
});

interface suggestionsI {
    [key: string]: number;
}

class TrieRedis {
    
    async insert(word: string, freq: number): Promise<boolean> {
        // HSET trie: c 1
        // HSET trie:c a 1
        // HSET trie:ca t 1
        // HSET trie:cat isWord 1
        let key = "trie:";
        for (let i = 0; i < word.length; i++) { 
            const field = word[i];
            await redis.hincrby(key, field, 1);
            key += word[i];   
        }
        console.log("--------", key)
        await redis.hset(key, "endOfWord", 1);
        await redis.hset(key, "freq", freq);

        const s = await redis.hgetall(key);
        console.log(s)

        return true;
    }

    async search(word: string): Promise<boolean> {
        let key = "trie:";
        for (let i = 0; i < word.length; i++) {
            const exists = await redis.hexists(key, word[i])
            if (!exists)
                return false;

            key += word[i]
        }

        await redis.hincrby(key, "freq", 1);
        const endOfWord = await redis.hget(key, "endOfWord");
        
        return endOfWord ? true : false;
    }

    async topSuggestions(strToSearch: string): Promise<string[]> {
        const res: suggestionsI = {};

        const findSuggestion = async (currKey: string) => {
            console.log("rec-----", currKey)
            const endOfWord = await redis.hget(currKey, "endOfWord");
            const freq = await redis.hget(currKey, "freq");
            console.log("rec-----", currKey, endOfWord, freq)
            if (endOfWord && freq) {
                res[currKey.split(':')[1]] = parseInt(freq);
                console.log("qwqwqwqwqwq", res, currKey.split(':'), currKey)
                return
            }

            let fields = await redis.hgetall(currKey);
            console.log("rec-----||||||", currKey, fields)
            for (const field in fields) {
                if (field != "endOfWord" && field != "freq" && field != "topSuggestions") {
                    await findSuggestion(currKey+field);
                }
            }
        }

        // Traversing the trie to the place prefix (specified word) ends
        // Ex: strToSearch: "be" it a tire with [beer, beor, beora]
        // step1: trie: b
        // step2: trie:b e
        let key = "trie:";
        for (let i = 0; i < strToSearch.length; i++) {
            const exists = await redis.hexists(key, strToSearch[i]);
            console.log("{{{{{{{{{{{{{", key, exists)
            if (exists) {
                key += strToSearch[i]
            } else {
                return [];
            }
        }
        console.log("{{{{{{{{{{{{{")
        const tSuggestons = await this.getCachedTopSuggestions(key);
        console.log("{{{{{{{{{{---------------{{{", tSuggestons)

        if (tSuggestons.length) {
            console.log("{{{{{{{{{{--||||||||||||||-------------{{{", tSuggestons)

            return tSuggestons
        }
        
        await findSuggestion(key);
        console.log(res)
        // Sort the result based on the frequency and return only the strings[]
        const topS = Object.keys(res).sort((a, b) => res[b] - res[a]);
        
        // Cache the found top suggestions
        await redis.hset(key, "topSuggestions", JSON.stringify(topS))

        return topS;
    }

    async getCachedTopSuggestions(key: string): Promise<string[]> {
        const topSuggestions = await redis.hget(key, "topSuggestions");

        if (topSuggestions && JSON.parse(topSuggestions).length) {
            return JSON.parse(topSuggestions);
        }

        return [];
    }
}

export default TrieRedis;