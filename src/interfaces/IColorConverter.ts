export interface IColorConverter {
    convertNameToColor(name: string): string;
    isValidSixDigitHexcolor(sixDigitColor: string): boolean;
    trimHashTag(hashtag: string): string;
    isValidNumber(num:string):boolean;
}

export default IColorConverter;