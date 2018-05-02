/// <reference path="../types/index.d.ts" />

import { CoverageEntry } from 'puppeteer';
import { Parser } from './Parser';
import { CssUsage } from '../types';

export abstract class BaseReporter implements CssUsage.CoverageReporterInterface {

    protected parser: Parser;

    constructor(parser?: Parser) {
        this.parser = parser ? parser : new Parser();
    }

    public fromCoverageEntries(coverageEntries: CoverageEntry[]): string {
        this.init();
        this.addCoverageEntries(coverageEntries);

        return this.emit();
    }

    public init(): void {
        // Nothing to do.
    }

    public addCoverageEntries(coverageEntries: CoverageEntry[]): void {
        for (const coverageEntry of coverageEntries) {
            this.addCoverageEntry(coverageEntry);
        }
    }

    public abstract addCoverageEntry(coverageEntry: CoverageEntry): void;

    public abstract emit(): string;

    protected getRuleIdToIndexMap(ranges: Puppeteer.CoverageEntryRanges): CssUsage.RuleIdToIndexMap {
        const map = {};

        for (let key = 0; key < ranges.length; key++) {
            const range = ranges[key];
            const ruleId: string = this.getRuleId(range.start, range.end);
            map[ruleId] = key;
        }

        return map;
    }

    protected getRuleId(start: number, end: number): string {
        return start.toString() + '-' + end.toString();
    }

}
