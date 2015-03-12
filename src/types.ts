/*! *****************************************************************************
 The source code contained in this file was originally from TypeScript by
 Microsoft. It has been modified by Artifact Health, LLC. The original copyright notice
 is provide below for informational purposes only.

 Copyright (c) Artifact Health, LLC. All rights reserved.
 Licensed under the Apache License, Version 2.0 (the "License"); you may not use
 this file except in compliance with the License. You may obtain a copy of the
 License at http://www.apache.org/licenses/LICENSE-2.0

 THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
 WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
 MERCHANTABLITY OR NON-INFRINGEMENT.

 See the Apache Version 2.0 License for specific language governing permissions
 and limitations under the License.


 Original Microsoft Copyright Notice:

 Copyright (c) Microsoft Corporation. All rights reserved.
 Licensed under the Apache License, Version 2.0 (the "License"); you may not use
 this file except in compliance with the License. You may obtain a copy of the
 License at http://www.apache.org/licenses/LICENSE-2.0

 THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
 WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
 MERCHANTABLITY OR NON-INFRINGEMENT.

 See the Apache Version 2.0 License for specific language governing permissions
 and limitations under the License.
 ***************************************************************************** */

/// <reference path="arrayUtil.ts"/>

module reflect {

    export interface ReflectContext {

        requireModule(moduleName: string): Symbol;
        reference(filename: string): void;
        resolve(name: string, meaning: SymbolFlags): Symbol;
        load(path: string, callback: (err: Error, symbols: Symbol[]) => void): void;
        load(paths: string[], callback: (err: Error, symbols: Symbol[]) => void): void;
        getSymbol(ctr: Constructor): SymbolImpl;
    }

    export interface Loader {

        getLoadedSourceFile(filename: string): SourceFile;
        processRootFile(filename: string): SourceFile;
        processRootFileAsync(filename: string, callback: (err: Error, file: SourceFile) => void): void;
        processExternalModule(moduleName: string, searchPath: string): Symbol;
        getTypeChecker(): TypeChecker;
        getErrors(): Diagnostic[];
        getFiles(): SourceFile[];
    }

    export interface TypeChecker {
        getSourceFile(node: Node): SourceFile;
        getSymbol(symbols: SymbolTable, name: string, meaning: SymbolFlags): Symbol;
        getExportedSymbols(symbols: SymbolTable, flags: SymbolFlags): Symbol[];
        resolveEntityName(location: Node, name: string, meaning: SymbolFlags): Symbol;
        resolveEntityName(location: Node, name: string[], meaning: SymbolFlags): Symbol;
        resolveEntityName(location: Node, name: any, meaning: SymbolFlags): Symbol;
        isExternalModuleNameRelative(moduleName: string): boolean;
        getResolvedExportSymbol(moduleSymbol: Symbol): Symbol;
        getTypeOfSymbol(symbol: Symbol): Type;
        getInterfaceBaseTypeNodes(node: InterfaceDeclaration): TypeReferenceNode[];
        getDeclaredTypeOfSymbol(symbol: Symbol): Type;
        getPropertiesOfType(type: Type): Symbol[];
        getPropertyOfType(type: Type, name: string): Symbol;
        getSignaturesOfType(type: Type, kind: SignatureKind): Signature[];
        getIndexTypeOfObjectOrUnionType(type: Type, kind: IndexKind): Type;
        getIndexTypeOfType(type: Type, kind: IndexKind): Type;
        getReturnTypeOfSignature(signature: Signature): Type;
        symbolToString(symbol: Symbol, containingSymbol?: Symbol): string;
        isTypeIdenticalTo(source: Type, target: Type, diagnostics?: Diagnostic[]): boolean;
        isTypeSubtypeOf(source: Type, target: Type, diagnostics?: Diagnostic[]): boolean;
        isTypeAssignableTo(source: Type, target: Type, diagnostics?: Diagnostic[]): boolean;
        initializeGlobalTypes(): void;
        createSymbol(flags: SymbolFlags, name: string): Symbol;
        getGlobalArrayType(): ObjectType;
        getErrors(): Diagnostic[];
        getGlobals(): SymbolTable;
    }

    export interface SymbolLinks {
        target?: Symbol;               // Resolved (non-alias) target of an alias
        type?: Type;                   // Type of value symbol
        declaredType?: Type;           // Type of class, interface, enum, or type parameter
        mapper?: TypeMapper;           // Type mapper for instantiation alias
        referenced?: boolean;          // True if alias symbol has been referenced as a value
        exportAssignSymbol?: Symbol;   // Symbol exported from external module
        unionType?: UnionType;         // Containing union type for union property
    }

    export interface TransientSymbol extends Symbol, SymbolLinks { }

    export interface SymbolTable {

        [index: string]: Symbol;
    }

