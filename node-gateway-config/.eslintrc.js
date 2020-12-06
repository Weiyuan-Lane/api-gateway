module.exports = {
  'env': {
    'browser': true,
    'es6': true,
    'node': true,
  },
  root: true,
  'extends': [
    'eslint:recommended',
  ],
  'parser': 'esprima',
  'rules': {
    'semi': [
      'error',
      'always',
    ],
    'indent': [
      'error', 2, 
      { 'SwitchCase': 1 },
    ],
    'linebreak-style': ['error', 'unix'],
    'quotes': ['error', 'single'],
    'comma-dangle': ['error', 'always-multiline'],
  },
  'overrides': [
    {
      'files': ['**/*.ts', '**/*.tsx'],
      'env': { 
        'browser': true, 
        'es6': true, 
        'node': true,
      },
      'extends': [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
      ],
      'parser': '@typescript-eslint/parser',
      'parserOptions': {
        'project': 'tsconfig.json',
        'sourceType': 'module',
      },
      'plugins': [
        'prefer-arrow',
        '@typescript-eslint',
        '@typescript-eslint/eslint-plugin-tslint',
      ],
      'rules': {
        'semi': [
          'error',
          'always',
        ],
        'indent': [
          'error', 2, 
          { 'SwitchCase': 1 },
        ],
        'linebreak-style': ['error', 'unix'],
        'quotes': ['error', 'single'],
        'comma-dangle': ['error', 'always-multiline'],
        '@typescript-eslint/no-unsafe-assignment': ['off'],
        '@typescript-eslint/naming-convention': [
          'error',
          {
            'selector': 'memberLike',
            'modifiers': [
              'private',
            ],
            'format': [
              'camelCase',
            ],
            'leadingUnderscore': 'require',
          },
        ],
        '@typescript-eslint/no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
      },
    },
  ],
};
