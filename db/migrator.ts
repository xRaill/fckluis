import dotenv from 'dotenv';
dotenv.config();

import { migrations } from './umzug';

if (process.argv.includes('create')) process.argv.push('--skip-verify');

migrations.runAsCLI();
