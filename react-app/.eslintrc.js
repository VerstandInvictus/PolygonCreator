/* eslint-env node */
module.exports = {
    extends: ['eslint:all', 'plugin:@typescript-eslint/recommended', "plugin:react/all"],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    root: true,
    rules: {
        "@typescript-eslint/prefer-function-type": "error",
        "func-style": "off",
        "function-paren-newline": "off", // forces weird indents
        "init-declarations": "off",
        "max-len": ["error", {"code": 120}], // prefer 120 over 80 on split ultrawide monitor
        "max-statements": "off",
        "multiline-ternary": "off",
        "no-console": "off",
        "no-magic-numbers": "off",
        "no-ternary": "off",
        "one-var": "off", // lacks clarity
        "padded-blocks": "off", // every option has downsides
        "react/jsx-filename-extension": ["error", {"extensions": [".tsx", ".ts"]}],
        "react/jsx-no-literals": "off",
        "react/jsx-newline": "off",
        "react/jsx-max-props-per-line": "off",
        "react/no-unescaped-entities": "off", // template literals
        "react/require-default-props": "off"
    }
};