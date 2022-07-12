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
}
