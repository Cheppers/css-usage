
/// <reference path="../types/index.d.ts" />

import { CoverageEntry } from 'puppeteer';
import * as XmlBuilder from 'xmlbuilder';
import { CssUsage } from '../types';
import { BaseReporter } from './BaseReporter';
import { Parser } from './Parser';

export class CloverReporter extends BaseReporter {

    protected xmlData: any;

    protected cloverVersion: string = '3.2.0';

    protected xmlOutputConfig: Object = {
        pretty: true,
    };

    protected date: Date;

    constructor(parser?: Parser, date?: Date) {
        super();
        this.date = date ? date : new Date();
    }

    public init(): void {
        const now = this.getCurrentTimestamp();

        this.xmlData = {
            coverage: {
                '@generated': now,
                '@clover': this.cloverVersion,
                project: {
                    '@timestamp': now,
                    '@name': 'All files',
                    metrics: {
                        '@statements': 0,
                        '@coveredstatements': 0,
                        '@files': 0,
                        file: [],
                    }
                },
            },
        };
    }

    public addCoverageEntry(coverageEntry: CoverageEntry): void {
        const ruleRanges: CssUsage.RuleRanges = this.parser.parse(coverageEntry);
        const ruleIdToIndexMap: CssUsage.RuleIdToIndexMap = this.getRuleIdToIndexMap(coverageEntry.ranges);

        const file: any = {
            '@name': 'foo',
            '@path': coverageEntry.url,
            metrics: {
                '@statements': 0,
                '@coveredstatements': 0,
            },
            line: [],
        };

        this.xmlData.coverage.project.metrics.file.push(file);
        this.xmlData.coverage.project.metrics['@files']++;

        for (const ruleId in ruleRanges) {
            if (ruleRanges.hasOwnProperty(ruleId)) {
                const ruleRange: CssUsage.RuleRange = ruleRanges[ruleId];
                file.metrics['@statements']++;
                if (ruleRange.used) {
                    file.metrics['@coveredstatements']++;
                }

                for (let lineNumber = ruleRange.loc.start.line; lineNumber <= ruleRange.loc.end.line; lineNumber++) {
                    file.line.push({
                        '@num': lineNumber,
                        '@count': ruleIdToIndexMap.hasOwnProperty(ruleId) ? 1 : 0,
                        '@type': 'stmt',
                    });
                }
            }
        }

        this.xmlData.coverage.project.metrics['@statements'] += file.metrics['@statements'];
        this.xmlData.coverage.project.metrics['@coveredstatements'] += file.metrics['@coveredstatements'];
    }

    public emit(): string {
        return XmlBuilder
            .create(this.xmlData)
            .end(this.xmlOutputConfig);
    }

    protected getCurrentTimestamp(): number {
        return Math.floor(this.date.getTime() / 1000);
    }

}
