module.exports = {
    "env": {
        "browser": true
    },
    "extends": "eslint:recommended",
    "rules": {
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-undef": ["off"],
        "no-multiple-empty-lines": ["error", { "max": 1, "maxEOF": 0, "maxBOF": 0 }],
        "space-infix-ops": ["error"],
        "padded-blocks": ["error", "never"],
        // "space-before-function-paren": ["error", { "anonymous": "always", "named": "never", "asyncArrow": "always" }],
        "object-curly-spacing": ["error", "always"],
        "eol-last": ["error", "always"]
    }
};