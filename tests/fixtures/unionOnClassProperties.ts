class ClassWithUnionType {

    a: number | string;
    b: boolean | ClassWithUnionType;
    c: boolean;
}

export = ClassWithUnionType;