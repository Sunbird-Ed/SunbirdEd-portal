module.exports = {
    "env": {
        "browser": true,
        "es6": true
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
        "no-multiple-empty-lines": [2, { "max": 1, "maxEOF": 1 }],
        // "no-multiple-empty-lines": ["error", { "max": 1, "maxEOF": 0, "maxBOF": 0 }],
        "space-infix-ops": ["error"],
        "padded-blocks": ["error", "never"],
        "object-curly-spacing": ["error", "always"],
        "max-len": ["error", 80],
        "ecmaVersion": 0
    }
};