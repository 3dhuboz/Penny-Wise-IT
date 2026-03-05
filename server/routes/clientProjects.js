const express = require('express');
const ClientProject = require('../models/ClientProject');
const User = require('../models/User');
const AppDefinition = require('../models/AppDefinition');
const AppSubscription = require('../models/AppSubscription');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Default checklist for new projects
const DEFAULT_CHECKLIST = [
  { step: 'Create customer account in Admin → Customers', completed: false },
  { step: 'Issue app licenses (Admin → Customers → Issue License)', completed: false },
  { step: 'Create new Render Web Service from same GitHub repo', completed: false },
  { step: 'Configure Render env vars (MONGODB_URI, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD, etc.)', completed: false },
  { step: 'Create separate MongoDB database/cluster for client', completed: false },
  { step: 'Set client custom domain on Render (if applicable)', completed: false },
  { step: 'Configure white-label branding (logo, colors, name)', completed: false },
  { step: 'Test client login and app functionality', completed: false },
  { step: 'Send client their login credentials', completed: false },
  { step: 'Create initial invoice via Square', completed: false }
];

// Default env vars to track
const DEFAULT_ENV_VARS = [
  { key: 'NODE_ENV', description: 'Set to production', isSet: false },
  { key: 'MONGODB_URI', description: 'Client-specific MongoDB connection string', isSet: false },
  { key: 'JWT_SECRET', description: 'Unique JWT secret for this deployment', isSet: false },
  { key: 'ADMIN_EMAIL', description: 'Client admin email', isSet: false },
  { key: 'ADMIN_PASSWORD', description: 'Client admin password', isSet: false },
  { key: 'GEMINI_API_KEY', description: 'Admin-managed Gemini AI key', isSet: false },
  { key: 'RUNWAY_API_KEY', description: 'Admin-managed Runway ML key (if video features)', isSet: false },
  { key: 'GOOGLE_CLIENT_ID', description: 'Google OAuth client ID (if Google login)', isSet: false },
  { key: 'SQUARE_ACCESS_TOKEN', description: 'Square payments token', isSet: false },
  { key: 'SQUARE_LOCATION_ID', description: 'Square location ID', isSet: false }
];

// GET all client projects (admin only)
router.get('/', auth, adminOnly, async (req, res) => {
  try {
    const projects = await ClientProject.find()
      .populate('client', 'firstName lastName email company')
      .populate('apps.subscription')
      .sort({ updatedAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load projects', error: err.message });
  }
});

// GET single project
router.get('/:id', auth, adminOnly, async (req, res) => {
  try {
    const project = await ClientProject.findById(req.params.id)
      .populate('client', 'firstName lastName email company phone')
      .populate('apps.subscription');
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load project', error: err.message });
  }
});

// GET project stats (admin only)
router.get('/stats/summary', auth, adminOnly, async (req, res) => {
  try {
    const total = await ClientProject.countDocuments();
    const active = await ClientProject.countDocuments({ status: 'active' });
    const setup = await ClientProject.countDocuments({ status: 'setup' });
    const live = await ClientProject.countDocuments({ 'deployment.deployStatus': 'live' });
    const projects = await ClientProject.find({ status: { $in: ['active', 'setup'] } });
    const totalRevenue = projects.reduce((sum, p) => sum + (p.monthlyRevenue || 0), 0);
    res.json({ total, active, setup, live, totalMonthlyRevenue: totalRevenue });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load stats', error: err.message });
  }
});

// CREATE new project
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const { clientId, projectName, businessName, contactName, contactEmail, contactPhone, appSlugs, notes } = req.body;

    // Verify client exists
    const client = await User.findById(clientId);
    if (!client) return res.status(400).json({ message: 'Customer not found' });

    // Build apps array from slugs
    const apps = [];
    if (appSlugs && appSlugs.length > 0) {
      for (const slug of appSlugs) {
        const appDef = await AppDefinition.findOne({ slug });
        if (appDef) {
          // Check if subscription exists
          const sub = await AppSubscription.findOne({ user: clientId, app: appDef._id, status: 'active' });
          apps.push({
            slug: appDef.slug,
            name: appDef.name,
            subscription: sub?._id || null,
            planKey: sub?.planKey || ''
          });
        }
      }
    }

    const project = new ClientProject({
      client: clientId,
      projectName,
      businessName: businessName || client.company || '',
      contactName: contactName || `${client.firstName} ${client.lastName}`,
      contactEmail: contactEmail || client.email,
      contactPhone: contactPhone || client.phone || '',
      apps,
      setupChecklist: DEFAULT_CHECKLIST.map(s => ({ ...s })),
      envVars: DEFAULT_ENV_VARS.map(v => ({ ...v })),
      notes: notes || ''
    });

    await project.save();
    const populated = await ClientProject.findById(project._id)
      .populate('client', 'firstName lastName email company');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create project', error: err.message });
  }
});

// UPDATE project
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const project = await ClientProject.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    // Update allowed fields
    const allowedFields = [
      'projectName', 'businessName', 'contactName', 'contactEmail', 'contactPhone',
      'deployment', 'whiteLabel', 'notes', 'status', 'monthlyRevenue', 'apps', 'envVars'
    ];
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        project[field] = req.body[field];
      }
    }

    await project.save();
    const populated = await ClientProject.findById(project._id)
      .populate('client', 'firstName lastName email company');
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update project', error: err.message });
  }
});

// UPDATE checklist item
router.put('/:id/checklist/:stepIndex', auth, adminOnly, async (req, res) => {
  try {
    const project = await ClientProject.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    const idx = parseInt(req.params.stepIndex);
    if (idx < 0 || idx >= project.setupChecklist.length) {
      return res.status(400).json({ message: 'Invalid step index' });
    }
    project.setupChecklist[idx].completed = req.body.completed;
    project.setupChecklist[idx].completedAt = req.body.completed ? new Date() : null;
    if (req.body.notes !== undefined) project.setupChecklist[idx].notes = req.body.notes;

    // Auto-update status: if all checklist items done → active
    const allDone = project.setupChecklist.every(s => s.completed);
    if (allDone && project.status === 'setup') {
      project.status = 'active';
    }

    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update checklist', error: err.message });
  }
});

// DELETE project
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    await ClientProject.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete project', error: err.message });
  }
});

module.exports = router;
