function updateCourseStatus(course) {
    const today = new Date().setHours(0,0,0,0)
    const isActive = course.durata_corso.some((day) => {
        const courseDate = new Date(day.giorno).setHours(0,0,0,0)
        return courseDate === today
    })

    const isCompleted = course.durata_corso.every((day) => {
        const courseDate = new Date(day.giorno).setHours(0,0,0,0)
        return courseDate < today
    })

    if (isActive) return 'Attivo'
    if (isCompleted) return 'Completato'
    return 'Richiesto'
}

module.exports = {updateCourseStatus}