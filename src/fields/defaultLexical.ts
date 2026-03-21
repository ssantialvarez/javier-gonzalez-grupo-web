import type { TextFieldSingleValidation } from 'payload'
import {
  AlignFeature,
  BoldFeature,
  ChecklistFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  IndentFeature,
  InlineToolbarFeature,
  ItalicFeature,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  UnderlineFeature,
  UnorderedListFeature,
  UploadFeature,
  lexicalEditor,
  type LinkFields,
} from '@payloadcms/richtext-lexical'
import { TextSizeFeature } from '@payloadcms-toolbox/lexical-text-size'

export const defaultLexical = lexicalEditor({
  features: [
    TextSizeFeature(),
    AlignFeature(),
    BoldFeature(),
    ChecklistFeature(),
    HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
    HorizontalRuleFeature(),
    IndentFeature(),
    InlineToolbarFeature(),
    ItalicFeature(),
    OrderedListFeature(),
    ParagraphFeature(),
    UnderlineFeature(),
    UnorderedListFeature(),
    UploadFeature(),
    LinkFeature({
      enabledCollections: ['pages', 'posts'],
      fields: ({ defaultFields }) => {
        const defaultFieldsWithoutUrl = defaultFields.filter((field) => {
          if ('name' in field && field.name === 'url') return false
          return true
        })

        return [
          ...defaultFieldsWithoutUrl,
          {
            name: 'url',
            type: 'text',
            admin: {
              condition: (_data, siblingData) => siblingData?.linkType !== 'internal',
            },
            label: ({ t }) => t('fields:enterURL'),
            required: true,
            validate: ((value, options) => {
              if ((options?.siblingData as LinkFields)?.linkType === 'internal') {
                return true // no validation needed, as no url should exist for internal links
              }
              return value ? true : 'URL is required'
            }) as TextFieldSingleValidation,
          },
        ]
      },
    }),
  ],
})
