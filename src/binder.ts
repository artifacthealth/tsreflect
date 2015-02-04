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

/// <reference path="nodes.ts"/>
/// <reference path="diagnostics.ts"/>
/// <reference path="symbolImpl.ts"/>

module reflect {

    export function bindSourceFile(file: SourceFile) {

        var parent: Node;
        var container: Node;
        var blockScopeContainer: Node;
        var lastContainer: Node;

        if (!file.locals) {
            file.locals = {};
            container = blockScopeContainer = file;
            bind(file);
        }

        // Did not merge in getModuleInstanceState because we are not using the
        // node.symbol.constEnumOnlyModule flag.
        function isInstantiated(node: Node): boolean {
            // A module is uninstantiated if it contains only
            // 1. interface declarations
            if (node.kind === NodeKind.InterfaceDeclaration) {
                return false;
            }
            // 2. non - exported import declarations
            else if (node.kind === NodeKind.ImportDeclaration && !(node.flags & NodeFlags.Export)) {
                return false;
            }
            // 3. other uninstantiated module declarations.
            else if (node.kind === NodeKind.ModuleDeclaration && !forEachChild(node, isInstantiated)) {
                return false;
            }
            else {
                return true;
            }
        }

        function createSymbol(flags: SymbolFlags, name: string): Symbol {
            return new SymbolImpl(flags, name);
        }

        function addDeclarationToSymbol(symbol: Symbol, node: Declaration, symbolKind: SymbolFlags) {
            symbol.flags |= symbolKind;
            if (!symbol.declarations) symbol.declarations = [];
            symbol.declarations.push(node);
            if (symbolKind & SymbolFlags.HasExports && !symbol.exports) symbol.exports = {};
            if (symbolKind & SymbolFlags.HasMembers && !symbol.members) symbol.members = {};
            node.symbol = symbol;
            if (symbolKind & SymbolFlags.Value && !symbol.valueDeclaration) symbol.valueDeclaration = node;
        }

        // Should not be called on a declaration with a computed property name.
        function getDeclarationName(node: Declaration): string {
            if (node.name) {
                if (node.kind === NodeKind.ModuleDeclaration && node.flags & NodeFlags.ExternalModule) {
                    return '"' + node.name + '"';
                }
                return node.name;
            }
            switch (node.kind) {
                case NodeKind.ConstructorType:
                case NodeKind.Constructor:
                    return "__constructor";
                case NodeKind.FunctionType:
                case NodeKind.CallSignature:
                    return "__call";
                case NodeKind.ConstructSignature:
                    return "__new";
                case NodeKind.IndexSignature:
                    return "__index";
            }
        }

        function getDisplayName(node: Declaration): string {
            return node.name ? node.name : getDeclarationName(node);
        }

        function declareSymbol(symbols: SymbolTable, parent: Symbol, node: Declaration, includes: SymbolFlags, excludes: SymbolFlags): Symbol {
            var name = getDeclarationName(node);
            if (name !== undefined) {
                var symbol = hasProperty(symbols, name) ? symbols[name] : (symbols[name] = createSymbol(0, name));
                if (symbol.flags & excludes) {
                    addDiagnostic(new Diagnostic(file, Diagnostics.Duplicate_identifier_0, getDisplayName(node)));
                    symbol = createSymbol(0, name);
                }
            }
            else {
                symbol = createSymbol(0, "__missing");
            }
            addDeclarationToSymbol(symbol, node, includes);
            symbol.parent = parent;

            if (node.kind === NodeKind.ClassDeclaration && symbol.exports) {
                // TypeScript 1.0 spec (April 2014): 8.4
                // Every class automatically contains a static property member named 'prototype',
                // the type of which is an instantiation of the class type with type Any supplied as a type argument for each type parameter.
                // It is an error to explicitly declare a static property member with the name 'prototype'.
                var prototypeSymbol = createSymbol(SymbolFlags.Property | SymbolFlags.Prototype, "prototype");
                if (hasProperty(symbol.exports, prototypeSymbol.name)) {
                    addDiagnostic(new Diagnostic(file, Diagnostics.Duplicate_identifier_0, prototypeSymbol.name));
                }
                symbol.exports[prototypeSymbol.name] = prototypeSymbol;
                prototypeSymbol.parent = symbol;
            }

            return symbol;
        }

        function declareModuleMember(node: Declaration, symbolKind: SymbolFlags, symbolExcludes: SymbolFlags) {
            // Exported module members are given 2 symbols: A local symbol that is classified with an ExportValue,
            // ExportType, or ExportContainer flag, and an associated export symbol with all the correct flags set
            // on it. There are 2 main reasons:
            //
            //   1. We treat locals and exports of the same name as mutually exclusive within a container.
            //      That means the binder will issue a Duplicate Identifier error if you mix locals and exports
            //      with the same name in the same container.
            //      TODO: Make this a more specific error and decouple it from the exclusion logic.
            //   2. When we checkIdentifier in the checker, we set its resolved symbol to the local symbol,
            //      but return the export symbol (by calling getExportSymbolOfValueSymbolIfExported). That way
            //      when the emitter comes back to it, it knows not to qualify the name if it was found in a containing scope.
            var exportKind = 0;
            if (symbolKind & SymbolFlags.Value) {
                exportKind |= SymbolFlags.ExportValue;
            }
            if (symbolKind & SymbolFlags.Type) {
                exportKind |= SymbolFlags.ExportType;
            }
            if (symbolKind & SymbolFlags.Namespace) {
                exportKind |= SymbolFlags.ExportNamespace;
            }
            if (node.flags & NodeFlags.Export || node.kind !== NodeKind.ImportDeclaration) {
                if (exportKind) {
                    var local = declareSymbol(container.locals, undefined, node, exportKind, symbolExcludes);
                    local.exportSymbol = declareSymbol(container.symbol.exports, container.symbol, node, symbolKind, symbolExcludes);
                    node.localSymbol = local;
                }
                else {
                    declareSymbol(container.symbol.exports, container.symbol, node, symbolKind, symbolExcludes);
                }
            }
            else {
                declareSymbol(container.locals, undefined, node, symbolKind, symbolExcludes);
            }
        }

        // All container nodes are kept on a linked list in declaration order. This list is used by the getLocalNameOfContainer function
        // in the type checker to validate that the local name used for a container is unique.
        function bindChildren(node: Node, symbolKind: SymbolFlags, isBlockScopeContainer: boolean) {
            if (symbolKind & SymbolFlags.HasLocals) {
                node.locals = {};
            }
            var saveParent = parent;
            var saveContainer = container;
            var savedBlockScopeContainer = blockScopeContainer;
            parent = node;
            if (symbolKind & SymbolFlags.IsContainer) {
                container = node;
                // If container is not on container list, add it to the list
                if (lastContainer !== container && !container.nextContainer) {
                    if (lastContainer) {
                        lastContainer.nextContainer = container;
                    }
                    lastContainer = container;
                }
            }
            if (isBlockScopeContainer) {
                blockScopeContainer = node;
            }
            forEachChild(node, bind);
            container = saveContainer;
            parent = saveParent;
            blockScopeContainer = savedBlockScopeContainer;
        }

        function bindDeclaration(node: Declaration, symbolKind: SymbolFlags, symbolExcludes: SymbolFlags, isBlockScopeContainer: boolean) {
            switch (container.kind) {
                case NodeKind.ModuleDeclaration:
                    declareModuleMember(node, symbolKind, symbolExcludes);
                    break;
                case NodeKind.SourceFile:
                    if (container.flags & NodeFlags.ExternalModule) {
                        declareModuleMember(node, symbolKind, symbolExcludes);
                        break;
                    }
                    else {
                        declareSymbol(globals, undefined, node, symbolKind, symbolExcludes);
                    }
                    break;
                case NodeKind.FunctionType:
                case NodeKind.ConstructorType:
                case NodeKind.CallSignature:
                case NodeKind.ConstructSignature:
                case NodeKind.IndexSignature:
                case NodeKind.Method:
                case NodeKind.MethodSignature:
                case NodeKind.Constructor:
                case NodeKind.GetAccessor:
                case NodeKind.SetAccessor:
                case NodeKind.FunctionDeclaration:
                    declareSymbol(container.locals, undefined, node, symbolKind, symbolExcludes);
                    break;
                case NodeKind.ClassDeclaration:
                    if (node.flags & NodeFlags.Static) {
                        declareSymbol(container.symbol.exports, container.symbol, node, symbolKind, symbolExcludes);
                        break;
                    }
                case NodeKind.ObjectType:
                case NodeKind.InterfaceDeclaration:
                    declareSymbol(container.symbol.members, container.symbol, node, symbolKind, symbolExcludes);
                    break;
                case NodeKind.EnumDeclaration:
                    declareSymbol(container.symbol.exports, container.symbol, node, symbolKind, symbolExcludes);
                    break;
            }
            bindChildren(node, symbolKind, isBlockScopeContainer);
        }

        function bindConstructorDeclaration(node: ConstructorMemberDeclaration) {
            bindDeclaration(node, SymbolFlags.Constructor, 0, /*isBlockScopeContainer*/ true);
            forEach(node.parameters, p => {
                if (p.flags & (NodeFlags.Public | NodeFlags.Private | NodeFlags.Protected)) {
                    bindDeclaration(p, SymbolFlags.Property, SymbolFlags.PropertyExcludes, /*isBlockScopeContainer*/ false);
                }
            });
        }

        function bindModuleDeclaration(node: ModuleDeclaration) {
            if (node.flags & NodeFlags.ExternalModule) {
                bindDeclaration(node, SymbolFlags.ValueModule, SymbolFlags.ValueModuleExcludes, /*isBlockScopeContainer*/ true);
            }
            else if (isInstantiated(node)) {
                bindDeclaration(node, SymbolFlags.ValueModule, SymbolFlags.ValueModuleExcludes, /*isBlockScopeContainer*/ true);
            }
            else {
                bindDeclaration(node, SymbolFlags.NamespaceModule, SymbolFlags.NamespaceModuleExcludes, /*isBlockScopeContainer*/ true);
            }

        }

        function bindFunctionOrConstructorType(node: SignatureDeclaration) {
            // For a given function symbol "<...>(...) => T" we want to generate a symbol identical
            // to the one we would get for: { <...>(...): T }
            //
            // We do that by making an anonymous type literal symbol, and then setting the function
            // symbol as its sole member. To the rest of the system, this symbol will be  indistinguishable
            // from an actual type literal symbol you would have gotten had you used the long form.

            var symbolKind = node.kind === NodeKind.FunctionType ? SymbolFlags.CallSignature : SymbolFlags.ConstructSignature;
            var symbol = createSymbol(symbolKind, getDeclarationName(node));
            addDeclarationToSymbol(symbol, node, symbolKind);
            bindChildren(node, symbolKind, /*isBlockScopeContainer:*/ false);

            var typeLiteralSymbol = createSymbol(SymbolFlags.TypeLiteral, "__type");
            addDeclarationToSymbol(typeLiteralSymbol, node, SymbolFlags.TypeLiteral);
            typeLiteralSymbol.members = {};
            typeLiteralSymbol.members[node.kind === NodeKind.FunctionType ? "__call" : "__new"] = symbol
        }

        function bindAnonymousDeclaration(node: Declaration, symbolKind: SymbolFlags, name: string, isBlockScopeContainer: boolean) {
            var symbol = createSymbol(symbolKind, name);
            addDeclarationToSymbol(symbol, node, symbolKind);
            bindChildren(node, symbolKind, isBlockScopeContainer);
        }

        function bindBlockScopedVariableDeclaration(node: Declaration) {
            switch (blockScopeContainer.kind) {
                case NodeKind.ModuleDeclaration:
                    declareModuleMember(node, SymbolFlags.BlockScopedVariable, SymbolFlags.BlockScopedVariableExcludes);
                    break;
                case NodeKind.SourceFile:
                    if (node.flags & NodeFlags.ExternalModule) {
                        declareModuleMember(node, SymbolFlags.BlockScopedVariable, SymbolFlags.BlockScopedVariableExcludes);
                        break;
                    }
                default:
                    if (!blockScopeContainer.locals) {
                        blockScopeContainer.locals = {};
                    }
                    declareSymbol(blockScopeContainer.locals, undefined, node, SymbolFlags.BlockScopedVariable, SymbolFlags.BlockScopedVariableExcludes);
            }

            bindChildren(node, SymbolFlags.BlockScopedVariable, /*isBlockScopeContainer*/ false);
        }

        function bind(node: Node) {
            node.parent = parent;
            switch (node.kind) {
                case NodeKind.TypeParameter:
                    bindDeclaration(<Declaration>node, SymbolFlags.TypeParameter, SymbolFlags.TypeParameterExcludes, /*isBlockScopeContainer*/ false);
                    break;
                case NodeKind.Parameter:
                    bindDeclaration(<Declaration>node, SymbolFlags.FunctionScopedVariable, SymbolFlags.ParameterExcludes, /*isBlockScopeContainer*/ false);
                    break;
                case NodeKind.VariableDeclaration:
                    // TODO: variable declrations are not bound correctly. Has something to do with this blockscoped business
                    if (node.flags & NodeFlags.BlockScoped) {
                        bindBlockScopedVariableDeclaration(<Declaration>node);
                    }
                    else {
                        bindDeclaration(<Declaration>node, SymbolFlags.FunctionScopedVariable, SymbolFlags.FunctionScopedVariableExcludes, /*isBlockScopeContainer*/ false);
                    }
                    break;
                case NodeKind.Field:
                case NodeKind.PropertySignature:
                    bindDeclaration(<Declaration>node, SymbolFlags.Property, SymbolFlags.PropertyExcludes, /*isBlockScopeContainer*/ false);
                    break;
                case NodeKind.EnumMember:
                    bindDeclaration(<Declaration>node, SymbolFlags.EnumMember, SymbolFlags.EnumMemberExcludes, /*isBlockScopeContainer*/ false);
                    break;
                case NodeKind.CallSignature:
                    bindDeclaration(<Declaration>node, SymbolFlags.CallSignature, 0, /*isBlockScopeContainer*/ false);
                    break;
                case NodeKind.ConstructSignature:
                    bindDeclaration(<Declaration>node, SymbolFlags.ConstructSignature, 0, /*isBlockScopeContainer*/ true);
                    break;
                case NodeKind.Method:
                case NodeKind.MethodSignature:
                    // If this is an ObjectLiteralExpression method, then it sits in the same space
                    // as other properties in the object literal.  So we use SymbolFlags.PropertyExcludes
                    // so that it will conflict with any other object literal members with the same
                    // name.
                    // TODO: Need to revisit this and make sure implementation of isObjectLiteralMethod is correct and that this is needed at all.
                    bindDeclaration(<Declaration>node, SymbolFlags.Method,
                        isObjectLiteralMethod(node) ? SymbolFlags.PropertyExcludes : SymbolFlags.MethodExcludes, /*isBlockScopeContainer*/ true);
                    break;
                case NodeKind.IndexSignature:
                    bindDeclaration(<Declaration>node, SymbolFlags.IndexSignature, 0, /*isBlockScopeContainer*/ false);
                    break;
                case NodeKind.FunctionDeclaration:
                    bindDeclaration(<Declaration>node, SymbolFlags.Function, SymbolFlags.FunctionExcludes, /*isBlockScopeContainer*/ true);
                    break;
                case NodeKind.Constructor:
                    bindConstructorDeclaration(<ConstructorMemberDeclaration>node);
                    break;
                case NodeKind.GetAccessor:
                    bindDeclaration(<Declaration>node, SymbolFlags.GetAccessor, SymbolFlags.GetAccessorExcludes, /*isBlockScopeContainer*/ true);
                    break;
                case NodeKind.SetAccessor:
                    bindDeclaration(<Declaration>node, SymbolFlags.SetAccessor, SymbolFlags.SetAccessorExcludes, /*isBlockScopeContainer*/ true);
                    break;
                case NodeKind.ConstructorType:
                case NodeKind.FunctionType:
                    bindFunctionOrConstructorType(<SignatureDeclaration>node);
                    break;
                case NodeKind.ArrayType:
                case NodeKind.ObjectType:
                    bindAnonymousDeclaration(node, SymbolFlags.TypeLiteral, "__type", /*isBlockScopeContainer*/ false);
                    break;
                case NodeKind.ClassDeclaration:
                    bindDeclaration(<Declaration>node, SymbolFlags.Class, SymbolFlags.ClassExcludes, /*isBlockScopeContainer*/ false);
                    break;
                case NodeKind.InterfaceDeclaration:
                    bindDeclaration(<Declaration>node, SymbolFlags.Interface, SymbolFlags.InterfaceExcludes, /*isBlockScopeContainer*/ false);
                    break;
                case NodeKind.TypeAliasDeclaration:
                    bindDeclaration(<Declaration>node, SymbolFlags.TypeAlias, SymbolFlags.TypeAliasExcludes, /*isBlockScopeContainer*/ false);
                    break;
                case NodeKind.EnumDeclaration:
                    if (isConst(node)) {
                        bindDeclaration(<Declaration>node, SymbolFlags.ConstEnum, SymbolFlags.ConstEnumExcludes, /*isBlockScopeContainer*/ false);
                    }
                    else {
                        bindDeclaration(<Declaration>node, SymbolFlags.RegularEnum, SymbolFlags.RegularEnumExcludes, /*isBlockScopeContainer*/ false);
                    }
                    break;
                case NodeKind.ModuleDeclaration:
                    bindModuleDeclaration(<ModuleDeclaration>node);
                    break;
                case NodeKind.ImportDeclaration:
                    bindDeclaration(<Declaration>node, SymbolFlags.Import, SymbolFlags.ImportExcludes, /*isBlockScopeContainer*/ false);
                    break;
                case NodeKind.SourceFile:
                    if (node.flags & NodeFlags.ExternalModule) {
                        bindAnonymousDeclaration(<SourceFile>node, SymbolFlags.ValueModule, '"' + removeFileExtension((<SourceFile>node).filename) + '"', /*isBlockScopeContainer*/ true);
                        break;
                    }

                default:
                    var saveParent = parent;
                    parent = node;
                    forEachChild(node, bind);
                    parent = saveParent;
            }
        }
    }

