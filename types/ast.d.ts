
declare namespace Ast {

    type TodoTypeHint = any;

    namespace NodeType {
        interface Base {
            type: string;
            loc: null | Location;
            children: null | List;
        }

        interface AnPlusB extends Base {
            a: null | string;
            b: null | string;
        }

        interface Atrule extends Base {
            prelude: null | TodoTypeHint;
            block: null | TodoTypeHint;
        }

        interface AtrulePrelude extends Base {
        }

        interface AttributeSelector extends Base {
            name: Identifier;
            matcher: null | string;
            value: null | String | Identifier;
        }

        interface Block extends  Base {
        }

        interface Brackets extends  Base {
        }

        interface CDC extends  Base {
        }

        interface CDO extends  Base {
        }

        interface ClassSelector extends  Base {
            name: string;
        }

        interface Combinator extends  Base {
            name: string;
        }

        interface Comment extends  Base {
            value: string;
        }

        interface Declaration extends  Base {
            important: boolean;
            property: string;
            value: Value | Raw;
        }

        interface DeclarationList extends Base {
        }

        interface Dimension extends Base {
            value: string;
            unit: string;
        }

        interface Function extends Base {
            name: string;
        }

        interface HexColor extends Base {
            value: string;
        }

        interface IdSelector extends Base {
            name: string;
        }

        interface Identifier extends Base {
            name: string;
        }

        interface MediaFeature extends Base {
            name: string;
            value: null | Identifier | number | Dimension | Ratio;
        }

        interface MediaQuery extends Base {
        }

        interface MediaQueryList extends Base {
        }

        interface Nth extends Base {
            nth: AnPlusB | Identifier;
            selector: null | SelectorList;
        }

        interface Number extends Base {
            value: string;
        }

        interface Operator extends Base {
            value: string;
        }

        interface Parentheses extends Base {
            value: string;
        }

        interface Percentage extends Base {
            value: string;
        }

        interface PseudoClassSelector extends Base {
            name: string;
        }

        interface PseudoElementSelector extends Base {
            name: string;
        }

        interface Ratio extends Base {
            left: string;
            right: string;
        }

        interface Raw extends Base {
            value: string;
        }

        interface Rule extends Base {
            prelude: SelectorList | Raw;
            block: Block;
        }

        interface Selector extends Base {
        }

        interface SelectorList extends Base {
        }

        interface String extends Base {
            value: string;
        }

        interface StyleSheet extends Base {
        }

        interface TypeSelector extends Base {
            name: string;
        }

        interface UnicodeRange extends Base {
            value: string;
        }

        interface Url extends Base {
            value: String | Raw;
        }

        interface Value extends Base {
        }

        interface WhiteSpace extends Base {
            value: string;
        }
    }


    interface Location {
        source: string;
        start: Position;
        end: Position;
    }

    interface Position {
        offset: number;
        line: number;
        column: number;
    }

    type ListIteratorCallback = (item: NodeType.Base, foo?: TodoTypeHint, list?: List) => void;

    /**
     * @link https://github.com/csstree/csstree/blob/bc4ca89ebd12179c426cfe1b6c004979ba62cd0b/docs/List.md
     */
    interface List {
        head: TodoTypeHint;
        tail: TodoTypeHint;
        cursor: TodoTypeHint;

        createItem();
        updateCursors();
        getSize(): number;
        fromArray();
        toArray(): TodoTypeHint;
        toJSON(): string;
        isEmpty(): boolean;
        first(): TodoTypeHint;
        last(): TodoTypeHint;
        each(): TodoTypeHint;
        forEach(callback: ListIteratorCallback): TodoTypeHint;
        eachRight(): TodoTypeHint;
        forEachRight(): TodoTypeHint;
        nextUntil(): TodoTypeHint;
        prevUntil(): TodoTypeHint;
        some(): TodoTypeHint;
        map(): any;
        filter(): TodoTypeHint;
        clear(): TodoTypeHint;
        copy(): TodoTypeHint;
        prepend(): TodoTypeHint;
        prependData(): TodoTypeHint;
        insert(): TodoTypeHint;
        insertData(): TodoTypeHint;
        remove(): TodoTypeHint;
        push(): TodoTypeHint;
        pop(): TodoTypeHint;
        unshift(): TodoTypeHint;
        shift(): TodoTypeHint;
        prependList(): TodoTypeHint;
        appendList(): TodoTypeHint;
        insertList(): TodoTypeHint;
        replace(): TodoTypeHint;
    }

}
