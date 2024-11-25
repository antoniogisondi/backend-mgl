const express = require('express');
const { createCourse, getAllCourses, getCourseDetails } = require('../controllers/CourseController');
const router = express.Router();
const protect = require('../middleware/auth')

router.post('/create-course', protect, createCourse)

router.get('/all-courses', protect, getAllCourses)

router.get('/:id', protect, getCourseDetails)


module.exports = router