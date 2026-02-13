import rules from "@odg/eslint-config";

export default [
    ...rules,
    {
        "files": [ "**/Decorators/*.ts" ],
        "rules": {
            "max-classes-per-file": [
                "error",
                { "ignoreExpressions": true, "max": 1 },
            ],
        },
    },
];
