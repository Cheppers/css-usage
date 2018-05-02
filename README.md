
# Google Chrome CSS rule ranges to coverage

With this package you can convert the Google Chrome CSS rule ranges to a
standard CSS coverage report, such as clover.xml.

```json
[
    {
        "url": "a.css",
        "ranges": [
            {
                "start": 0,
                "end": 27
            },
            {
                "start": 116,
                "end": 156
            }
        ],
        "text": "body {\n  font-size: 16px;\n}\n"
    }
]
```
