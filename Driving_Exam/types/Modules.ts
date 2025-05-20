export interface Module {
  number: number;
  guid: string;   
  name: string;
}

export function isModule(topic: any): topic is Module {
  return (
    typeof topic === 'object' &&
    topic !== null &&
    'number' in topic &&
    'guid' in topic &&
    'name' in topic
  );
}