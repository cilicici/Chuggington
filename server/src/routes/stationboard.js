import { Router } from 'express';
import * as http from 'http';
import jwtChecker from '../lib/jwt.js';
import Logger from '../lib/logger.js';

const logger = Logger('route/stationsboards');
const router = Router();

/**
 * @swagger
 * /stationsboards:
 *   get:
 *     tags:
 *       - stationboards
 *     summary: Connections
 *     required: true
 *     parameters:
 *     - in: header
 *       name: x-access-token
 *       type: string
 *       required: true
 *     - in: query
 *       name: id
 *       type: string
 *       examples:
 *         Zurich Stadelhofen:
 *           value: 8503059
 *     responses:
 *       200:
 *         description: Success
 *
 */
router.get('/', jwtChecker, (req, res) => {
  let queryString = '';
  const {
    id,
  } = req.query;
  logger.info(`Params station ${id}`);
  if (id != null) {
    queryString = `?&id=${id}`;
    queryString += '&limit=10';
  }
  logger.info(`Queryparams: ${queryString}`);
  logger.info(`http://transport.opendata.ch/v1/stationboard${queryString}`);
  http.get(`http://transport.opendata.ch/v1/stationboard${queryString}`, (resp) => {
    let data = '';

    resp.on('data', (chunk) => {
      data += chunk;
    });

    resp.on('end', () => {
      logger.info(data);
      const dataObject = JSON.parse(data);
      return res.status(200).send({
        data: dataObject,
        status: 'success',
      });
    });
  }).on('error', (err) => {
    logger.error(`Error: ${err.message}`);
    return res.status(400).send({
      data: 'Bad request',
      status: 'error',
    });
  });
});

export default router;
