import app from './app.js';
import config from './utils/config.js';
import logger from './utils/logger.js';

const Port = config.PORT || 3000;

app.listen(Port, () => {
    logger.info(`Server started at Port ${config.PORT}`);
})