module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:react/recommended"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["./tsconfig.json"],
    ecmaFeatures: { jsx: true }
  },
  plugins: ["@typescript-eslint"],
  overrides: [
    {
      files: "devServers/**",
      env: { node: true },
      rules: {
        "@typescript-eslint/no-var-requires": "off"
      }
    }
  ],
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {
    "@typescript-eslint/explicit-function-return-type": [
      "warn",
      {
        allowExpressions: true
      }
    ]
  }
};
