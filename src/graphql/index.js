import { loadSchemaSync } from '@graphql-tools/load'
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { addResolversToSchema } from '@graphql-tools/schema'
import resolvers from "./resolvers.js";

import {fileURLToPath} from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const schema = loadSchemaSync(path.join(__dirname, 'schema.graphql'), { loaders: [new GraphQLFileLoader()] })

export const schemaWithResolvers = addResolversToSchema({ schema, resolvers })
