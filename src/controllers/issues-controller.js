import fetch from 'node-fetch'

/**
 * Represents a issues controller.
 */
export class IssuesController {
  /**
   * Displays a list of issues.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async index (req, res, next) {
    try {
      const response = await fetch(process.env.GITLAB_API + '/issues?scope=all&state=opened', {
        headers: {
          'Private-Token': process.env.GITLAB_SECRET
        }
      })

      const data = await response.json()

      const viewData = {
        issues: data.map(issue => {
          return {
            id: issue.iid,
            author: {
              name: issue.author.name,
              avatar_url: issue.author.avatar_url
            },
            title: issue.title,
            description: issue.description
          }
        })
      }

      res.render('issues/index', { viewData })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Returns a HTML form for updating an issue.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async update (req, res, next) {
    try {
      const response = await fetch(`${process.env.GITLAB_API}/issues/${req.params.id}`, {
        headers: {
          'Private-Token': process.env.GITLAB_SECRET
        }
      })

      if (!response.ok) {
        if (response.status === 404) {
          req.session.flash = { type: 'danger', text: 'Someone deleted the issue you wanted to update.' }
          res.redirect('..')
        } else {
          throw new Error('Failed to load the requested resource from GitLab API.')
        }
      }

      const data = await response.json()

      const viewData = {
        id: data.iid,
        title: data.title,
        description: data.description,
        state: data.state
      }

      res.render('issues/update', { viewData })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Updates a specific issue.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async updatePost (req, res) {
    try {
      const params = new URLSearchParams()
      params.append('title', req.body.title)
      params.append('description', req.body.description)
      params.append('state_event', req.body.closed ? 'close' : 'reopen')

      const response = await fetch(`${process.env.GITLAB_API}/issues/${req.params.id}`, {
        method: 'PUT',
        body: params,
        headers: {
          'Private-Token': process.env.GITLAB_SECRET
        }
      })

      if (response.ok) {
        req.session.flash = { type: 'success', text: 'The issue was successfully updated!' }
      } else {
        if (response.status === 404) {
          req.session.flash = { type: 'danger', text: 'Someone deleted the issue you wanted to update.' }
        } else {
          throw new Error()
        }
      }

      res.redirect('..')
    } catch (error) {
      req.session.flash = { type: 'danger', text: 'Failed to update the issue, please try again later.' }
      res.redirect('./update')
    }
  }
}
