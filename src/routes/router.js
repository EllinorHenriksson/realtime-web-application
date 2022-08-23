/**
 * The routes.
 */

import express from 'express'
import { router as homeRouter } from './home-router.js'
import { router as issuesRouter } from './issues-router.js'
import { router as webhooksRouter } from './webhooks-router.js'

export const router = express.Router()

router.use('/', homeRouter)
router.use('/issues', issuesRouter)

router.use('/webhooks', webhooksRouter)

router.use('*', (req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
