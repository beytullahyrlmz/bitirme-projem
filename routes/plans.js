const express = require('express');
const router = express.Router();
const Plan = require('../models/Plan');
const { ensureAuthenticated } = require('../middleware/auth');

// Planları listele
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const plans = await Plan.find({ user: req.user._id }).sort({ startDate: 1 });
    res.render('plans/index', { plans, user: req.user });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

// Yeni plan formu
router.get('/new', ensureAuthenticated, (req, res) => {
  res.render('plans/new', { user: req.user });
});

// Yeni plan oluştur
router.post('/', ensureAuthenticated, async (req, res) => {
  try {
    const { title, destination, accommodation, transport, startDate, endDate, notes } = req.body;
    // stops dizisini düzgün almak için:
    // Eğer formda stops yoksa boş dizi olarak al
    let stops = [];
    if (req.body.stops) {
      // stops objesi formda dizi olarak geliyor
      stops = Array.isArray(req.body.stops)
        ? req.body.stops
        : Object.values(req.body.stops); // Bazı durumlarda obje olabilir
    }

    // stops içindeki her aktivite alanı virgülle ayrılmış string, onu tutuyoruz olduğu gibi
    // (İstersen burada string'i diziye çevirebilirsin, şu an metin olarak saklıyoruz.)

    const newPlan = new Plan({
      user: req.user._id,
      title,
      destination,
      accommodation,
      transport,
      startDate,
      endDate,
      notes,
      stops
    });

    await newPlan.save();
    res.redirect('/plans');
  } catch (err) {
    console.error(err);
    res.redirect('/plans/new');
  }
});

// Plan düzenleme formu
router.get('/:id/edit', ensureAuthenticated, async (req, res) => {
  try {
    const plan = await Plan.findOne({ _id: req.params.id, user: req.user._id });
    if (!plan) return res.redirect('/plans');
    res.render('plans/edit', { plan, user: req.user });
  } catch (err) {
    console.error(err);
    res.redirect('/plans');
  }
});

// Plan güncelle
router.put('/:id', ensureAuthenticated, async (req, res) => {
  try {
    const { title, destination, accommodation, transport, startDate, endDate, notes } = req.body;

    let stops = [];
    if (req.body.stops) {
      stops = Array.isArray(req.body.stops)
        ? req.body.stops
        : Object.values(req.body.stops);
    }

    await Plan.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      {
        title,
        destination,
        accommodation,
        transport,
        startDate,
        endDate,
        notes,
        stops
      }
    );
    res.redirect('/plans');
  } catch (err) {
    console.error(err);
    res.redirect(`/plans/${req.params.id}/edit`);
  }
});

// Plan sil
router.delete('/:id', ensureAuthenticated, async (req, res) => {
  try {
    await Plan.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.redirect('/plans');
  } catch (err) {
    console.error(err);
    res.redirect('/plans');
  }
});

module.exports = router;
