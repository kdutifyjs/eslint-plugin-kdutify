'use strict'

const loadModule = require('../util/load-module')
const { hyphenate, classify, getAttributes } = require('../util/helpers')
const { isGridAttribute } = require('../util/grid-attributes')
const { addClass, removeAttr } = require('../util/fixers')

const KGrid = {
  KContainer: loadModule('kdutify/es5/components/KGrid/KContainer').default,
  KRow: loadModule('kdutify/es5/components/KGrid/KRow').default,
  KCol: loadModule('kdutify/es5/components/KGrid/KCol').default
}

const tags = Object.keys(KGrid).reduce((t, k) => {
  t[classify(k)] = Object.keys(KGrid[k].options.props).map(p => hyphenate(p)).sort()

  return t
}, {})

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'warn about unknown attributes not being converted to classes on new grid components',
      category: 'recommended'
    },
    fixable: 'code',
    schema: []
  },
  create (context) {
    return context.parserServices.defineTemplateBodyVisitor({
      KElement (element) {
        const tag = classify(element.rawName)
        if (!Object.keys(tags).includes(tag)) return

        const attributes = getAttributes(element).filter(({ name }) => {
          return !tags[tag].includes(name) && !isGridAttribute(tag, name)
        })

        if (attributes.length) {
          context.report({
            node: element.startTag,
            loc: {
              start: attributes[0].node.loc.start,
              end: attributes[attributes.length - 1].node.loc.end
            },
            message: 'Attributes are no longer converted into classes',
            fix (fixer) {
              const fixableAttrs = attributes.map(({ node }) => node)
                .filter(attr => !attr.directive)

              if (!fixableAttrs.length) return

              const className = fixableAttrs.map(node => node.key.rawName).join(' ')
              return [
                addClass(context, fixer, element, className),
                ...fixableAttrs.map(removeAttr.bind(this, context, fixer))
              ]
            }
          })
        }
      }
    })
  }
}
