import logger from 'jet-logger';

import ENV from '@src/common/constants/ENV';
import server from './server';
import { connecterBD } from '@src/bd';


/******************************************************************************
                                Constants
******************************************************************************/

const SERVER_START_MSG = (
  'Express server started on port: ' + ENV.Port.toString()
);


/******************************************************************************
                                  Run
******************************************************************************/

// Start the server
const démarrerServeur = async () => {
  await connecterBD();
  server.listen(ENV.Port, (err?: Error) => {
    if (err) {
      logger.err(err.message);
    } else {
      logger.info(`Serveur lancé sur http://localhost:${ENV.Port}`);
    }
  });
};

démarrerServeur();
