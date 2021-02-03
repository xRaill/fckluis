import dotenv from 'dotenv';
dotenv.config();

import { seeds } from './umzug';

if (process.argv.includes('create')) process.argv.push('--skip-verify');

seeds.runAsCLI();
