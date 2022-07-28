import fetch from 'node-fetch'

/**
 * Represents a issues controller.
 */
export class IssuesController {
  /**
   * Takes an issue object and returns an altered copy of it.
   *
   * @param {object} issue - The original issue object.
   * @returns {object} An altrered copy of the issue object.
   */
  #alterIssue (issue) {
    return {
      id: issue.iid,
      author: {
        name: issue.author.name,
        avatar_url: issue.author.avatar_url
      },
      title: issue.title,
      description: issue.description,
      state: issue.state
    }
  }

  /**
   * Displays a list of issues.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async index (req, res, next) {
    try {
      const response = await fetch(process.env.GITLAB_API + '/projects/23288/issues?scope=all&state=opened&per_page=100', {
        headers: {
          'Private-Token': process.env.GITLAB_SECRET
        }
      })

      if (!response.ok) {
        throw new Error('Could not fetch the issue resources from GitLab API. Status: ' + response.status)
      }

      const issues = await response.json()

      const viewData = {
        issues: issues.map(issue => {
          return this.#alterIssue(issue)
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
      const response = await fetch(`${process.env.GITLAB_API}/projects/23288/issues/${req.params.id}`, {
        headers: {
          'Private-Token': process.env.GITLAB_SECRET
        }
      })

      if (!response.ok) {
        if (response.status === 404) {
          const error = new Error('Not Found')
          error.status = 404
          throw error
        } else {
          throw new Error('Failed to load the requested resource from GitLab API. Status: ' + response.status)
        }
      }

      const viewData = this.#alterIssue(await response.json())

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

      const response = await fetch(`${process.env.GITLAB_API}/projects/23288/issues/${req.params.id}`, {
        method: 'PUT',
        body: params,
        headers: {
          'Private-Token': process.env.GITLAB_SECRET
        }
      })

      if (response.ok) {
        req.session.flash = { type: 'success', text: 'The issue was successfully updated!' }
        res.io.emit('issues/update', this.#alterIssue(await response.json()))
      } else {
        if (response.status === 404) {
          req.session.flash = { type: 'error', text: 'Someone deleted the issue you wanted to update.' }
        } else {
          throw new Error()
        }
      }

      res.redirect('..')
    } catch (error) {
      req.session.flash = { type: 'error', text: 'Failed to update the issue, please try again later.' }
      res.redirect('./update')
    }
  }
}