    /* TODO: make this const? We'll have to remove getFlags and change getExported */
    export const enum SymbolFlags {
        FunctionScopedVariable = 0x00000001,  // Variable (var) or parameter
        BlockScopedVariable    = 0x00000002,  // A block-scoped variable (let or const)
        Property               = 0x00000004,  // Property or enum member
        EnumMember             = 0x00000008,  // Enum member
        Function               = 0x00000010,  // Function
        Class                  = 0x00000020,  // Class
        Interface              = 0x00000040,  // Interface
        ConstEnum              = 0x00000080,  // Const enum
        RegularEnum            = 0x00000100,  // Enum
        ValueModule            = 0x00000200,  // Instantiated module
        NamespaceModule        = 0x00000400,  // Uninstantiated module
        TypeLiteral            = 0x00000800,  // Type Literal
        ObjectLiteral          = 0x00001000,  // Object Literal
        Method                 = 0x00002000,  // Method
        Constructor            = 0x00004000,  // Constructor
        GetAccessor            = 0x00008000,  // Get accessor
        SetAccessor            = 0x00010000,  // Set accessor
        CallSignature          = 0x00020000,  // Call signature
        ConstructSignature     = 0x00040000,  // Construct signature
        IndexSignature         = 0x00080000,  // Index signature
        TypeParameter          = 0x00100000,  // Type parameter
        TypeAlias              = 0x00200000,  // Type alias

        // Export markers (see comment in declareModuleMember in binder)
        ExportValue            = 0x00400000,  // Exported value marker
        ExportType             = 0x00800000,  // Exported type marker
        ExportNamespace        = 0x01000000,  // Exported namespace marker
        Import                 = 0x02000000,  // Import
        Instantiated           = 0x04000000,  // Instantiated symbol
        Merged                 = 0x08000000,  // Merged symbol (created during program binding)
        Transient              = 0x10000000,  // Transient symbol (created during type check)
        Prototype              = 0x20000000,  // Prototype property (no source representation)
        UnionProperty          = 0x40000000,  // Property in union type

        Enum                   = RegularEnum | ConstEnum,
        Variable  = FunctionScopedVariable | BlockScopedVariable,
        Value     = Variable | Property | EnumMember | Function | Class | Enum | ValueModule | Method | GetAccessor | SetAccessor,
        Type      = Class | Interface | Enum | TypeLiteral | ObjectLiteral | TypeParameter | TypeAlias,
        Namespace = ValueModule | NamespaceModule,
        Module    = ValueModule | NamespaceModule,
        Accessor  = GetAccessor | SetAccessor,
        Signature = CallSignature | ConstructSignature | IndexSignature,

        // Variables can be redeclared, but can not redeclare a block-scoped declaration with the
        // same name, or any other value that is not a variable, e.g. ValueModule or Class
        FunctionScopedVariableExcludes = Value & ~FunctionScopedVariable,

        // Block-scoped declarations are not allowed to be re-declared
        // they can not merge with anything in the value space
        BlockScopedVariableExcludes = Value,

        ParameterExcludes       = Value,
        PropertyExcludes        = Value,
        EnumMemberExcludes      = Value,
        FunctionExcludes        = Value & ~(Function | ValueModule),
        ClassExcludes           = (Value | Type) & ~ValueModule,
        InterfaceExcludes       = Type & ~Interface,
        RegularEnumExcludes     = (Value | Type) & ~(RegularEnum | ValueModule), // regular enums merge only with regular enums and modules
        ConstEnumExcludes       = (Value | Type) & ~ConstEnum, // const enums merge only with const enums
        ValueModuleExcludes     = Value & ~(Function | Class | RegularEnum | ValueModule),
        NamespaceModuleExcludes = 0,
        MethodExcludes          = Value & ~Method,
        GetAccessorExcludes     = Value & ~SetAccessor,
        SetAccessorExcludes     = Value & ~GetAccessor,
        TypeParameterExcludes   = Type & ~TypeParameter,
        TypeAliasExcludes       = Type,
        ImportExcludes          = Import,  // Imports collide with all other imports with the same name

        ModuleMember = Variable | Function | Class | Interface | Enum | Module | TypeAlias | Import,

        ExportHasLocal = Function | Class | Enum | ValueModule,

        HasLocals  = Function | Module | Method | Constructor | Accessor | Signature,
        HasExports = Class | Enum | Module,
        HasMembers = Class | Interface | TypeLiteral | ObjectLiteral,

        IsContainer        = HasLocals | HasExports | HasMembers,
        PropertyOrAccessor = Property | Accessor,
        Export             = ExportNamespace | ExportType | ExportValue,
}

    export interface Symbol {
        flags: SymbolFlags;            // Symbol flags
        name: string;                  // Name of symbol
        id?: number;                   // Unique id (used to look up SymbolLinks)
        mergeId?: number;              // Merge id (used to look up merged symbol)
        declarations?: Declaration[];  // Declarations associated with this symbol
        parent?: Symbol;               // Parent symbol
        members?: SymbolTable;         // Class, interface or literal instance members
        exports?: SymbolTable;         // Module exports
        exportSymbol?: Symbol;         // Exported symbol associated with this symbol
        valueDeclaration?: Declaration // First value declaration of the symbol
    }

