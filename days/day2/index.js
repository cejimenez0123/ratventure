
const path1 = require("./path1")
const path2 = require("./path2")
const path3 = require("./path3")
const path4 = require("./path4")
module.exports = function startDay2(prevChosenPaths){

    if(prevChosenPaths[0]=="1"&&prevChosenPaths[1]=="1"){
        return path1()
    }else if(prevChosenPaths[0]=="2"&&prevChosenPaths[1]=="1"){

        return path2()
    }else if(prevChosenPaths[0]=="1"&&prevChosenPaths[1]=="2"){
        return path3()

    }else if(prevChosenPaths[0]=="2"&&prevChosenPaths[1]=="2"){
        let ans = path4()
        alert("Community Board:The people are complaining about mocking rats. They just sit near the curb and laugh.")
        return ans
    }else{

    }


}