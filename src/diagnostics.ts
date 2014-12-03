module reflect {

    export interface DiagnosticError extends Error {

        diagnostics: Diagnostic[];
    }

    export class Diagnostic {

        filename: string;
        messageText: string;
        category: DiagnosticCategory;
        code: number;

        constructor(file: SourceFile, message: DiagnosticMessage, ...args: any[]);
        constructor(file: SourceFile, message: DiagnosticMessage) {

            var text = getLocaleSpecificMessage(message.key);
            if (arguments.length > 2) {
                text = formatStringFromArgs(text, arguments, 2);
            }

            if(file) {
                this.filename = file.filename;
            }
            this.messageText = text;
            this.category = message.category;
            this.code = message.code;
        }
    }

    export interface DiagnosticMessageChain {

        diagnostic: Diagnostic;
        next?: DiagnosticMessageChain;
    }

    export function chainDiagnosticMessages(details: DiagnosticMessageChain, diagnostic: Diagnostic): DiagnosticMessageChain {

        return {
            diagnostic: diagnostic,
            next: details
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
        Types_have_separate_declarations_of_a_private_property_0: { code: 2442, category: DiagnosticCategory.Error, key: "Types have separate declarations of a private property '{0}'." },
        Property_0_is_private_in_type_1_but_not_in_type_2: { code: 2325, category: DiagnosticCategory.Error, key: "Property '{0}' is private in type '{1}' but not in type '{2}'." },
        Property_0_is_protected_but_type_1_is_not_a_class_derived_from_2: { code: 2443, category: DiagnosticCategory.Error, key: "Property '{0}' is protected but type '{1}' is not a class derived from '{2}'." },
        Property_0_is_protected_in_type_1_but_public_in_type_2: { code: 2444, category: DiagnosticCategory.Error, key: "Property '{0}' is protected in type '{1}' but public in type '{2}'." },
        Property_0_is_optional_in_type_1_but_required_in_type_2: { code: 2327, category: DiagnosticCategory.Error, key: "Property '{0}' is optional in type '{1}' but required in type '{2}'." },

        // Custom Errors
        File_0_must_have_extension_d_json: { code: 10009, category: DiagnosticCategory.Error, key: "File '{0}' must have extension '.d.json'." },
        File_0_has_invalid_json_format_1: { code: 10010, category: DiagnosticCategory.Error, key: "File '{0}' has invalid JSON format: {1}" },
        Missing_required_argument_0: { code: 10011, category: DiagnosticCategory.Error, key: "Missing required argument '{0}'." }
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