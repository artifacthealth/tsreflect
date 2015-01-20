export interface A {

    a: string;
    c: boolean;
}

export interface B {

    b: number;
    c: boolean;
}

export type C = A|B;