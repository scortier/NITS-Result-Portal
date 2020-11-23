const User = require('../models/User')
const Result = require('../models/result')
module.exports = forStudent = async (student, branch, sem, year) => {
    try {
        console.log("Processing sch iD:", student.scholarId);
        let sch_id = parseInt(student.scholarId)
        console.log("PArsed id", sch_id);
        let studentAlreadyExists = await User.findOne({ sch_id })
        if (studentAlreadyExists) {
            console.log("User already exists");
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
            // console.log(result);
            await studentAlreadyExists.update({
                cgpa: student.CGPA,
            })
        } else {
            console.log("User does not exists");
            console.log("Processing sch iD:", student.scholarId);
            var newUser = new User({
                sch_id,
                name: sch_id.toString(),
                password: sch_id.toString(),
                cgpa: student.CGPA,
            })
            let user = await newUser.save()

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
        console.log('Result Updated for sch id:', student.scholarId)
    } catch (error) {
        console.log(error)
    }
}
