const csv = require("csvtojson")

const extractUtility = async (filename) =>{
    let file = `${__dirname}/${filename}`

    let data = await csv().fromFile(file)
    
    return data

}

const getSubjectData = async (data) =>{

    let subjects = []

    for (let [key, value] of Object.entries(data)) {
        if(key !== "REGISTRATION NUMBER" && key !== "SL. NO." && key !== "GP" && key !== "SGPA" && (key !== "CGPA")){
            let subCode = key.split("-")[0]
            let subName = key.split("-")[1]
            let subCredit = key.split("-")[2]
            let subGrade = value.split("-")[0]
            let subPointer = parseInt(value.split("-")[1].trim())

            subjects.push({subCode, subName, subCredit, subGrade, subPointer})
        }
    }
    // console.log(subjects);
    return subjects
}

const transform = async (data) => {
    
    let subjects = await getSubjectData(data)

    return {
        scholarId : data["REGISTRATION NUMBER"],
        SGPA : parseFloat(data.SGPA.trim()),
        GP : parseInt(data.GP.trim()),
        CGPA : parseFloat(data.CGPA),
        subjects
    }
}

const dataExtraction = async() =>{
    let filename = "res.csv"
    const results = await extractUtility(filename)
    // console.log(result);

    let students = []

    results.forEach(async (result) => {
        let transformedData = await transform(result)
        console.log(transformedData);
        students.push(transformedData)
    })

    console.log(students);



}

dataExtraction()