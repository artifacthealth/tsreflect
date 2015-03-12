export declare function require(moduleName: string): Symbol;
export declare function reference(filename: string): void;

export declare function resolve(entityName: string): Symbol;
export declare function load(path: string, callback: (err: DiagnosticError, symbols: Symbol[]) => void): void;
export declare function load(paths: string[], callback: (err: DiagnosticError, symbols: Symbol[]) => void): void;
export declare function createContext(): ReflectContext;
export declare function getSymbol(ctr: Constructor): Symbol;

export interface ReflectContext {

    requireModule(moduleName: string): Symbol;
    reference(filename: string): void;
    resolve(name: string): Symbol;
    load(path: string, callback: (err: Error, symbols: Symbol[]) => void): void;
    load(paths: string[], callback: (err: Error, symbols: Symbol[]) => void): void;
    getSymbol(ctr: Constructor): Symbol;
}

export interface Symbol {

    getFullName(): string;
    getName(): string;
    getDescription(): string;
    getAnnotations(name?: string): Annotation[];
    hasAnnotation(name: string): boolean;

    getType(): Type;
    getDeclaredType(): Type;
    getExports(): Symbol[];

    resolve (entityName: string): Symbol;

    getValue(obj: any): any;
    setValue(obj: any, value: any): void;

    isVariable(): boolean;
    isFunction(): boolean;
    isClass(): boolean;
    isInterface(): boolean;
    isEnum(): boolean;
    isModule(): boolean;
    isImport(): boolean;
    isTypeParameter(): boolean;
    isProperty(): boolean;
    isMethod(): boolean;
    isAccessor(): boolean;
    isGetAccessor(): boolean;
    isSetAccessor(): boolean;
    isEnumMember(): boolean;
    isTypeAlias(): boolean;

}

export interface Annotation {

    name: string;
    value: any;

    getDeclarationFileName(): string;
}

export interface Type {

    getFullName(): string;
    getName(): string;
    getDescription(): string;
    getAnnotations(inherit: boolean): Annotation[];
    getAnnotations(name?: string, inherit?: boolean): Annotation[];
    hasAnnotation(name: string, inherit?: boolean): boolean;

    getProperties(): Symbol[];
    getProperty(name: string): Symbol;
    getCallSignatures(): Signature[];
    getConstructSignatures(): Signature[];
    getStringIndexType(): Type;
    getNumberIndexType(): Type;

    isIdenticalTo(target: Type, diagnostics?: Diagnostic[]): boolean;
    isSubtypeOf(target: Type, diagnostics?: Diagnostic[]): boolean;
    isAssignableTo(target: Type, diagnostics?: Diagnostic[]): boolean;
    isSubclassOf(target: Type): boolean;

    getBaseTypes(): Type[];
    hasBaseType(target: Type): boolean;
    getBaseType(name: string): Type;

    getBaseClass(): Type;

    getInterfaces(): Type[];
    getInterface(name: string): Type;
    hasInterface(target: Type): boolean;

    isClass(): boolean;
    isInterface(): boolean;
    isTuple(): boolean;
    isUnion(): boolean;
    isArray(): boolean;
    isIndex(): boolean;
    isAnonymous(): boolean;
    isReference(): boolean;
    isEnum(): boolean;
    isStringLiteral(): boolean;
    isTypeParameter(): boolean;
    isAny(): boolean;
    isString(): boolean;
    isNumber(): boolean;
    isBoolean(): boolean;
    isVoid(): boolean;
    isIntrinsic(): boolean;
    isObjectType(): boolean;

    getEnumValue(value: string, ignoreCase?: boolean): number;
    getEnumName(value: number): string;
    getEnumNames(): string[];
    getElementType(): Type;
    getElementTypes(): Type[];

    createInstance(args?: any[]): any;
    getConstructor(): Function;
}

export interface Signature {

    getDescription(): string;
    getAnnotations(name?: string): Annotation[];
    hasAnnotation(name: string): boolean;

    getParameters(): Symbol[];
    getParameter(name: string): Symbol;
    getReturnType(): Type;
}

export interface Diagnostic {

    filename?: string;
    messageText: string;
    code: number;
}

export interface DiagnosticError extends Error {

    diagnostics: Diagnostic[];
}

export interface Constructor {

    name?: string;
    new(...args: any[]): any;
}