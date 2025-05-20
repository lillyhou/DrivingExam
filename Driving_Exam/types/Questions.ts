export interface Questions{
    guid: string;
    number: number;
    text: string;
    points: number;
    imageUrl: string;
    moduleGuid: string;
    topicFuid: string;
    answers: Answer[];
}
export interface Answer{
    guid: string;
    text: string;
}

export function isQuestions(item: any): item is Questions {
    return (
        typeof item === 'object' &&

        'guid' in item &&
        'number' in item &&
        'text' in item &&
        'points' in item &&
        'moduleGuid' in item &&
        'topicFuid' in item &&
        'answers' in item
    );
}

export function isAnswer(item: any): item is Answer {
    return (
        typeof item === 'object' &&
        item !== null &&
        'guid' in item &&
        'text' in item
    );
}