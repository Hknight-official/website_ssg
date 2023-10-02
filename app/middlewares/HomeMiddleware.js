module.exports = (req, res, next) => {
    console.log('Time: ', process.env.JWT_SECRET)
    next()
}