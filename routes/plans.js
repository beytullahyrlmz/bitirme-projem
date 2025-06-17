const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const planController = require('../controllers/planController');

router.get('/', ensureAuthenticated, planController.getAllPlans);
router.get('/new', ensureAuthenticated, planController.getNewPlanForm);
router.post('/', ensureAuthenticated, planController.createPlan);
router.get('/:id/edit', ensureAuthenticated, planController.getEditForm);
router.put('/:id', ensureAuthenticated, planController.updatePlan);
router.delete('/:id', ensureAuthenticated, planController.deletePlan);

module.exports = router;
