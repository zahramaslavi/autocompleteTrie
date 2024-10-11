import TrieNode from "./trieNode";

interface UseSuggestionReturnI {
    suggestions: string[];
    loading: boolean;
    searchedWord: string | null;
    trieJson: TrieNode | null;
    handleGetSuggestions: (word: string) => void;
    handleSearch: (word: string) => void;
}

export default UseSuggestionReturnI;