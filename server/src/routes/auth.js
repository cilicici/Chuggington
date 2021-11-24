import { Router } from 'express';
import bcryptjs from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import Logger from '../lib/logger.js';
import { findUser, addUser } from '../model/user.js';
import { TOKEN_KEY } from '../lib/jwt.js';

const logger = Logger('route/auth');
const router = Router();
const { sign } = jsonwebtoken;

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags:
 *       - auth
 *     summary: Register new user
 *     requestBody:
 *       description: Register new user for using app
 *       required: true
 *       content:
 *         'application/json':
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *                password:
 *                  type: string
 *                name:
 *                  type: string
 *            examples:
 *              fake user:
 *                value: {"email": "test@test.com", password: "pass", name: "foo"}
 *     responses:
 *       201:
 *         description: Success
 *         content:
 *           'application/json':
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     token:
 *                       type: string
 *                 status:
 *                   type: string
 *       400:
 *         description: Missing inputs
 *         content:
 *           'application/json':
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: string
 *                 status:
 *                   type: string
 *       401:
 *         description: Already register
 *         content:
 *           'application/json':
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: string
 *                 status:
 *                   type: string
 */
router.post('/register', async (req, res) => {
  try {
    const {
      email, password, name,
    } = req.body;
    logger.info(`Start creating user with mail: ${email}`);
    logger.info(`Start creating user with req.body: ${JSON.stringify(req.body)}`);

    if (!(email && password && name)) {
      logger.info(`Missing params email ${email}`);
      return res.status(400).send({
        data: 'All input is required',
        status: 'error',
      });
    }

    const oldUser = await findUser(email);
    logger.info(`Old user: ${oldUser}`);
    logger.info(oldUser);

    if (oldUser) {
      return res.status(403).send({
        data: 'User Already Exist. Please Login',
        status: 'error',
      });
    }

    const encryptedPassword = await bcryptjs.hash(password, 10);

    addUser(
      email.toLowerCase(),
      encryptedPassword,
      name,
    );

    const token = sign(
      { email },
      TOKEN_KEY,
      {
        expiresIn: '2h',
      },
    );

    const tokenObject = { token, name };
    return res.status(201).json({
      data: tokenObject,
      status: 'success',
    });
  } catch (err) {
    logger.error(err);
    return res.status(400).send({
      data: 'Bad request',
      status: 'error',
    });
  }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - auth
 *     summary: Login
 *     requestBody:
 *       description: Login with register user
 *       required: true
 *       content:
 *         'application/json':
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *                password:
 *                  type: string
 *            examples:
 *              fake user:
 *                value: {"email": "test@test.com", password: "pass"}
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           'application/json':
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     token:
 *                       type: string
 *                 status:
 *                   type: string
 *       400:
 *         description: Missing inputs
 *         content:
 *           'application/json':
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: string
 *                 status:
 *                   type: string
 *       401:
 *         description: Already register
 *         content:
 *           'application/json':
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: string
 *                 status:
 *                   type: string
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    logger.info('New login');

    if (!(email && password)) {
      logger.info('Missing parameters');
      return res.status(400).send({
        data: 'All input is required',
        status: 'error',
      });
    }
    const user = findUser(email);
    logger.info(`Find user ${JSON.stringify(user)}`);

    if (user && (await bcryptjs.compare(password, user.password))) {
      logger.info('Password match');
      const token = sign(
        { email },
        TOKEN_KEY,
        {
          expiresIn: '2h',
        },
      );
      const response = {
        data: {
          name: user.name,
          token,
        },
        status: 'success',
      };
      logger.info('asd');
      logger.info(JSON.stringify(response));
      return res.status(200).send(response);
    }
    logger.info('Password not match');
    return res.status(401).send({
      data: 'Invalid Credentials',
      status: 'error',
    });
  } catch (err) {
    logger.error(err);
    return res.status(400).send({
      data: 'Bad request',
      status: 'error',
    });
  }
});

export default router;
