import { ParsedQs } from "qs";

export function queryParser(query: string | ParsedQs | (string | ParsedQs)[]): string | undefined {
    if (!query) return undefined;
    if(typeof query === "string") return query;
    if(Array.isArray(query)) {
        const first = query[0]
        if (typeof first === "string") return first;
    }
    return undefined;
}
