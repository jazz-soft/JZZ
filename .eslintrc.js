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
  "overrides": [
    {
      "files": ["test/*"],
      "globals": {
        "describe": "readonly",
        "it": "readonly"
      },
      "rules": {
        "no-console" : "off"
      }
    },
    {
      "files": ["javascript/*"],
      "globals": {
        "define": "readonly"
      },
      "rules": {
        "no-console" : "off",
        "no-empty" : ["warn", { "allowEmptyCatch": true }]
      }
    }
  ]
};