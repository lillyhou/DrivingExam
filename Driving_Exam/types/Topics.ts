export interface Topics{
    guid: string;
    name: string;
    questionCount: number;
}

export function isTopics(item: any): item is Topics {
    return (
        typeof item === 'object' &&
        item !== null &&
        'guid' in item &&
        'name' in item &&
        'questionCount' in item
    );
}