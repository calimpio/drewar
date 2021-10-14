/**
 * Remove old files, copy front-end ones.
 */

import fs from 'fs-extra';
import Logger from 'jet-logger';
import childProcess from 'child_process';
import { remove } from './fnc';

// Setup logger
const logger = new Logger();
logger.timestamp = false;




(async () => {
    try {
        // Remove current build
        await remove('./src/public/dist/');        

    } catch (err) {
        logger.err(err);
    }
})();


