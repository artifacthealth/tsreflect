export class ClassA {

}

export class ClassB extends ClassA implements InterfaceA {

    a: string;
}

export class ClassC extends ClassB {

}

export class ClassD implements InterfaceA {

    a: string;
}

export class GenericA<T> {

}

export class GenericB<T> extends GenericA<T> {

}

export class ConcreteB extends GenericB<string> {

}

export var ReferenceB: GenericB<string>

export interface InterfaceA {

    a: string;
}