const express = require('express');
const { createCourse, getAllCourses } = require('../controllers/CourseController');
const router = express.Router();
const protect = require('../middleware/auth')

router.post('/create-course', protect, createCourse)

router.get('/all-courses', protect, getAllCourses)


module.exports = router