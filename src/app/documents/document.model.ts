export type document = {
    'id': string,
    'name': string,
    'description': string,
    'url': string,
    'children': [],
};
    
export class Document {
    constructor(
        public id: string, 
        public name: string, 
        public description: string, 
        public url: string, 
        public children: document[]
    ) {}

}