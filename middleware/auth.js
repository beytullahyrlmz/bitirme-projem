
module.exports.ensureAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'Lütfen giriş yapınız.');
  res.redirect('/login');
};