    function isConstEnumDeclaration(node: Node): boolean {
        // TODO: we don't store whether or not it's a const enum but we need to revisit this because of the getEnumValue code
        return false;
    }

    function isConst(node: Node): boolean {
        // TODO: we don't store whether or not it's a const enum but we need to revisit this because of the getEnumValue code
        return false;
    }

    function isObjectLiteralMethod(node: Node) {
        return node !== undefined && node.kind === NodeKind.MethodSignature && node.parent.kind === NodeKind.ObjectType;
    }

    // Invokes a callback for each child of the given node. The 'cbNode' callback is invoked for all child nodes
    // stored in properties. If a 'cbNodes' callback is specified, it is invoked for embedded arrays; otherwise,
    // embedded arrays are flattened and the 'cbNode' callback is invoked for each element. If a callback returns
    // a truthy value, iteration stops and that value is returned. Otherwise, undefined is returned.
    export function forEachChild<T>(node: Node, cbNode: (node: Node) => T, cbNodes?: (nodes: Node[]) => T): T {
        function child(node: Node): T {
            if (node) {
                return cbNode(node);
            }
        }
        function children(nodes: Node[]) {
            if (nodes) {
                if (cbNodes) {
                    return cbNodes(nodes);
                }

                for (var i = 0, len = nodes.length; i < len; i++) {
                    var result = cbNode(nodes[i])
                    if (result) {
                        return result;
                    }
                }

                return undefined;
            }
        }
        if (!node) {
            return;
        }

        // TODO: new modifiers property?
        switch(node.kind) {
            case NodeKind.SourceFile:
                return children((<SourceFile>node).declares);
            case NodeKind.InterfaceDeclaration:
                return children((<InterfaceDeclaration>node).typeParameters) ||
                    children((<InterfaceDeclaration>node).extends) ||
                    children((<InterfaceDeclaration>node).signatures);
            case NodeKind.ClassDeclaration:
                return children((<ClassDeclaration>node).typeParameters) ||
                    child((<ClassDeclaration>node).extends) ||
                    children((<ClassDeclaration>node).implements) ||
                    children((<ClassDeclaration>node).members);
            case NodeKind.TypeAliasDeclaration:
                return child((<TypeAliasDeclaration>node).type);
            case NodeKind.EnumDeclaration:
                return children((<EnumDeclaration>node).members);
            case NodeKind.ModuleDeclaration:
                return children((<ModuleDeclaration>node).declares);
            case NodeKind.CallSignature:
            case NodeKind.ConstructSignature:
            case NodeKind.MethodSignature:
            case NodeKind.Constructor:
            case NodeKind.Method:
            case NodeKind.FunctionDeclaration:
            case NodeKind.ConstructorType:
            case NodeKind.FunctionType:
                return children((<FunctionDeclaration>node).typeParameters) ||
                    children((<FunctionDeclaration>node).parameters) ||
                    child((<FunctionDeclaration>node).returns);
            case NodeKind.Field:
            case NodeKind.VariableDeclaration:
            case NodeKind.PropertySignature:
                return child((<VariableDeclaration>node).type);
            case NodeKind.Index:
            case NodeKind.GetAccessor:
            case NodeKind.SetAccessor:
            case NodeKind.IndexSignature:
                return child((<IndexSignatureDeclaration>node).parameter) ||
                    child((<IndexSignatureDeclaration>node).returns);
            case NodeKind.ArrayType:
                return child((<ArrayTypeNode>node).type);
            case NodeKind.TupleType:
                return children((<TupleTypeNode>node).types);
            case NodeKind.UnionType:
                return children((<UnionTypeNode>node).types);
            case NodeKind.ObjectType:
                return children((<ObjectTypeNode>node).signatures);
            case NodeKind.TypeReference:
                return children((<TypeReferenceNode>node).arguments);
            case NodeKind.Parameter:
                return child((<ParameterDeclaration>node).type);
            case NodeKind.TypeParameter:
                return child((<TypeParameterDeclaration>node).constraint);
        }
    }
}
