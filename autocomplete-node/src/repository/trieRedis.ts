interface suggestionsI {
    [key: string]: number;
}

interface wordsI {
    [key: string]: number;
}

class TrieRedis {
    redis: any = null;

    constructor(redisServer: any) {
        this.redis = redisServer;
    }
    
    async initTrie(words: wordsI) {
        for (const word in words) {
            const res = await this.insert(word, words[word]);
        }
    }
    
    async insert(word: string, freq: number): Promise<boolean> {
        // HSET trie: c 1
        // HSET trie:c a 1
        // HSET trie:ca t 1
        // HSET trie:cat isWord 1
        let key = "trie:";
        for (let i = 0; i < word.length; i++) { 
            const field = word[i];
            await this.redis.hincrby(key, field, 1);
            key += word[i];   
        }
        await this.redis.hset(key, "endOfWord", 1);
        await this.redis.hset(key, "freq", freq);

        const s = await this.redis.hgetall(key);

        return true;
    }

    async search(word: string): Promise<boolean> {
        let key = "trie:";
        for (let i = 0; i < word.length; i++) {
            const exists = await this.redis.hexists(key, word[i])
            if (!exists)
                return false;

            key += word[i]
        }

        await this.redis.hincrby(key, "freq", 1);
        const endOfWord = await this.redis.hget(key, "endOfWord");
        
        return endOfWord ? true : false;
    }

    async getFullTrieJson(): Promise<any> {
        return await this.getAkeyFields("");
    }

    async getAkeyFields(key: string): Promise<any> {
        const res: any = {};

        const endOfWord = await this.redis.hget("trie:"+key, "endOfWord");
        const frequency = await this.redis.hget("trie:"+key, "freq");
        const topSuggestions = await this.redis.hget("trie:"+key, "topSuggestions");
        let fields = await this.redis.hgetall("trie:"+key);
        res["name"] = endOfWord ? key : key[key.length-1];
        res["attributes"] = {};
        res["attributes"]["endOfWord"] = endOfWord;
        res["attributes"]["frequency"]  = frequency;
        res["attributes"]["topSuggestions"] = topSuggestions

        const children = Object.keys(fields)
            .filter(item => item != "endOfWord" && item != "freq" && item != "topSuggestions");
            res["children"] = [];

        if (children.length) {
            for (const child of children) {
                res["children"].push(await this.getAkeyFields(key+child));
            }
        }
        return res;
    }

    async topSuggestions(strToSearch: string): Promise<string[]> {
        const res: suggestionsI = {};

        const findSuggestion = async (currKey: string) => {
            const endOfWord = await this.redis.hget(currKey, "endOfWord");
            const freq = await this.redis.hget(currKey, "freq");
            if (endOfWord && freq) {
                res[currKey.split(':')[1]] = parseInt(freq);
            }
            
            let fields = await this.redis.hgetall(currKey);
            const children = Object.keys(fields)
                .filter(item => item != "endOfWord" && item != "freq" && item != "topSuggestions");

            if (!children.length) {
                return;
            }

            for (const child of children) {
                if (child != "endOfWord" && child != "freq" && child != "topSuggestions") {
                    await findSuggestion(currKey+child);
                }
            }
        }

        // Traversing the trie to the place prefix (specified word) ends
        // Ex: strToSearch: "be" it a tire with [beer, beor, beora]
        // step1: trie: b
        // step2: trie:b e
        let key = "trie:";
        for (let i = 0; i < strToSearch.length; i++) {
            const exists = await this.redis.hexists(key, strToSearch[i]);
            if (exists) {
                key += strToSearch[i]
            } else {
                return [];
            }
        }
        const tSuggestons = await this.getCachedTopSuggestions(key);

        if (tSuggestons.length) {
            console.log("cached suggestions" + strToSearch, tSuggestons)
            return tSuggestons
        }
        
        await findSuggestion(key);
        
        // Sort the result based on the frequency and return only the strings[]
        const topS = Object.keys(res).sort((a, b) => res[b] - res[a]);
        
        // Cache the found top suggestions
        await this.redis.hset(key, "topSuggestions", JSON.stringify(topS))

        return topS;
    }

    async getCachedTopSuggestions(key: string): Promise<string[]> {
        const topSuggestions = await this.redis.hget(key, "topSuggestions");

        if (topSuggestions && JSON.parse(topSuggestions).length) {
            return JSON.parse(topSuggestions);
        }

        return [];
    }
}

export default TrieRedis;