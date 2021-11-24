import { Router } from 'express';
import * as http from 'http';
import jwtChecker from '../lib/jwt.js';
import Logger from '../lib/logger.js';

const logger = Logger('route/connections');
const router = Router();

/**
 * @swagger
 * /connections:
 *   get:
 *     tags:
 *       - connections
 *     summary: Connections
 *     required: true
 *     parameters:
 *     - in: header
 *       name: x-access-token
 *       type: string
 *       required: true
 *     - in: query
 *       name: from
 *       type: string
 *       examples:
 *         Basel:
 *           value: Basel
 *     - in: query
 *       name: to
 *       type: string
 *       examples:
 *         Lugano:
 *           value: Lugano
 *     responses:
 *       200:
 *         description: Success
 *
 */
router.get('/', jwtChecker, (req, res) => {
  let queryString = '';
  const {
    from, to,
  } = req.query;
  logger.info(`Params from ${from}, to: ${to}`);
  const today = new Date();
  const dd = today.getDate();

  const MM = today.getMonth() + 1;
  const yyyy = today.getFullYear();
  const date = `${yyyy}-${MM}-${dd}`;

  const hh = today.getHours();
  const mm = today.getMinutes();
  const time = `${hh}:${mm}`;

  if (from != null) {
    queryString = `?&from=${from}`;
    queryString += `&to=${to}`;
    queryString += `&date=${date}`;
    queryString += `&time=${time}`;
  }

  http.get(`http://transport.opendata.ch/v1/connections${queryString}`, (resp) => {
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
    res.status(400).send({
      data: 'Bad request',
      status: 'error',
    });
  });
});

export default router;
