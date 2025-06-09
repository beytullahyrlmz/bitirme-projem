const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const flash = require('express-flash');
const methodOverride = require('method-override');
const path = require('path');

const authRoutes = require('./routes/auth');
const planRoutes = require('./routes/plans');
const { ensureAuthenticated } = require('./middleware/auth');
require('./passport-config')(passport);

const app = express();

// MongoDB bağlantısı
mongoose.connect('mongodb://localhost:27017/travel_planner', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB bağlantısı başarılı');
}).catch(err => {
  console.error('MongoDB bağlantı hatası:', err);
});

// View engine ve statik dosyalar
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Session, Passport, Flash
app.use(session({
  secret: 'secret',  // bunu .env dosyasından yönetmeni öneririm
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// --- Buraya eklenen middleware ---
// Tüm viewlarda user ve messages değişkenlerini kullanılabilir yapar
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.messages = req.flash();
  next();
});
// -------------------------------

// HTTP method override (PUT, DELETE için)
app.use(methodOverride('_method'));

// Rotalar
app.use('/', authRoutes);
app.use('/plans', planRoutes);

// Ana sayfa
app.get('/', (req, res) => {
  res.render('index', { title: 'Ana Sayfa' }); // user ve messages artık res.locals üzerinden geliyor
});

// Sunucu başlat
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
});
