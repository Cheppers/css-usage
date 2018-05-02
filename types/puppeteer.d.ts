
declare namespace Puppeteer {
    type CoverageEntryRange = {
        start: number,
        end: number
    };

    type CoverageEntryRanges = CoverageEntryRange[];

    interface RuleUsageReport {
        ruleUsage: RuleUsage[];
    }

    interface RuleUsage {
        styleSheetId: string;
        startOffset: number;
        endOffset: number;
        used: boolean;
    }

    interface Stylesheet {
        header: StylesheetHeader;
    }

    interface StylesheetHeader {
        styleSheetId: string;
        frameId: string;
        sourceURL: string;
        origin: string;
        title: string;
        ownerNode: number;
        disabled: boolean;
        isInline: boolean;
        startLine: number;
        startColumn: number;
        length: number;
    }
}