    // TODO: make const? will have to remove getFlags
    export const enum TypeFlags {
        Any                = 0x00000001,
        String             = 0x00000002,
        Number             = 0x00000004,
        Boolean            = 0x00000008,
        Void               = 0x00000010,
        Undefined          = 0x00000020,
        Null               = 0x00000040,
        Enum               = 0x00000080,  // Enum type
        StringLiteral      = 0x00000100,  // String literal type
        TypeParameter      = 0x00000200,  // Type parameter
        Class              = 0x00000400,  // Class
        Interface          = 0x00000800,  // Interface
        Reference          = 0x00001000,  // Generic type reference
        Tuple              = 0x00002000,  // Tuple
        Union              = 0x00004000,  // Union
        Anonymous          = 0x00008000,  // Anonymous
        FromSignature      = 0x00010000,  // Created for signature assignment check

        Intrinsic  = Any | String | Number | Boolean | Void | Undefined | Null,
        StringLike = String | StringLiteral,
        NumberLike = Number | Enum,
        ObjectType = Class | Interface | Reference | Tuple | Anonymous,
}

    // Properties common to all types
    export interface Type {
        flags: TypeFlags;  // Flags
        id: number;        // Unique ID
        symbol?: Symbol;   // Symbol associated with type (if any)
    }

    // Intrinsic types (TypeFlags.Intrinsic)
    export interface IntrinsicType extends Type {
        intrinsicName: string;  // Name of intrinsic type
    }

    // String literal types (TypeFlags.StringLiteral)
    export interface StringLiteralType extends Type {
        text: string;  // Text of string literal
    }

    // Object types (TypeFlags.ObjectType)
    export interface ObjectType extends Type { }

    // Class and interface types (TypeFlags.Class and TypeFlags.Interface)
    export interface InterfaceType extends ObjectType {
        typeParameters: TypeParameter[];           // Type parameters (undefined if non-generic)
        baseTypes: ObjectType[];                   // Base types
        implementedTypes: ObjectType[];            // Implemented types
        declaredProperties: Symbol[];              // Declared members
        declaredCallSignatures: Signature[];       // Declared call signatures
        declaredConstructSignatures: Signature[];  // Declared construct signatures
        declaredStringIndexType: Type;             // Declared string index type
        declaredNumberIndexType: Type;             // Declared numeric index type
    }

    // Type references (TypeFlags.Reference)
    export interface TypeReference extends ObjectType {
        target: GenericType;    // Type reference target
        typeArguments: Type[];  // Type reference type arguments
    }

    // Generic class and interface types
    export interface GenericType extends InterfaceType, TypeReference {
        instantiations: Map<TypeReference>;   // Generic instantiation cache
        openReferenceTargets: GenericType[];  // Open type reference targets
        openReferenceChecks: Map<boolean>;    // Open type reference check cache
    }

    export interface TupleType extends ObjectType {
        elementTypes: Type[];          // Element types
        baseArrayType: TypeReference;  // Array<T> where T is best common type of element types
    }

    export interface UnionType extends Type {
        types: Type[];                    // Constituent types
        resolvedProperties: SymbolTable;  // Cache of resolved properties
    }

    // Resolved object or union type
    export interface ResolvedType extends ObjectType, UnionType {
        members: SymbolTable;              // Properties by name
        properties: Symbol[];              // Properties
        callSignatures: Signature[];       // Call signatures of type
        constructSignatures: Signature[];  // Construct signatures of type
        stringIndexType: Type;             // String index type
        numberIndexType: Type;             // Numeric index type
    }

    // Type parameters (TypeFlags.TypeParameter)
    export interface TypeParameter extends Type {
        constraint: Type;        // Constraint
        target?: TypeParameter;  // Instantiation target
        mapper?: TypeMapper;     // Instantiation mapper
    }

    export const enum SignatureKind {
        Call,
        Construct,
    }

    export interface Signature {
        declaration: SignatureDeclaration;  // Originating declaration
        typeParameters: TypeParameter[];    // Type parameters (undefined if non-generic)
        parameters: Symbol[];               // Parameters
        resolvedReturnType: Type;           // Resolved return type
        minArgumentCount: number;           // Number of non-optional parameters
        hasRestParameter: boolean;          // True if last parameter is rest parameter
        hasStringLiterals: boolean;         // True if specialized
        target?: Signature;                 // Instantiation target
        mapper?: TypeMapper;                // Instantiation mapper
        unionSignatures?: Signature[];      // Underlying signatures of a union signature
        erasedSignatureCache?: Signature;   // Erased version of signature (deferred)
        isolatedSignatureType?: ObjectType; // A manufactured type that just contains the signature for purposes of signature comparison
    }

    export const enum IndexKind {
        String,
        Number,
    }

    export interface TypeMapper {
        (t: Type): Type;
    }

    export interface FoundImport {
        topLevel?: boolean;
        node: ImportDeclaration;
    }

    /**
     * A Constructor.
     */
    export interface Constructor {

        name?: string;
        new(...args: any[]): any;
    }
}