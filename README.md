# eslint-plugin-kdutify

> An eslint plugin for Kdutify.

## 💿 Install

You should have [`eslint`](https://eslint.org/docs/user-guide/getting-started) and [`eslint-plugin-kdu`](https://kdujs-eslint.web.app/user-guide/#installation) set up first.

```bash
yarn add eslint-plugin-kdutify -D
# OR
npm install eslint-plugin-kdutify --save-dev
```

```js
// .eslintrc.js
module.exports = {
  extends: [
    'plugin:kdu/base',
    'plugin:kdutify/base'
  ]
}
```

**NOTE** This plugin does not affect _**pug**_ templates due to a limitation in kdu-eslint-parser. I suggest converting your pug templates to HTML with [pug-to-html](https://github.com/leo-buneev/pug-to-html) in order to use this plugin.


## Rules

### Deprecations

These rules will help you avoid deprecated components, props, and classes. They are included in the `plugin:kdutify/base` preset.

- Prevent the use of components that have been removed from Kdutify ([`no-deprecated-components`])
- Prevent the use of props that have been removed from Kdutify ([`no-deprecated-props`])
- Prevent the use of classes that have been removed from Kdutify ([`no-deprecated-classes`])

### Grid system

These rules are designed to help migrate to the new grid system in Kdutify v2. They are included in the `plugin:kdutify/recommended` preset.

- Prevent the use of legacy grid components and props ([`no-legacy-grid`])
- Warn about unknown attributes not being converted to classes on new grid components ([`grid-unknown-attributes`])


[`no-legacy-grid`]: ./docs/rules/no-legacy-grid.md
[`grid-unknown-attributes`]: ./docs/rules/grid-unknown-attributes.md
[`no-deprecated-components`]: ./docs/rules/no-deprecated-components.md
[`no-deprecated-props`]: ./docs/rules/no-deprecated-props.md
[`no-deprecated-classes`]: ./docs/rules/no-deprecated-classes.md

### 📑 License
[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2023-present NKDuy
