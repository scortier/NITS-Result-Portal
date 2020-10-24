const User = "../models/User"

exports.login = async(req, res, next) => {
    try {
        error = new Error("[RouteNotImplemented]: Login")
        error.statusCode=404
        throw error   
    } catch (error) {
        next(error)
    }
}

exports.register = async (req, res, next) => {
    try {
        error = new Error("[RouteNotImplemented]: Register")
        error.statusCode=404
        throw error
    } catch (error) {
        next(error)
    }
}
