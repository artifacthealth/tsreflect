class ClassWithConstructor {

    constructorCalled: boolean;
    argumentsPassed: any[];

    constructor(...args: any[]) {

        this.constructorCalled = true;
        this.argumentsPassed = args;
    }
}

export = ClassWithConstructor;