module.exports = {
  "env": {
    "browser": true,
    "es6": true,
    "node": true
  },
  "extends": "eslint:recommended", 
  "parserOptions": {
    "ecmaVersion": 5
  },
  "rules": {
    "no-console" : "off",
    "no-empty" : ["warn", { "allowEmptyCatch": true }]
  },
  "overrides": [
    {
      "files": ["test/*"],
      "globals": {
        "describe": "readonly",
        "it": "readonly"
      }
    },
    {
      "files": ["javascript/*"],
      "globals": {
        "define": "readonly"
      },
      "rules": {
        "no-prototype-builtins" : "off"
      }
    }
  ]
};