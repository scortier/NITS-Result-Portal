const User = require('../models/User')
const Result = require('../models/result')
module.exports = forStudent = async (student, branch, sem, year) => {
    try {
        let sch_id = parseInt(student.scholarId)
        let studentAlreadyExists = await User.findOne({ sch_id })
        if (studentAlreadyExists) {
            let result = new Result({
                branch,
                semester: sem,
                year,
                student: studentAlreadyExists._id,
                subjects: student.subjects,
                gp: student.GP,
                sgpa: student.SGPA,
            })
            await result.save()
            await studentAlreadyExists.update({
                cgpa: student.CGPA,
            })
        } else {
            var newUser = {
                sch_id,
                name: student.scholarID,
                password: student.scholarID,
                cgpa: student.CGPA,
            }
            let user
            User.create(newUser, (err, newlycreated) => {
                if (err) console.log(err)
                else user = newlycreated
            })

            let result = new Result({
                branch,
                semester: sem,
                year,
                student: user._id,
                subjects: student.subjects,
                gp: student.GP,
                sgpa: student.SGPA,
            })

            await result.save()
        }
        console.log('Result Updated for sch id:', student, scholarId)
    } catch (error) {
        console.log(error)
    }
}
