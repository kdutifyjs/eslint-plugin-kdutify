'use strict'

const { hyphenate, classify, mergeDeep } = require('../util/helpers')
const { getInstalledKdutifyVersion } = require('../util/get-installed-kdutify-version')

const replacements = {
  KBtn: {
    outline: 'outlined',
    flat: 'text',
    round: 'rounded'
  },
  KAlert: {
    outline: 'outlined'
  },
  KBottomNavigation: {
    active: { custom: 'value or k-model' }
  },
  KCarousel: {
    hideControls: { custom: ':show-arrows="false"' }
  },
  KChip: {
    outline: 'outlined',
    selected: 'value'
  },
  KDataIterator: {
    expand: 'showExpand',
    contentClass: false,
    contentProps: false,
    contentTag: false,
    disableInitialSort: 'sortBy',
    filter: 'customFilter',
    pagination: 'options',
    totalItems: 'serverItemsLength',
    hideActions: 'hideDefaultFooter',
    rowsPerPageItems: { custom: 'footer-props.itemsPerPageOptions' },
    rowsPerPageText: { custom: 'footer-props.itemsPerPageText' },
    prevIcon: { custom: 'footer-props.prevIcon' },
    nextIcon: { custom: 'footer-props.nextIcon' }
  },
  KDataTable: {
    sortIcon: { custom: 'header-props.sortIcon' },
    hideHeaders: 'hideDefaultHeader',
    selectAll: 'showSelect'
  },
  KExpansionPanels: {
    expand: 'multiple'
  },
  KTextField: {
    box: 'filled'
  },
  KTextArea: {
    box: 'filled'
  },
  KSelect: {
    box: 'filled',
    combobox: { custom: '<k-combobox />' }
  },
  KAutocomplete: {
    box: 'filled'
  },
  KCombobox: {
    box: 'filled'
  },
  KListItem: {
    avatar: false
  },
  KToolbar: {
    app: { custom: '<k-app-bar app />' },
    manualScroll: { custom: '<k-app-bar :value="false" />' },
    clippedLeft: { custom: '<k-app-bar clipped-left />' },
    clippedRight: { custom: '<k-app-bar clipped-right />' },
    invertedScroll: { custom: '<k-app-bar inverted-scroll />' },
    scrollOffScreen: { custom: '<k-app-bar scroll-off-screen />' },
    scrollTarget: { custom: '<k-app-bar scroll-target />' },
    scrollThreshold: { custom: '<k-app-bar scroll-threshold />' },
    card: 'flat'
  },
  KSnackbar: {
    autoHeight: false
  }
}

if (getInstalledKdutifyVersion() >= '2.3.0') {
  mergeDeep(replacements, {
    KBanner: {
      mobileBreakPoint: 'mobileBreakpoint'
    },
    KDataIterator: {
      mobileBreakPoint: 'mobileBreakpoint'
    },
    KNavigationDrawer: {
      mobileBreakPoint: 'mobileBreakpoint'
    },
    KSlideGroup: {
      mobileBreakPoint: 'mobileBreakpoint'
    },
    KTabs: {
      mobileBreakPoint: 'mobileBreakpoint'
    }
  })
}

mergeDeep(replacements.KDataTable, replacements.KDataIterator)

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Prevent the use of removed and deprecated props.',
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
      KAttribute (attr) {
        if (
          attr.directive &&
          (attr.key.name.name !== 'bind' || !attr.key.argument)
        ) return

        const tag = classify(attr.parent.parent.rawName)
        if (!Object.keys(replacements).includes(tag)) return

        const propName = attr.directive
          ? hyphenate(attr.key.argument.rawName)
          : hyphenate(attr.key.rawName)

        const propNameNode = attr.directive
          ? attr.key.argument
          : attr

        Object.entries(replacements[tag]).forEach(([test, replace]) => {
          if (hyphenate(test) === propName) {
            if (replace === false) {
              context.report({
                messageId: 'removed',
                data: { name: propName },
                node: propNameNode
              })
            } else if (typeof replace === 'string') {
              context.report({
                messageId: 'replacedWith',
                data: {
                  a: propName,
                  b: replace
                },
                node: propNameNode,
                fix (fixer) {
                  return fixer.replaceText(propNameNode, replace)
                }
              })
            } else if (typeof replace === 'object' && Object.hasOwnProperty.call(replace, 'custom')) {
              context.report({
                messageId: 'replacedWith',
                data: {
                  a: propName,
                  b: replace.custom
                },
                node: propNameNode
              })
            }
          }
        })
      }
    })
  }
}
