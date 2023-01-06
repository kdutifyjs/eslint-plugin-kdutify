'use strict'

module.exports = {
  plugins: [
    'kdutify'
  ],
  rules: {
    'kdu/valid-k-slot': ['error', {
      allowModifiers: true
    }],

    'kdutify/no-deprecated-components': 'error',
    'kdutify/no-deprecated-props': 'error',
    'kdutify/no-deprecated-classes': 'error'
  }
}
