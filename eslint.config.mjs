import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Performance and optimization rules
      "@typescript-eslint/no-explicit-any": "warn",
      "react/display-name": "error",
      "react/no-children-prop": "error",
      "@typescript-eslint/no-unused-vars": ["error", {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_"
      }],

      // Allow some flexibility for optimization patterns
      "@typescript-eslint/ban-ts-comment": "warn",
      "@typescript-eslint/prefer-as-const": "error",

      // React specific optimizations
      "react/jsx-key": "error",
      "react/jsx-no-useless-fragment": ["warn", {
        "allowExpressions": true
      }],
      "react/self-closing-comp": ["warn", {
        "component": true,
        "html": true
      }],

      // Performance related
      "prefer-const": "error",
      "no-var": "error",
      "object-shorthand": "warn",

      // Additional optimization rules
      "no-unused-expressions": ["error", {
        "allowShortCircuit": true,
        "allowTernary": true,
        "allowTaggedTemplates": true
      }],
      "no-console": ["warn", {
        "allow": ["warn", "error", "info"]
      }],

      // React specific fixes
      "react/no-deprecated": "error",
      "react/no-unescaped-entities": ["error", {
        "forbid": [">", "}"]
      }],

      // Import optimization
      "import/no-duplicates": "error",
      "import/order": ["warn", {
        "groups": [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index"
        ],
        "newlines-between": "never",
        "alphabetize": {
          "order": "asc",
          "caseInsensitive": true
        }
      }],

      // Custom rules for performance hooks - UPDATED with specific exclusions
      "react-hooks/exhaustive-deps": ["error", {
        "additionalHooks": "(useExpensiveMemo|useDebounce|useThrottle)"
      }]
    },
    settings: {
      react: {
        version: "detect"
      },
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true
        }
      }
    },
    files: ["**/*.{js,jsx,ts,tsx}"],
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "dist/**",
      "*.config.js",
      "*.config.ts"
    ]
  },
  {
    // Special rules for performance hooks file to disable specific exhaustive-deps warnings
    files: ["src/hooks/use-performance.ts"],
    rules: {
      "react-hooks/exhaustive-deps": ["error", {
        "additionalHooks": "useExpensiveMemo"
      }]
    }
  }
];

export default eslintConfig;