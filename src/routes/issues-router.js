/**
 * Tasks routes.
 */

import express from 'express'
import { IssuesController } from '../controllers/issues-controller.js'

export const router = express.Router()

const controller = new IssuesController()

// OBS! Lägg till routes
router.get('/', (req, res, next) => controller.index(req, res, next))
