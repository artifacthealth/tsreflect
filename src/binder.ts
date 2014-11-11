/*! *****************************************************************************
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

/// <reference path="declaration.ts"/>
/// <reference path="diagnostics.ts"/>

module reflect {

    export function isInstantiated(node: Node): boolean {
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

    export function bindSourceFile(file: SourceFile) {

        var parent: Node;
        var container: Declaration;
        var lastContainer: Declaration;

        if (!file.locals) {
            file.locals = {};
            container = file;
            bind(file);
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

        function getDeclarationName(node: Declaration): string {
            if (node.name) {
                if (node.kind === NodeKind.ModuleDeclaration && node.flags & NodeFlags.ExternalModule) {
                    return '"' + node.name + '"';
                }
                return node.name;
            }
            switch (node.kind) {
                case NodeKind.Constructor: return "__constructor";
                case NodeKind.CallSignature: return "__call";
                case NodeKind.ConstructSignature: return "__new";
                case NodeKind.IndexSignature: return "__index";
            }
        }

        function getDisplayName(node: Declaration): string {
            return node.name ? node.name : getDeclarationName(node);
        }

        function declareSymbol(symbols: SymbolTable, parent: Symbol, node: Declaration, includes: SymbolFlags, excludes: SymbolFlags): Symbol {
            var name = getDeclarationName(node);
            if (name !== undefined) {
                var symbol = hasProperty(symbols, name) ? symbols[name] : (symbols[name] = new Symbol(0, name));
                if (symbol.flags & excludes) {
                    file.errors.push(new Diagnostic(file, Diagnostics.Duplicate_identifier_0, getDisplayName(node)));
                    symbol = new Symbol(0, name);
                }
            }
            else {
                symbol = new Symbol(0, "__missing");
            }
            addDeclarationToSymbol(symbol, node, includes);
            symbol.parent = parent;

            if (node.kind === NodeKind.ClassDeclaration && symbol.exports) {
                // TypeScript 1.0 spec (April 2014): 8.4
                // Every class automatically contains a static property member named 'prototype',
                // the type of which is an instantiation of the class type with type Any supplied as a type argument for each type parameter.
                // It is an error to explicitly declare a static property member with the name 'prototype'.
                var prototypeSymbol = new Symbol(SymbolFlags.Property | SymbolFlags.Prototype, "prototype");
                if (hasProperty(symbol.exports, prototypeSymbol.name)) {
                    file.errors.push(new Diagnostic(file, Diagnostics.Duplicate_identifier_0, prototypeSymbol.name));
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
        function bindChildren(node: Declaration, symbolKind: SymbolFlags) {
            if (symbolKind & SymbolFlags.HasLocals) {
                node.locals = {};
            }
            var saveParent = parent;
            var saveContainer = container;
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
            forEachChild(node, bind);
            container = saveContainer;
            parent = saveParent;
        }

        function bindDeclaration(node: Declaration, symbolKind: SymbolFlags, symbolExcludes: SymbolFlags) {
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
                case NodeKind.CallSignature:
                case NodeKind.ConstructSignature:
                case NodeKind.IndexSignature:
                case NodeKind.Method:
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
            bindChildren(node, symbolKind);
        }

        function bindConstructorDeclaration(node: ConstructorMemberDeclaration) {
            bindDeclaration(node, SymbolFlags.Constructor, 0);
            forEach(node.parameters, p => {
                if (p.flags & (NodeFlags.Public | NodeFlags.Private)) {
                    bindDeclaration(p, SymbolFlags.Property, SymbolFlags.PropertyExcludes);
                }
            });
        }

        function bindModuleDeclaration(node: ModuleDeclaration) {
            if (node.flags & NodeFlags.ExternalModule) {
                bindDeclaration(node, SymbolFlags.ValueModule, SymbolFlags.ValueModuleExcludes);
            }
            else if (isInstantiated(node)) {
                bindDeclaration(node, SymbolFlags.ValueModule, SymbolFlags.ValueModuleExcludes);
            }
            else {
                bindDeclaration(node, SymbolFlags.NamespaceModule, SymbolFlags.NamespaceModuleExcludes);
            }
        }

        function bindAnonymousDeclaration(node: Node, symbolKind: SymbolFlags, name: string) {
            var symbol = new Symbol(symbolKind, name);
            addDeclarationToSymbol(symbol, node, symbolKind);
            bindChildren(node, symbolKind);
        }

        function bind(node: Node) {
            node.parent = parent;
            switch (node.kind) {
                case NodeKind.TypeParameter:
                    bindDeclaration(<Declaration>node, SymbolFlags.TypeParameter, SymbolFlags.TypeParameterExcludes);
                    break;
                case NodeKind.Parameter:
                    bindDeclaration(<Declaration>node, SymbolFlags.Variable, SymbolFlags.ParameterExcludes);
                    break;
                case NodeKind.VariableDeclaration:
                    bindDeclaration(<Declaration>node, SymbolFlags.Variable, SymbolFlags.VariableExcludes);
                    break;
                case NodeKind.Field:
                case NodeKind.PropertySignature:
                    bindDeclaration(<Declaration>node, SymbolFlags.Property, SymbolFlags.PropertyExcludes);
                    break;
                case NodeKind.EnumMember:
                    bindDeclaration(<Declaration>node, SymbolFlags.EnumMember, SymbolFlags.EnumMemberExcludes);
                    break;
                case NodeKind.CallSignature:
                    bindDeclaration(<Declaration>node, SymbolFlags.CallSignature, 0);
                    break;
                case NodeKind.Method:
                case NodeKind.MethodSignature:
                    bindDeclaration(<Declaration>node, SymbolFlags.Method, SymbolFlags.MethodExcludes);
                    break;
                case NodeKind.ConstructSignature:
                    bindDeclaration(<Declaration>node, SymbolFlags.ConstructSignature, 0);
                    break;
                case NodeKind.IndexSignature:
                    bindDeclaration(<Declaration>node, SymbolFlags.IndexSignature, 0);
                    break;
                case NodeKind.FunctionDeclaration:
                    bindDeclaration(<Declaration>node, SymbolFlags.Function, SymbolFlags.FunctionExcludes);
                    break;
                case NodeKind.Constructor:
                    bindConstructorDeclaration(<ConstructorMemberDeclaration>node);
                    break;
                case NodeKind.GetAccessor:
                    bindDeclaration(<Declaration>node, SymbolFlags.GetAccessor, SymbolFlags.GetAccessorExcludes);
                    break;
                case NodeKind.SetAccessor:
                    bindDeclaration(<Declaration>node, SymbolFlags.SetAccessor, SymbolFlags.SetAccessorExcludes);
                    break;
                case NodeKind.ConstructorType:
                case NodeKind.FunctionType:
                case NodeKind.ArrayType:
                case NodeKind.ObjectType:
                    bindAnonymousDeclaration(node, SymbolFlags.TypeLiteral, "__type");
                    break;
                case NodeKind.ClassDeclaration:
                    bindDeclaration(<Declaration>node, SymbolFlags.Class, SymbolFlags.ClassExcludes);
                    break;
                case NodeKind.InterfaceDeclaration:
                    bindDeclaration(<Declaration>node, SymbolFlags.Interface, SymbolFlags.InterfaceExcludes);
                    break;
                case NodeKind.EnumDeclaration:
                    bindDeclaration(<Declaration>node, SymbolFlags.Enum, SymbolFlags.EnumExcludes);
                    break;
                case NodeKind.ModuleDeclaration:
                    bindModuleDeclaration(<ModuleDeclaration>node);
                    break;
                case NodeKind.ImportDeclaration:
                    bindDeclaration(<Declaration>node, SymbolFlags.Import, SymbolFlags.ImportExcludes);
                    break;
                case NodeKind.SourceFile:
                    if (node.flags & NodeFlags.ExternalModule) {
                        bindAnonymousDeclaration(node, SymbolFlags.ValueModule, '"' + getModuleNameFromFilename((<SourceFile>node).filename) + '"');
                        break;
                    }
                default:
                    var saveParent = parent;
                    parent = node;
                    forEachChild(node, bind);
                    parent = saveParent;
            }
        }

        var moduleExtensions = [".d.ts", ".ts", ".js"];

        function getModuleNameFromFilename(filename: string) {
            for (var i = 0; i < moduleExtensions.length; i++) {
                var ext = moduleExtensions[i];
                var len = filename.length - ext.length;
                if (len > 0 && filename.substr(len) === ext) return filename.substr(0, len);
            }
            return filename;
        }
    }

    // Invokes a callback for each child of the given node. The 'cbNode' callback is invoked for all child nodes
    // stored in properties. If a 'cbNodes' callback is specified, it is invoked for embedded arrays; otherwise,
    // embedded arrays are flattened and the 'cbNode' callback is invoked for each element. If a callback returns
    // a truthy value, iteration stops and that value is returned. Otherwise, undefined is returned.
    export function forEachChild<T>(node: Node, cbNode: (node: Node) => T, cbNodes?: (nodes: Node[]) => T): T {
        function child(node: Node): T {
            if (node) return cbNode(node);
        }
        function children(nodes: Node[]) {
            if (nodes) {
                if (cbNodes) return cbNodes(nodes);
                var result: T;
                for (var i = 0, len = nodes.length; i < len; i++) {
                    if (result = cbNode(nodes[i])) break;
                }
                return result;
            }
        }
        if (!node) return;

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
