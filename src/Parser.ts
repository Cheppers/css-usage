
/// <reference path="../types/ast.d.ts" />
/// <reference path="../types/css-tree.d.ts" />
/// <reference path="../types/index.d.ts" />
/// <reference path="../types/puppeteer.d.ts" />

import { CoverageEntry } from 'puppeteer';
import { CssUsage } from '../types';

export class Parser {

    cssTree: CssTree.CssTree;

    cssTreeParseOptions: CssTree.ParseOptions = {
        positions: true
    };

    cssCoverage: CoverageEntry;

    ruleRanges: CssUsage.RuleRanges;

    ast: Ast.NodeType.Base;

    constructor(cssTree?: CssTree.CssTree) {
        this.cssTree = cssTree ? cssTree : require('css-tree');
    }

    public parse(cssCoverage: CoverageEntry): CssUsage.RuleRanges {
        this.cssCoverage = cssCoverage;
        this.reset();
        this.initAst();
        this.initRuleRanges();
        this.markUsedRuleRanges();

        return this.ruleRanges;
    }

    protected reset() {
        this.ruleRanges = {};
    }

    protected initAst() {
        this.ast = this.cssTree.parse(this.cssCoverage.text, this.cssTreeParseOptions);
    }

    protected initRuleRanges() {
        const self = this;
        this.ast.children.forEach(function (rule: Ast.NodeType.Base) {
            if (rule.type !== 'Rule') {
                return;
            }

            const ruleId: string = self.getRuleIdFromAstRule(<Ast.NodeType.Rule> rule);
            self.ruleRanges[ruleId] = {
                used: false,
                loc: rule.loc,
            };
        });
    }

    protected markUsedRuleRanges() {
        for (const range of this.cssCoverage.ranges) {
            const ruleId: string = this.getRuleIdFromRange(range);
            if (!this.ruleRanges.hasOwnProperty(ruleId)) {
                console.error('Something wrong. Puppeteer and css-tree have different rule ranges. ' + ruleId);

                continue;
            }

            this.ruleRanges[ruleId].used = true;
        }
    }

    protected getRuleIdFromRange(range: Puppeteer.CoverageEntryRange): string {
        return this.getRuleId(range.start, range.end);
    }

    protected getRuleIdFromAstRule(rule: Ast.NodeType.Rule): string {
        return this.getRuleId(rule.loc.start.offset, rule.loc.end.offset);
    }

    protected getRuleId(start: number, end: number): string {
        return start.toString() + '-' + end.toString();
    }
}
