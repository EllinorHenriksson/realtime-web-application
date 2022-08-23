/**
 * Represents a home controller.
 */
export class HomeController {
  /**
   * Renders the view Home.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  index (req, res, next) {
    res.render('home/index')
  }
}
