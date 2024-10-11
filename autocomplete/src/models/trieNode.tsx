interface TrieNode {
    name?: string;
    attributes?: {
        endOfWord?: boolean;
        frequency?: number;
        topSuggestions?: string[];
    }
    children?: TrieNode[];
}

export default TrieNode;