module reflect {

    export interface Map<T> {
        [index: string]: T;
    }

    var hasOwnProperty = Object.prototype.hasOwnProperty;

    export function hasProperty<T>(map: Map<T>, key: string): boolean {
        return hasOwnProperty.call(map, key);
    }

    export function getProperty<T>(map: Map<T>, key: string): T {
        return hasOwnProperty.call(map, key) ? map[key] : undefined;
    }

    export function forEach<T, U>(array: T[], callback: (element: T) => U): U {
        var result: U;
        if (array) {
            for (var i = 0, len = array.length; i < len; i++) {
                if (result = callback(array[i])) break;
            }
        }
        return result;
    }

    export function map<T, U>(array: T[], f: (x: T) => U): U[] {
        var result: U[];
        if (array) {
            result = [];
            var len = array.length;
            for (var i = 0; i < len; i++) {
                result.push(f(array[i]));
            }
        }
        return result;
    }

    export function concatenate<T>(array1: T[], array2: T[]): T[] {
        if (!array2 || !array2.length) return array1;
        if (!array1 || !array1.length) return array2;
        return array1.concat(array2);
    }

    export function contains<T>(array: T[], value: T): boolean {
        if (array) {
            var len = array.length;
            for (var i = 0; i < len; i++) {
                if (array[i] === value) {
                    return true;
                }
            }
        }
        return false;
    }
}