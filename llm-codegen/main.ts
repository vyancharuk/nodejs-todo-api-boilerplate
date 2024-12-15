import 'dotenv/config';

import readlineSync from 'readline-sync';

import { Orchestrator } from './core/agents/Orchestrator';
import logger from './core/logger';

const pluralize = require('pluralize');

(async () => {
  // ask user for a description and module name
  let projectDescription = readlineSync.question(
    'Enter the module description: '
  );
  let moduleName = readlineSync.question('Enter the module name: ');

  if (!moduleName) {
    logger.warn('Entered:EMPTY:moduleName');
    return;
  }

  if (!pluralize.isPlural(moduleName)) {
    moduleName = pluralize.plural(moduleName);
  }

  const orchestrator = new Orchestrator(projectDescription, moduleName);
  await orchestrator.execute(projectDescription, moduleName);
})();
