const SchemaType = {
  OBJECT: 'object',
  ARRAY: 'array',
  STRING: 'string',
  INTEGER: 'integer',
}

/** Gemini responseSchema — enforces consistent JSON shape. */
export const AUDIT_RESPONSE_SCHEMA =
  type: SchemaType.OBJECT,
  properties: {
    scorecards: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          name: { type: SchemaType.STRING },
          score: { type: SchemaType.INTEGER },
          description: { type: SchemaType.STRING },
        },
        required: ['name', 'score', 'description'],
      },
    },
    whatWorking: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
    },
    issues: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          id: { type: SchemaType.STRING },
          title: { type: SchemaType.STRING },
          severity: { type: SchemaType.STRING },
          explanation: { type: SchemaType.STRING },
          whyItMatters: { type: SchemaType.STRING },
          userFriction: { type: SchemaType.STRING },
          recommendation: { type: SchemaType.STRING },
        },
        required: [
          'id',
          'title',
          'severity',
          'explanation',
          'whyItMatters',
          'userFriction',
          'recommendation',
        ],
      },
    },
    roastSummary: { type: SchemaType.STRING },
    improvements: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          id: { type: SchemaType.STRING },
          title: { type: SchemaType.STRING },
          description: { type: SchemaType.STRING },
          impact: { type: SchemaType.STRING },
        },
        required: ['id', 'title', 'description', 'impact'],
      },
    },
  },
  required: ['scorecards', 'whatWorking', 'issues', 'roastSummary', 'improvements'],
}
