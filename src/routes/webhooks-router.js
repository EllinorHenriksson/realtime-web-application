/**
 * Webhooks routes.
 */

import express from 'express'
import { WebhooksController } from '../controllers/webhooks-controller.js'

export const router = express.Router()

const webhooksController = new WebhooksController()

// Map verbs and routes to controller actions.
router.post('/',
  (req, res, next) => webhooksController.authenticate(req, res, next),
  (req, res, next) => webhooksController.indexPost(req, res, next)
)
