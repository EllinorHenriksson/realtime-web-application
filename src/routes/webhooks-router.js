/**
 * Webhooks routes.
 */

import express from 'express'
import { WebhooksController } from '../controllers/webhooks-controller.js'

export const router = express.Router()

const webhooksController = new WebhooksController()

// OBS! Lägg till routes.
