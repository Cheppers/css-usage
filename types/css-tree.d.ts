
declare namespace CssTree {

    interface CssTree {
        parse(css: string, options?: ParseOptions): Ast.NodeType.Base;
    }

    /**
     * @link https://github.com/csstree/csstree/blob/HEAD/docs/parsing.md#context
     */
    interface ParseOptions {
        context?: string;
        atrule?: string | null;
        positions?: boolean;
        // @todo Type hints for callback arguments
        onParseError?: (error, fallbackNode) => void;
        filename?: string;
        line?: number;
        column?: number;
        parseAtrulePrelude?: boolean;
        parseRulePrelude?: boolean;
        parseValue?: boolean;
        parseCustomProperty?: boolean;
    }

}
