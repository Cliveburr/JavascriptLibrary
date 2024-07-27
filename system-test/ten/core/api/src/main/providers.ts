import * as fs from 'fs';
import { Connection } from '@ten/framework_business';
import { DefinedProvider } from 'providerjs';


const connectionStringsJson = JSON.parse(fs.readFileSync(__dirname + '\\..\\..\\src\\connectionStrings.json', 'utf8'));
export var ConnectionStringProvider = new DefinedProvider(Connection, new Connection(connectionStringsJson));

export const MAIN_PROVIDERS = [
    ConnectionStringProvider
]