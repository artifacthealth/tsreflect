export class ClassA {

}

export class ClassB extends ClassA implements InterfaceA {

}

export class ClassC extends ClassB {

}

export class GenericA<T> {

}

export class GenericB<T> extends GenericA<T> {

}

export class ConcreteB extends GenericB<string> {

}

export var ReferenceB: GenericB<string>

export interface InterfaceA {

}