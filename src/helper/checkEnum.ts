export const isValueInEnum = (value: string, enumObject: any): boolean =>{
    return Object.values(enumObject).includes(value);
}