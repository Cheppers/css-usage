
import { CoverageEntry } from 'puppeteer';
import { Parser } from '../src/Parser';

declare namespace CssUsage {

    interface RuleIdToIndexMap {
        [key: string]: number;
    }

    interface RuleRange {
        used: boolean;
        loc: Ast.Location;
    }

    interface RuleRanges {
        [ruleId: string]: RuleRange;
    }

    interface CoverageReporterConstructor {
        new (parser?: Parser);
    }

    interface CoverageReporterInterface {

        fromCoverageEntries(coverageEntries: CoverageEntry[]): string;

        init(): void;

        addCoverageEntries(coverageEntries: CoverageEntry[]): void;

        addCoverageEntry(coverageEntry: CoverageEntry): void;

        emit(): string;
    }

}
