import fetch from 'node-fetch'

/**
 * Represents a webhooks controller.
 */
export class WebhooksController {
  /**
   * Authenticates the webhook.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  authenticate (req, res, next) {
    if (req.headers['x-gitlab-token'] !== process.env.WEBHOOK_SECRET) {
      const error = new Error('Invalid token')
      error.status = 401
      next(error)
      return
    }

    next()
  }

  /**
   * Receives a webhook, and creates a new task.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async indexPost (req, res, next) {
    try {
      const gitlabEvent = req.body

      res.status(200).end()

      if (gitlabEvent.event_type === 'issue') {
        const response = await fetch(`${process.env.GITLAB_API}/users/${gitlabEvent.object_attributes.author_id}`, {
          headers: {
            'Private-Token': process.env.GITLAB_SECRET
          }
        })

        if (!response.ok) {
          const error = new Error('Could not fetch the user resource from GitLab API.')
          error.status = response.status
          throw error
        }

        const user = await response.json()

        const issue = {
          id: gitlabEvent.object_attributes.iid,
          author: {
            name: user.name,
            avatar_url: user.avatar_url
          },
          title: gitlabEvent.object_attributes.title,
          description: gitlabEvent.object_attributes.description,
          state: gitlabEvent.object_attributes.state
        }

        res.io.emit('issues/update', issue)
      }
    } catch (error) {
      console.error(error)
    }
  }
}
