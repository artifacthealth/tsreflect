module reflect {

    export class Diagnostic {

        file: SourceFile;
        messageText: string;
        category: DiagnosticCategory;
        code: number;

        constructor(file: SourceFile, message: DiagnosticMessage, ...args: any[]);
        constructor(file: SourceFile, message: DiagnosticMessage) {

            var text = getLocaleSpecificMessage(message.key);

            if (arguments.length > 4) {
                text = formatStringFromArgs(text, arguments, 4);
            }

            this.file = file;
            this.messageText = text;
            this.category = message.category;
            this.code = message.code;
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

        Duplicate_identifier_0: { code: 1000, category: DiagnosticCategory.Error, key: "Duplicate identifier '{0}'." },
        File_0_not_found: { code: 1001, category: DiagnosticCategory.Error, key: "File '{0}' not found." },
        File_0_must_have_extension_d_json: { code: 1002, category: DiagnosticCategory.Error, key: "File '{0}' must have extension '.d.json'." },
        Filename_0_differs_from_already_included_filename_1_only_in_casing: { code: 1003, category: DiagnosticCategory.Error, key: "Filename '{0}' differs from already included filename '{1}' only in casing" },
        Cannot_read_file_0_Colon_1: { code: 1003, category: DiagnosticCategory.Error, key: "Cannot read file '{0}': {1}" },
        Circular_definition_of_import_alias_0: { code: 1004, category: DiagnosticCategory.Error, key: "Circular definition of import alias '{0}'." },
        Cannot_find_name_0: { code: 1005, category: DiagnosticCategory.Error, key: "Cannot find name '{0}'." },
        Module_0_has_no_exported_member_1: { code: 1006, category: DiagnosticCategory.Error, key: "Module '{0}' has no exported member '{1}'." },
        File_0_is_not_an_external_module: { code: 1007, category: DiagnosticCategory.Error, key: "File '{0}' is not an external module." },
        Cannot_find_external_module_0: { code: 1008, category: DiagnosticCategory.Error, key: "Cannot find external module '{0}'." },
        Generic_type_0_requires_1_type_argument_s: { code: 1009, category: DiagnosticCategory.Error, key: "Generic type '{0}' requires {1} type argument(s)." },
        Type_0_is_not_generic: { code: 1010, category: DiagnosticCategory.Error, key: "Type '{0}' is not generic." }
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