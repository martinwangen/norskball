// see https://the-guild.dev/graphql/codegen/docs/guides/react-vue for instructions on how to work with graphQL.

// yarn graphql-codegen --watch
import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
    schema: '../schema.graphql',
    documents: ['src/**/*.vue', 'src/gql/fragments.ts', 'src/gql/fragments.mutation.ts', 'src/gql/queries.ts', 'src/gql/mutations.ts'],
    // pluckConfig: { //This shouldn't be necessary.
    //     globalGqlIdentifierName: ['gql', 'graphql']
    // },
    ignoreNoDocuments: true, // for better experience with the watcher
    generates: {
        './src/gql/__generated__/': {
            preset: 'client',
            config: {
                useTypeImports: true,
                fragmentMasking: false
            }
        }
    }
}

export default config
