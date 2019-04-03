exports.validateSignup = (req, res, next) => {
  req.sanitizeBody('name')
  req.sanitizeBody('email')
  req.sanitizeBody('password')

  req.checkBody('name', 'Enter a name').notEmpty()
  req.checkBody('name', 'Name must be between & and 10 characters')
    .isLength({ min: 4, max: 10 })
  
  req.checkBody('email', 'Enter a valid email')
    .isEmail()
    .normalizeEmail()

  req.checkBody('password', 'Enter a password').notEmpty()
  req.checkBody('password', 'Password must be between & and 10 characters')
    .isLength({ min: 4, max: 10 })

  const errors = req.validationErrors()
  if (errors) {
    const firstErr = errors.map(err => err.msg)[0]
    return res.status(400).send(firstErr)
  }
  next()
}

exports.signup = () => {};

exports.signin = () => {};

exports.signout = () => {};

exports.checkAuth = () => {};
