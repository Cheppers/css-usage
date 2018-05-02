
import { JsonReporter } from './JsonReporter';

const cases =  require('jest-in-case');

cases(
    'CloverReporter.fromCoverageEntries()',
    args => {
        const cloverReporter: JsonReporter = new JsonReporter();

        expect(cloverReporter.fromCoverageEntries(args.coverageEntries))
            .toEqual(args.expected);
    },
    [
        {
            name: 'basic',
            expected: [
                '{',
                '  "/a.css": {',
                '    "path": "/a.css",',
                '    "statementMap": {',
                '      "0": {',
                '        "start": {',
                '          "line": 1,',
                '          "column": 1',
                '        },',
                '        "end": {',
                '          "line": 3,',
                '          "column": 2',
                '        }',
                '      },',
                '      "1": {',
                '        "start": {',
                '          "line": 5,',
                '          "column": 1',
                '        },',
                '        "end": {',
                '          "line": 7,',
                '          "column": 2',
                '        }',
                '      }',
                '    },',
                '    "fnMap": {},',
                '    "branchMap": {},',
                '    "s": {',
                '      "0": 1,',
                '      "1": 0',
                '    },',
                '    "f": {},',
                '    "b": {}',
                '  }',
                '}',
            ].join('\n'),
            coverageEntries: [
                {
                    url: '/a.css',
                    ranges: [
                        {
                            start: 0,
                            end: 27,
                        }
                    ],
                    text: [
                        '.foo {',
                        '    display: none;',
                        '}',
                        '',
                        '.bar {',
                        '    color: red;',
                        '}',
                    ].join('\n'),
                }
            ],
        },
    ]
);
