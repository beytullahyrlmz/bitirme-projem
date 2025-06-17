const Plan = require('../models/Plan');

exports.getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.find({ user: req.user._id }).sort({ startDate: 1 });
    res.render('plans/index', { plans, user: req.user });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
};

exports.getNewPlanForm = (req, res) => {
  res.render('plans/new', { user: req.user });
};

exports.createPlan = async (req, res) => {
  try {
    const { title, destination, accommodation, transport, startDate, endDate, notes } = req.body;
    let stops = [];

    if (req.body.stops) {
      stops = Array.isArray(req.body.stops)
        ? req.body.stops
        : Object.values(req.body.stops);
    }

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
};

exports.getEditForm = async (req, res) => {
  try {
    const plan = await Plan.findOne({ _id: req.params.id, user: req.user._id });
    if (!plan) return res.redirect('/plans');
    res.render('plans/edit', { plan, user: req.user });
  } catch (err) {
    console.error(err);
    res.redirect('/plans');
  }
};

exports.updatePlan = async (req, res) => {
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
};

exports.deletePlan = async (req, res) => {
  try {
    await Plan.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.redirect('/plans');
  } catch (err) {
    console.error(err);
    res.redirect('/plans');
  }
};
