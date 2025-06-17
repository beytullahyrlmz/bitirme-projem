const bcrypt = require('bcrypt');
const User = require('../models/User');
const passport = require('passport');

exports.getRegister = (req, res) => {
  res.render('auth/register', { title: 'Kayıt Ol', messages: req.flash() });
};

exports.postRegister = async (req, res) => {
  const { username, email, password, password2 } = req.body;
  let errors = [];

  if (!username || !email || !password || !password2) {
    errors.push('Lütfen tüm alanları doldurun');
  }
  if (password !== password2) {
    errors.push('Parolalar eşleşmiyor');
  }
  if (password.length < 6) {
    errors.push('Parola en az 6 karakter olmalı');
  }

  if (errors.length > 0) {
    req.flash('error_msg', errors.join(', '));
    return res.redirect('/register');
  }

  try {
    let user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      req.flash('error_msg', 'Bu e-posta adresi zaten kayıtlı');
      return res.redirect('/register');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({
      username,
      email: email.toLowerCase(),
      password: hashedPassword
    });

    await user.save();
    req.flash('success_msg', 'Kayıt başarılı. Giriş yapabilirsiniz.');
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Kayıt sırasında hata oluştu');
    res.redirect('/register');
  }
};

exports.getLogin = (req, res) => {
  res.render('auth/login', { title: 'Giriş Yap', messages: req.flash() });
};

exports.postLogin = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/plans',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
};

exports.logout = (req, res) => {
  req.logout(err => {
    if (err) return next(err);
    req.flash('success_msg', 'Başarıyla çıkış yapıldı');
    res.redirect('/login');
  });
};
