module.exports = (req, res, next) => {
  if (!!req.user.id && req.user.userType === 'admin') {
    //update to include whatever condition is appropriate
    next()
  } else {
    res.status(401).send('not authorized') //updated to send whatever message you want
  }
}
