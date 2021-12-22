class RequestError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
  }

  static NotFoundError(message) {
    return new RequestError(message, 404)
  }

  static InternalServerError(message) {
    return new RequestError(message, 500)
  }

  static BadRequestError(message) {
    return new RequestError(message, 400)
  }

  static SendError(error, res) {
    res.status(error.statusCode || 500).send({
      message: error.message || 'Internal server error'
    })
  }
}

module.exports = RequestError
