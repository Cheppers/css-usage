///<reference path="../node_modules/@types/puppeteer/index.d.ts"/>

import { MergeHandler } from './MergeHandler';
import { CoverageEntry } from 'puppeteer';
import RuleUsageReport = Puppeteer.RuleUsageReport;
import Stylesheet = Puppeteer.Stylesheet;

const cssFileContent = [
    '.foo {',
    '    display: none;',
    '}',
    '',
    '.bar {',
    '    display: none;',
    '}',
    '',
    '.baz {',
    '    display: none;',
    '}',
].join('\n');

test(
    'MergeHandler.merge()',
    () => {
        const expected = [
                {
                    url: '/a.css',
                    ranges: [
                        {
                            start: 0,
                            end: 27,
                        },
                        {
                            start: 60,
                            end: 87,
                        },
                    ],
                    text: cssFileContent,
                },
                {
                    url: '/b.css',
                    ranges: [
                        {
                            start: 0,
                            end: 27,
                        },
                        {
                            start: 60,
                            end: 87,
                        },
                    ],
                    text: cssFileContent,
                },
                {
                    url: '/c.css',
                    ranges: [
                        {
                            start: 30,
                            end: 57,
                        },
                        {
                            start: 60,
                            end: 87,
                        },
                    ],
                    text: cssFileContent,
                },
            ];

        const stylesheets: Stylesheet[] = [
            {
                header: {
                    styleSheetId: '100.1',
                    sourceURL: '/a.css'
                }
            },
            {
                header: {
                    styleSheetId: '100.2',
                    sourceURL: '/b.css'
                }
            },
            {
                header: {
                    styleSheetId: '101.1',
                    sourceURL: '/a.css'
                }
            },
            {
                header: {
                    styleSheetId: '101.2',
                    sourceURL: '/b.css'
                }
            },
            {
                header: {
                    styleSheetId: '102.1',
                    sourceURL: '/a.css'
                }
            },
            {
                header: {
                    styleSheetId: '102.2',
                    sourceURL: '/c.css'
                }
            },
        ];

        const ruleUsageReports: RuleUsageReport[] = [
            {
                ruleUsage: [
                    {
                        styleSheetId: '100.1',
                        startOffset: 0,
                        endOffset: 27,
                        used: true
                    },
                    {
                        styleSheetId: '100.2',
                        startOffset: 0,
                        endOffset: 27,
                        used: true
                    },
                ],
            },
            {
                ruleUsage: [
                    {
                        styleSheetId: '101.1',
                        startOffset: 60,
                        endOffset: 87,
                        used: true
                    },
                    {
                        styleSheetId: '101.2',
                        startOffset: 60,
                        endOffset: 87,
                        used: true
                    },
                ],
            },
            {
                ruleUsage: [
                    {
                        styleSheetId: '102.1',
                        startOffset: 0,
                        endOffset: 27,
                        used: true
                    },
                    {
                        styleSheetId: '102.2',
                        startOffset: 60,
                        endOffset: 87,
                        used: true
                    },
                ],
            },
        ];

        const coverageEntries: CoverageEntry[] = [
            {
                url: '/c.css',
                ranges: [
                    {
                        start: 30,
                        end: 57,
                    },
                ],
                text: cssFileContent,
            },
            {
                url: '/a.css',
                ranges: [],
                text: cssFileContent,
            },
            {
                url: '/b.css',
                ranges: [],
                text: cssFileContent,
            },
        ];

        const mergeHandler: MergeHandler = new MergeHandler();

        expect(mergeHandler.merge(stylesheets, ruleUsageReports, coverageEntries))
            .toEqual(expected);
    }
);
