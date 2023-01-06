'use strict'

const { hyphenate, classify } = require('../util/helpers')
const { getInstalledKdutifyVersion } = require('../util/get-installed-kdutify-version')

const replacements = {
  KListTile: 'k-list-item',
  KListTileAction: 'k-list-item-action',
  KListTileAvatar: 'k-list-item-avatar',
  KListTileActionText: 'k-list-item-action-text',
  KListTileContent: 'k-list-item-content',
  KListTileTitle: 'k-list-item-title',
  KListTileSubTitle: 'k-list-item-subtitle',
  KJumbotron: false,

  // Possible typos
  KListItemSubTitle: 'k-list-item-subtitle',
  KListTileSubtitle: 'k-list-item-subtitle'
}

if (getInstalledKdutifyVersion() >= '2.3.0') {
  replacements.KContent = 'k-main'
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Prevent the use of components that have been removed from Kdutify',
      category: 'recommended'
    },
    fixable: 'code',
    schema: [],
    messages: {
      replacedWith: `'{{ a }}' has been replaced with '{{ b }}'`,
      removed: `'{{ name }}' has been removed`
    }
  },
  create (context) {
    return context.parserServices.defineTemplateBodyVisitor({
      KElement (element) {
        const tag = classify(element.rawName)

        const tokens = context.parserServices.getTemplateBodyTokenStore()

        if (Object.prototype.hasOwnProperty.call(replacements, tag)) {
          const replacement = replacements[tag]
          if (replacement) {
            context.report({
              node: element,
              messageId: 'replacedWith',
              data: {
                a: hyphenate(tag),
                b: replacement
              },
              fix (fixer) {
                const open = tokens.getFirstToken(element.startTag)
                const endTag = element.endTag
                if (!endTag) {
                  return fixer.replaceText(open, `<${replacement}`)
                }
                const endTagOpen = tokens.getFirstToken(endTag)
                return [
                  fixer.replaceText(open, `<${replacement}`),
                  fixer.replaceText(endTagOpen, `</${replacement}`)
                ]
              }
            })
          } else {
            context.report({
              node: element,
              messageId: 'removed',
              data: { name: hyphenate(tag) }
            })
          }
        }
      }
    })
  }
}
