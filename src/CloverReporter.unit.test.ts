
import { CloverReporter } from './CloverReporter';

const cases =  require('jest-in-case');

cases(
    'CloverReporter.fromCoverageEntries()',
    args => {
        const date: Date = new Date(args.now);
        const cloverReporter: CloverReporter = new CloverReporter(undefined, date);

        expect(cloverReporter.fromCoverageEntries(args.coverageEntries))
            .toEqual(args.expected);
    },
    [
        {
            name: 'basic',
            expected: [
                '<?xml version="1.0"?>',
                '<coverage generated="237535200" clover="3.2.0">',
                '  <project timestamp="237535200" name="All files">',
                '    <metrics statements="2" coveredstatements="1" files="1">',
                '      <file name="foo" path="/a.css">',
                '        <metrics statements="2" coveredstatements="1"/>',
                '        <line num="1" count="1" type="stmt"/>',
                '        <line num="2" count="1" type="stmt"/>',
                '        <line num="3" count="1" type="stmt"/>',
                '        <line num="5" count="0" type="stmt"/>',
                '        <line num="6" count="0" type="stmt"/>',
                '        <line num="7" count="0" type="stmt"/>',
                '      </file>',
                '    </metrics>',
                '  </project>',
                '</coverage>',
            ].join('\n'),
            now: 237535200 * 1000,
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
