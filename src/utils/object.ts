// Object operations utility functions

export function excludeParam(obj: any, param: string): any {
    console.log({ obj, });

    const { [param]: _, ...rest } = obj;
    return rest;
}