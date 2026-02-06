import 'lunr';

declare module 'lunr' {
  export interface Index {
    search(query: string): Array<SearchResult>;
  }

  export interface SearchResult {
    ref: string;
    score: number;
    matchData: {
      metadata: Record<string, unknown>;
    };
  }
}
