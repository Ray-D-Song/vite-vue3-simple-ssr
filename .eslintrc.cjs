module.exports = {
    "ignorePatterns": ["dist/*"],
    "env": {
        "browser": true,
        "es2021": true,
        "node": true
    },
    "extends": [
        "standard-with-typescript",
        "plugin:vue/vue3-essential"
    ],
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "extraFileExtensions": [".vue"],
        "ecmaVersion": "latest",
        "sourceType": "module",
        "project": "./tsconfig.json"
    },
    "plugins": [
        "vue",
        "@typescript-eslint"
    ],
    "rules": {
        "@typescript-eslint/no-unsafe-argument": "off",
        "@typescript-eslint/no-floating-promises": "off",
        "@typescript-eslint/strict-boolean-expressions": "off",
        "@typescript-eslint/triple-slash-reference": "off",
				"@typescript-eslint/no-invalid-void-type": "off",
				"@typescript-eslint/promise-function-async": "off",
				"@typescript-eslint/return-await": "off",
				"@typescript-eslint/explicit-function-return-type": "off",
				"@typescript-eslint/prefer-nullish-coalescing": "off",
				"@typescript-eslint/ban-ts-comment": "off",
				"@typescript-eslint/prefer-ts-expect-error": "off",
				"no-tabs": "off"
    }
}
