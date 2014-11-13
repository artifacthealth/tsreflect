module reflect {

    export class Diagnostic {

        file: SourceFile;
        messageText: string;
        category: DiagnosticCategory;
        code: number;

        constructor(file: SourceFile, message: DiagnosticMessage, ...args: any[]);
        constructor(file: SourceFile, message: DiagnosticMessage);
        constructor(file: SourceFile, code: number, category: DiagnosticCategory, messageText: string);
        constructor(file: SourceFile, codeOrMessage: any, category?: DiagnosticCategory, messageText?: string) {

            this.file = file;

            if(typeof codeOrMessage === "number") {

                this.messageText = messageText;
                this.category = category;
                this.code = codeOrMessage;
            }
            else {
                var message: DiagnosticMessage = codeOrMessage;
                var text = getLocaleSpecificMessage(message.key);

                if (arguments.length > 2) {
                    text = formatStringFromArgs(text, arguments, 2);
                }

                this.messageText = text;
                this.category = message.category;
                this.code = message.code;
            }
        }

        static chain(next: DiagnosticMessageChain, message: DiagnosticMessage, ...args: any[]): DiagnosticMessageChain;
        static chain(next: DiagnosticMessageChain, message: DiagnosticMessage): DiagnosticMessageChain {
            var text = getLocaleSpecificMessage(message.key);

            if (arguments.length > 2) {
                text = formatStringFromArgs(text, arguments, 2);
            }

            var ret = new DiagnosticMessageChain();
            ret.messageText = text;
            ret.category = message.category;
            ret.code = message.code;
            ret.next = next;

            return ret;
        }
    }

    // A linked list of formatted diagnostic messages to be used as part of a multiline message.
    // It is built from the bottom up, leaving the head to be the "main" diagnostic.
    // While it seems that DiagnosticMessageChain is structurally similar to DiagnosticMessage,
    // the difference is that messages are all preformatted in DMC.
    export class DiagnosticMessageChain {

        messageText: string;
        category: DiagnosticCategory;
        code: number;
        next: DiagnosticMessageChain;

        flatten(file?: SourceFile): Diagnostic {

            var code = this.code;
            var category = this.category;
            var messageText = "";

            var indent = 0;
            var diagnosticChain = this;
            while (diagnosticChain) {
                if (indent) {
                    messageText += "\n";

                    for (var i = 0; i < indent; i++) {
                        messageText += "  ";
                    }
                }
                messageText += diagnosticChain.messageText;
                indent++;
                diagnosticChain = diagnosticChain.next;
            }

            return new Diagnostic(file, code, category, messageText);
        }
    }

    export enum DiagnosticCategory {

        Warning,
        Error,
        Message,
    }

    export interface DiagnosticMessage {

        key: string;
        category: DiagnosticCategory;
        code: number;
    }

    export var Diagnostics = {

        Duplicate_identifier_0: { code: 2300, category: DiagnosticCategory.Error, key: "Duplicate identifier '{0}'." },
        File_0_not_found: { code: 6053, category: DiagnosticCategory.Error, key: "File '{0}' not found." },
        Filename_0_differs_from_already_included_filename_1_only_in_casing: { code: 1149, category: DiagnosticCategory.Error, key: "Filename '{0}' differs from already included filename '{1}' only in casing" },
        Cannot_read_file_0_Colon_1: { code: 5012, category: DiagnosticCategory.Error, key: "Cannot read file '{0}': {1}" },
        Circular_definition_of_import_alias_0: { code: 2303, category: DiagnosticCategory.Error, key: "Circular definition of import alias '{0}'." },
        Cannot_find_name_0: { code: 2304, category: DiagnosticCategory.Error, key: "Cannot find name '{0}'." },
        Module_0_has_no_exported_member_1: { code: 2305, category: DiagnosticCategory.Error, key: "Module '{0}' has no exported member '{1}'." },
        File_0_is_not_an_external_module: { code: 2306, category: DiagnosticCategory.Error, key: "File '{0}' is not an external module." },
        Cannot_find_external_module_0: { code: 2307, category: DiagnosticCategory.Error, key: "Cannot find external module '{0}'." },
        Generic_type_0_requires_1_type_argument_s: { code: 2314, category: DiagnosticCategory.Error, key: "Generic type '{0}' requires {1} type argument(s)." },
        Type_0_is_not_generic: { code: 2315, category: DiagnosticCategory.Error, key: "Type '{0}' is not generic." },
        Index_signatures_are_incompatible_Colon: { code: 2330, category: DiagnosticCategory.Error, key: "Index signatures are incompatible:" },
        Index_signature_is_missing_in_type_0: { code: 2329, category: DiagnosticCategory.Error, key: "Index signature is missing in type '{0}'." },
        Types_of_parameters_0_and_1_are_incompatible_Colon: { code: 2328, category: DiagnosticCategory.Error, key: "Types of parameters '{0}' and '{1}' are incompatible:" },
        Required_property_0_cannot_be_reimplemented_with_optional_property_in_1: { code: 2327, category: DiagnosticCategory.Error, key: "Required property '{0}' cannot be reimplemented with optional property in '{1}'." },
        Types_of_property_0_are_incompatible_Colon: { code: 2326, category: DiagnosticCategory.Error, key: "Types of property '{0}' are incompatible:" },
        Type_0_is_not_assignable_to_type_1_Colon: { code: 2322, category: DiagnosticCategory.Error, key: "Type '{0}' is not assignable to type '{1}':" },
        Type_0_is_not_assignable_to_type_1: { code: 2323, category: DiagnosticCategory.Error, key: "Type '{0}' is not assignable to type '{1}'." },
        Property_0_is_missing_in_type_1: { code: 2324, category: DiagnosticCategory.Error, key: "Property '{0}' is missing in type '{1}'." },
        Private_property_0_cannot_be_reimplemented: { code: 2325, category: DiagnosticCategory.Error, key: "Private property '{0}' cannot be reimplemented." },
        Excessive_stack_depth_comparing_types_0_and_1: { code: 2321, category: DiagnosticCategory.Error, key: "Excessive stack depth comparing types '{0}' and '{1}'." },
        Static_members_cannot_reference_class_type_parameters: { code: 2302, category: DiagnosticCategory.Error, key: "Static members cannot reference class type parameters." },
        Type_0_recursively_references_itself_as_a_base_type: { code: 2310, category: DiagnosticCategory.Error, key: "Type '{0}' recursively references itself as a base type." },
        A_class_may_only_extend_another_class: { code: 2311, category: DiagnosticCategory.Error, key: "A class may only extend another class." },
        An_interface_may_only_extend_a_class_or_another_interface: { code: 2312, category: DiagnosticCategory.Error, key: "An interface may only extend a class or another interface." },

        // Custom Errors
        File_0_must_have_extension_d_json: { code: 10009, category: DiagnosticCategory.Error, key: "File '{0}' must have extension '.d.json'." },
        File_0_has_invalid_json_format_1: { code: 10010, category: DiagnosticCategory.Error, key: "File '{0}' has invalid JSON format: {1}" }
    }

    var localizedDiagnosticMessages: Map<string> = undefined;

    function getLocaleSpecificMessage(message: string) {
        if (localizedDiagnosticMessages) {
            message = localizedDiagnosticMessages[message];
        }

        return message;
    }

    function formatStringFromArgs(text: string, args: { [index: number]: any; }, baseIndex?: number): string {
        baseIndex = baseIndex || 0;

        return text.replace(/{(\d+)}/g, (match, index?) => args[+index + baseIndex]);
    }
}