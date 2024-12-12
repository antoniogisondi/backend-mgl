const Course = require('../models/Course')
const {updateCourseStatus} = require('./utils')
const cron = require('node-cron')

cron.schedule('0 0 * * *', async () => {
    console.log('Esecuzione del cronjob per aggiornare lo status dei corsi...')
    try {
        const courses = await Course.find()

        for (const course of courses) {
            const newStatus = updateCourseStatus(course)
            course.status = newStatus
            await course.save()
        }
    } catch (error) {
        console.error('Errore durante l\' aggiornamento dello status dei corsi', error)
    }
})

module.exports = cron