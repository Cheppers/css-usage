
import { CoverageEntry } from 'puppeteer';
import RuleUsageReport = Puppeteer.RuleUsageReport;
import Stylesheet = Puppeteer.Stylesheet;
import RuleUsage = Puppeteer.RuleUsage;

export class MergeHandler {

    protected stylesheets: Stylesheet[];

    protected ruleUsageReports: RuleUsageReport[];

    protected  coverageEntries: CoverageEntry[];

    /**
     * For example: "1000024202.1": "https://example.com/a/b/c.css".
     */
    protected styleSheetIdToSourceURL: {
        [styleSheetId: string]: string
    };

    /**
     * For example: "https://example.com/a/b/c.css": "42".
     *
     * The "42" is the index in the this.result array, where the CoverageEntry with the URL can be found.
     */
    protected sourceURLToCoverageEntriesIndex: {
        [styleSheetId: string]: number
    };

    /**
     * The 9 is the index where the 5-8 can be found in this.result.*.ranges array.
     *
     * a.css: {
     *   5-8: 9
     * }
     */
    protected sourceURLAndRuleIdToRangeIndex: {
        [sourceURL: string]: {
            [ruleId: string]: number;
        };
    };

    protected result: CoverageEntry[];

    public merge(
        stylesheets: Stylesheet[],
        ruleUsageReports: RuleUsageReport[],
        coverageEntries: CoverageEntry[]
    ): CoverageEntry[] {
        this.stylesheets = stylesheets;
        this.ruleUsageReports = ruleUsageReports;
        this.coverageEntries = coverageEntries;
        this.result = [];

        this.initMappings();
        this.addRuleUsageReports();
        this.addCoverageEntries();
        this.sortResult();

        return this.result;
    }

    protected initMappings() {
        let index: number;

        this.sourceURLAndRuleIdToRangeIndex = {};

        this.styleSheetIdToSourceURL = {};
        for (index = 0; index < this.stylesheets.length; index++) {
            const stylesheet = this.stylesheets[index];
            this.styleSheetIdToSourceURL[stylesheet.header.styleSheetId] = stylesheet.header.sourceURL;
        }

        this.sourceURLToCoverageEntriesIndex = {};
        for (index = 0; index < this.coverageEntries.length; index++) {
            const coverageEntry = this.coverageEntries[index];
            if (!this.sourceURLToCoverageEntriesIndex.hasOwnProperty(coverageEntry.url)) {
                this.result.push({
                    url: coverageEntry.url,
                    ranges: [],
                    text: coverageEntry.text,
                });

                this.sourceURLToCoverageEntriesIndex[coverageEntry.url] = this.result.length - 1;
            }
        }
    }

    protected addRuleUsageReports(): void {
        for (let index = 0; index < this.ruleUsageReports.length; index++) {
            this.addRuleUsageReport(this.ruleUsageReports[index]);
        }
    }

    protected addRuleUsageReport(ruleUsageReport: RuleUsageReport): void {
        for (let index = 0; index < ruleUsageReport.ruleUsage.length; index++) {
            this.addRuleUsage(ruleUsageReport.ruleUsage[index]);
        }
    }

    protected addRuleUsage(ruleUsage: RuleUsage): void {
        if (!ruleUsage.used) {
            return;
        }

        this.addRangeToResult(
            this.styleSheetIdToSourceURL[ruleUsage.styleSheetId],
            ruleUsage.startOffset,
            ruleUsage.endOffset
        );
    }

    protected addCoverageEntries(): void {
        for (let index = 0; index < this.coverageEntries.length; index++) {
            this.addCoverageEntry(this.coverageEntries[index]);
        }
    }

    protected addCoverageEntry(coverageEntry: CoverageEntry): void {
        for (let index = 0; index < coverageEntry.ranges.length; index++) {
            this.addRangeToResult(
                coverageEntry.url,
                coverageEntry.ranges[index].start,
                coverageEntry.ranges[index].end
            );
        }
    }

    protected addRangeToResult(sourceUrl: string, start: number, end: number): void {
        const rangeId: string = this.getRangeId(start, end);
        const rangeIndex: number = this.getRangeIndex(sourceUrl, rangeId);

        if (typeof rangeIndex !== 'undefined') {
            return;
        }

        const coverageEntryIndex: number = this.sourceURLToCoverageEntriesIndex[sourceUrl];
        this.result[coverageEntryIndex].ranges.push({
            start: start,
            end: end,
        });

        if (!this.sourceURLAndRuleIdToRangeIndex.hasOwnProperty(sourceUrl)) {
            this.sourceURLAndRuleIdToRangeIndex[sourceUrl] = {};
        }

        this.sourceURLAndRuleIdToRangeIndex[sourceUrl][rangeId] = this.result[coverageEntryIndex].ranges.length - 1;
    }

    protected getRangeIndex(sourceUrl: string, rangeId: string): number | undefined {
        if (!this.sourceURLAndRuleIdToRangeIndex.hasOwnProperty(sourceUrl)
            || !this.sourceURLAndRuleIdToRangeIndex[sourceUrl].hasOwnProperty(rangeId)
        ) {
            return;
        }

        return this.sourceURLAndRuleIdToRangeIndex[sourceUrl][rangeId];
    }

    protected sortResult(): void {
        this.result.sort(this.compareCoverageEntries);
        for (let index = 0; index < this.result.length; index++) {
            this.result[index].ranges.sort(this.compareCoverageEntryRanges);
        }
    }

    protected getRangeId(start: number, end: number): string {
        return start.toString() + '-' + end.toString();
    }

    protected compareCoverageEntries(a: CoverageEntry, b: CoverageEntry): number {
        return a.url.localeCompare(b.url);
    }

    protected compareCoverageEntryRanges(a: Puppeteer.CoverageEntryRange, b: Puppeteer.CoverageEntryRange): number {
        if (a.start === b.start) {
            return 0;
        }

        return a.start < b.start ? -1 : 1;
    }
}
