/* eslint-env node */
module.exports = {
    extends: ['eslint:all', 'plugin:@typescript-eslint/recommended', "plugin:react/all"],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    root: true,
    rules: {
        "@typescript-eslint/prefer-function-type": "error",
        "array-element-newline": "off",
        "arrow-body-style": "off", // forces odd formatting
        "capitalized-comments": ["error", "always", {"ignoreConsecutiveComments": true}],
        "func-style": "off",
        "function-call-argument-newline": "off",
        "function-paren-newline": "off", // forces weird indents
        "id-length": "off", // x, y, maps
        "init-declarations": "off",
        "linebreak-style": "off", // git can take care of this
        "line-comment-position": "off",
        "max-len": ["error", {"code": 120}], // prefer 120 over 80 on split ultrawide monitor
        "max-statements": "off",
        "max-lines": "off", // if I refactored PolygonEditor I'd reenable this
        "max-lines-per-function": "off", // for components
        "multiline-comment-style": "off",
        "multiline-ternary": "off",
        "no-console": "off",
        "no-extra-parens": "off", // interfering with JSX
        "no-inline-comments": "off",
        "no-magic-numbers": "off",
        "no-negated-condition": "off",
        "no-return-await": "off", // conflicts with require-await
        "no-ternary": "off",
        "no-undefined": "off",
        "object-property-newline": "off",
        "one-var": "off", // lacks clarity
        "padded-blocks": "off", // every option has downsides
        "quote-props": "off",
        "react/jsx-boolean-value": ["error", "always"],
        "react/jsx-filename-extension": ["error", {"extensions": [".tsx", ".ts"]}],
        "react/jsx-no-literals": "off",
        "react/jsx-no-bind": "off", // for Konva
        "react/jsx-newline": "off",
        "react/jsx-max-depth": "off",
        "react/jsx-max-props-per-line": "off",
        // As long as the file isn't huge, and they're thematically connected, better readability with multicomp
        "react/no-multi-comp": "off",
        "react/no-unescaped-entities": "off", // template literals
        "react/require-default-props": "off",
        "sort-imports": ["error", {"ignoreCase": true}]
    }
};