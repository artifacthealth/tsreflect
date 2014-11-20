module A {

    export module B {

        export class TestClass {

            a: string;

            add(a: number, b: number): number {
                return a + b;
            }
        }
    }
}

export = A;