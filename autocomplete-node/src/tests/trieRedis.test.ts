import TrieRedis from "../repository/trieRedis";
import RedisMock from "ioredis-mock";

let redisClient: any;
let redisTrie: TrieRedis;

beforeAll(() => {
    redisClient = new RedisMock();

    redisTrie = new TrieRedis(redisClient);
    const words = {"best": 10, "current": 9, "currency": 3, "car": 19, "read": 30, "red": 5, "reading": 4};
    redisTrie.initTrie(words);
});

describe('Testing TrieRedis class', () => {

    it('should initiate the trie when given a set of words', async () => {
        const res1 = await redisTrie.search("best");
        expect(res1).toBeTruthy();

        const res2 = await redisTrie.search("read");
        expect(res2).toBeTruthy();

        const res3 = await redisTrie.search("test");
        expect(res3).toBeFalsy();
    });

    it('should insert a word when a word inserted and be able to find it in the trie', async () => {
        redisTrie.insert("test", 3);

        const res1 = await redisTrie.search("test");
        expect(res1).toBeTruthy();

        const res3 = await redisTrie.search("testWord");
        expect(res3).toBeFalsy();
    });

    it('should not be able to find a word when it is not added', async () => {
        const res3 = await redisTrie.search("testWord");
        expect(res3).toBeFalsy();
    });

    it('should get top suggestions when a string is entered', async () => {
        const res3 = await redisTrie.topSuggestions("cu");
        expect(res3).toEqual(["current", "currency"]);
    });
  });