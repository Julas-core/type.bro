import { COMMON_WORDS } from './constants';

const SPANISH_WORDS = ["de", "la", "que", "el", "en", "y", "a", "los", "se", "del", "las", "un", "por", "con", "no", "una", "su", "para", "es", "al", "lo", "como", "más", "o", "pero", "sus", "le", "ha", "me", "si", "sin", "sobre", "este", "ya", "entre", "cuando", "todo", "esta", "ser", "son", "dos", "también", "fue", "había", "era", "muy", "años", "hasta", "desde", "está", "mi", "porque", "qué", "sólo", "han", "yo", "hay", "vez", "puede", "todos", "así", "nos", "ni", "parte", "tiene", "él", "uno", "donde", "bien", "tiempo", "mismo", "ese", "ahora", "cada", "e", "vida", "otro", "después", "te", "otros", "aunque", "esa", "eso", "hace", "otra", "gobierno", "tan", "durante", "siempre", "día", "tanto", "ella", "tres", "sí", "dijo", "sido"];
const CODE_RUST_KEYWORDS = ["as", "break", "const", "continue", "crate", "else", "enum", "extern", "false", "fn", "for", "if", "impl", "in", "let", "loop", "match", "mod", "move", "mut", "pub", "ref", "return", "self", "Self", "static", "struct", "super", "trait", "true", "type", "unsafe", "use", "where", "while", "async", "await", "dyn", "String", "Vec", "println!", "format!", "Result", "Option", "Some", "None", "Ok", "Err"];
const CODE_PYTHON_KEYWORDS = ["False", "None", "True", "and", "as", "assert", "async", "await", "break", "class", "continue", "def", "del", "elif", "else", "except", "finally", "for", "from", "global", "if", "import", "in", "is", "lambda", "nonlocal", "not", "or", "pass", "raise", "return", "try", "while", "with", "yield"];
const CODE_JS_KEYWORDS = ["abstract", "arguments", "await", "boolean", "break", "byte", "case", "catch", "char", "class", "const", "continue", "debugger", "default", "delete", "do", "double", "else", "enum", "eval", "export", "extends", "false", "final", "finally", "float", "for", "function", "goto", "if", "implements", "import", "in", "instanceof", "int", "interface", "let", "long", "native", "new", "null", "package", "private", "protected", "public", "return", "short", "static", "super", "switch", "synchronized", "this", "throw", "throws", "transient", "true", "try", "typeof", "var", "void", "volatile", "while", "with", "yield"];

export const getWordsForLanguage = (language: string): string[] => {
    switch (language) {
        case 'english':
        case 'english 1k': // In a real app, these would be different lists
        case 'english 10k':
            return COMMON_WORDS;
        case 'spanish':
            return SPANISH_WORDS;
        case 'code rust':
            return CODE_RUST_KEYWORDS;
        case 'code python':
            return CODE_PYTHON_KEYWORDS;
        case 'code javascript':
            return CODE_JS_KEYWORDS;
        default:
            if (language.startsWith('code')) return CODE_JS_KEYWORDS.concat(COMMON_WORDS.slice(0, 20));
            return SPANISH_WORDS; // Fallback for other natural languages
    }
};
