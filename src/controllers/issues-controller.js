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
            author: issue.author.avatar_url,
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
   * Returns a HTML form for updating a task.
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

      console.log(viewData)

      res.render('issues/update', { viewData })
    } catch (error) {
      next(error)
    }
  }
}
