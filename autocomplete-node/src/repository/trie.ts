import { appendFile } from "fs";
import Redis from "ioredis";

const redisClient = new Redis({
    host: 'redis-server',
    port: 6379
});

export const getSearchCount = async () => {
    const num = await redisClient.get('search-times');

    return num
}

interface childrenI {
    [key: string]: TrieNode;
}

interface suggestionsI {
    [key: string]: number;
}

class TrieNode {
    children: childrenI = {};
    endOfWord: boolean = false;
    freq: number = 0;
    topSuggestions: string[] = []
}


// TODO: use redis
class Trie {
    root = new TrieNode();

    async insert(word: string, freq: number): Promise<boolean> {
        const num = await redisClient.get('search-times');
        
        if (num) {
            await redisClient.set('search-times', parseInt(num)+freq);
        } else {
            await redisClient.set('search-times', freq);
        }
        
        let curr = this.root;

        // implementing storing the trie in redis
        //  go to level 3 
        for (const char of word) {
            if (!(char in curr.children)) {
                curr.children[char] = new TrieNode();
            }
            curr = curr.children[char];
        }

        curr.endOfWord = true;
        curr.freq = freq;

        return true;
    }

    search(word: string): boolean {
        let curr = this.root;

        for (const char of word) {
            if (!(char in curr.children))
                return false;

            curr = curr.children[char];
        }

        curr.freq++;

        return curr.endOfWord;
    }

    topSuggestions(word: string): string[] {
        const res: suggestionsI = {};

        const findSuggestion = (curr: TrieNode, word: string) => {
            if (!curr.children) return
            if (curr.endOfWord) {
                res[word] = curr.freq;
            }
            
            for (const char in curr.children) {
                findSuggestion(curr.children[char], word + char);
            }
        }

        let curr = this.root;

        for (const char of word) {
            if (char in curr.children) {
                curr = curr.children[char];
            } else {
                return [];
            }
        }

        if (curr.topSuggestions.length) {
            return curr.topSuggestions;
        }

        findSuggestion(curr, word);

        const topS = Object.keys(res).sort((a, b) => res[b] - res[a]);
        
        curr.topSuggestions = topS;

        return topS;
    }

}

export default Trie;