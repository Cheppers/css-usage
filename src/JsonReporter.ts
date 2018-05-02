
/// <reference path="../types/index.d.ts" />

import { CoverageEntry } from 'puppeteer';
import { CssUsage } from '../types';
import { BaseReporter } from './BaseReporter';

export class JsonReporter extends BaseReporter {

    protected jsonData: object;

    protected jsonReplacer: any = undefined;

    protected jsonSpace: number = 2;

    public init(): void {
        this.jsonData = {};
    }

    public addCoverageEntry(coverageEntry: CoverageEntry): void {
        const ruleRanges: CssUsage.RuleRanges = this.parser.parse(coverageEntry);
        const ruleIdToIndexMap: CssUsage.RuleIdToIndexMap = this.getRuleIdToIndexMap(coverageEntry.ranges);

        this.jsonData[coverageEntry.url] = {
            path: coverageEntry.url,
            statementMap: {},
            fnMap: {},
            branchMap: {},
            s: {},
            f: {},
            b: {},
        };

        let ruleIndex: number = -1;
        for (const ruleId in ruleRanges) {
            if (ruleRanges.hasOwnProperty(ruleId)) {
                ruleIndex++;
                const ruleRange: CssUsage.RuleRange = ruleRanges[ruleId];

                this.jsonData[coverageEntry.url].statementMap[ruleIndex] = {
                    start: {
                        line: ruleRange.loc.start.line,
                        column: ruleRange.loc.start.column,
                    },
                    end: {
                        line: ruleRange.loc.end.line,
                        column: ruleRange.loc.end.column,
                    },
                };

                this.jsonData[coverageEntry.url].s[ruleIndex] = ruleIdToIndexMap.hasOwnProperty(ruleId) ? 1 : 0;
            }
        }
    }

    public emit(): string {
        return JSON.stringify(this.jsonData, this.jsonReplacer, this.jsonSpace);
    }

}
