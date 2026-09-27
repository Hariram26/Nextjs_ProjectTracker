const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const router = express.Router();

// @desc    Generate AI tasks for a project
// @route   POST /api/ai/generate-tasks
// @access  Public
router.post('/generate-tasks', async (req, res) => {
  const { projectName } = req.body;

  if (!projectName) {
    return res.status(400).json({ success: false, error: 'Project name is required' });
  }

  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
    return res.status(500).json({
      success: false,
      error: 'Gemini API key is not configured. Please add GEMINI_API_KEY to your backend .env file.'
    });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });

    const prompt = `You are a project management expert. Generate a detailed, actionable task list for a software project called "${projectName}".

Return ONLY a valid JSON array (no markdown, no explanation) with exactly 8 tasks in this format:
[
  {
    "id": "1",
    "title": "Task title",
    "description": "Short description of the task",
    "priority": "High" | "Medium" | "Low",
    "category": "Planning" | "Design" | "Development" | "Testing" | "Deployment"
  }
]

Make the tasks realistic, specific to the project name, and cover the full project lifecycle.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Extract JSON from the response (strip markdown code blocks if present)
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return res.status(500).json({ success: false, error: 'Failed to parse AI response' });
    }

    const tasks = JSON.parse(jsonMatch[0]);

    res.status(200).json({ success: true, tasks });
  } catch (err) {
    console.error('Gemini API error:', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to generate tasks. Please check your API key.' });
  }
});

module.exports = router;
