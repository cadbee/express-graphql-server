import {LowSync} from "lowdb";
import {JSONFileSync} from "lowdb/node";
import path from "path";
import {fileURLToPath} from "url";
import lodash from 'lodash';
import layers from "./data/layers.js";
import signs from "./data/signs.js";
import troops from "./data/troops.js";
import * as fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const liveFolderPath = path.join(__dirname, '../../live');
if (!fs.existsSync(liveFolderPath)) {
    fs.mkdirSync(liveFolderPath);
}

const adapter = new JSONFileSync(path.join(__dirname, '../../live/db.json'));

export const db = new LowSync(adapter, {...layers, ...signs, ...troops});
await db.read();
db.chain = lodash.chain(db.data);
db.write();
