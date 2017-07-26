module.exports = {
    env: {
        browser: true
    },
    extends: 'airbnb-base/legacy',
    rules: {
        'vars-on-top': 0,
        'no-param-reassign': 0,
        'consistent-return': 0,
        eqeqeq: ['error', 'always'],
        'no-var': 0,
        indent: ['error', 4],
        'space-before-function-paren': 2,
        'global-strict': 0,
        'jsx-a11y/href-no-hash': 'off',
        strict: 0,
        impliedStrict: 0,
        'func-names': ['off'],
        'linebreak-style': [
            'error',
            'unix'
        ],
        quotes: [
            'error',
            'single'
        ],
        semi: [
            'error',
            'always'
        ],
        'no-undef': ['off'],
        'no-multiple-empty-lines': [2, { max: 1, maxEOF: 1 }],
        'space-infix-ops': ['error'],
        'padded-blocks': ['error', 'never'],
        'object-curly-spacing': ['error', 'always'],
        'max-len': ['error', 80],
        'eol-last': 2
    }
};
