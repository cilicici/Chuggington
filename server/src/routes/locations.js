import { Router } from 'express';
import * as http from 'http';
import jwtChecker from '../lib/jwt.js';
import Logger from '../lib/logger.js';

const logger = Logger('route/locations');
const router = Router();

/**
 * @swagger
 * /locations:
 *   get:
 *     tags:
 *       - locations
 *     summary: Get locations
 *     required: true
 *     parameters:
 *     - in: header
 *       name: x-access-token
 *       type: string
 *       required: true
 *     - in: query
 *       name: query
 *       type: string
 *       examples:
 *         Basel:
 *           value: Basel
 *     - in: query
 *       name: type
 *       type: string
 *       examples:
 *         station:
 *           value: station
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Missing inputs
*/
router.get('/', jwtChecker, (req, res) => {
  let queryString = '';
  const {
    query, type,
  } = req.query;
  logger.info(`Params query ${query}, type: ${type}`);
  if (query != null) {
    queryString = `?&query=${query}`;
    queryString += `&type=${type}`;
  }
  logger.info(`Queryparams: ${queryString}`);
  http.get(`http://transport.opendata.ch/v1/locations${queryString}`, (resp) => {
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
