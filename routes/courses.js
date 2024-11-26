const express = require('express');
const {
    createCourse,
    getAllCourses,
    getCourseDetails,
    UpdateCourse,
} = require('../controllers/CourseController');
const router = express.Router();
const protect = require('../middleware/auth');

// Rotte del corso
router.post('/create-course', protect, createCourse);
router.get('/all-courses', protect, getAllCourses);
router.get('/:id', protect, getCourseDetails);
router.put('/:id/modifica', protect, UpdateCourse);

module.exports = router;
