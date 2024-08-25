const path4 = require("./path4")
const path5 = require("./path5")
const path1 = require("./path1")
function startDay3(){
    
    if(prevChosenPaths[0]=="1"&&prevChosenPaths[1]=="1"&&prevChosenPaths[2]=="1"){
        //currently Congrats Goodbye needle
    }else if(prevChosenPaths[0]=="1"&&prevChosenPaths[1]=="1"&&prevChosenPaths[2]=="2"){
        //2 good luck good bye needle
    }else if(prevChosenPaths[0]=="1"&&prevChosenPaths[1]=="2"&&prevChosenPaths[2]=="2"){
//3 Currently Good Luck Goodbye needs more Hudson Valley
}else if(prevChosenPaths[0]=="2"&&prevChosenPaths[1]=="1"&&prevChosenPaths[2]=="1"){
    // Good Luck Goodbye gambling
  }else if(prevChosenPaths[0]=="2"&&prevChosenPaths[1]=="1"&&prevChosenPaths[2]=="2"){
            // Good Luck Goodbye gambling
    }else if(prevChosenPaths[0]=="2"&&prevChosenPaths[1]=="2"&&prevChosenPaths[2]=="2"){
        return path4()
    }else if(prevChosenPaths[0]=="2"&&prevChosenPaths[1]=="2"&&prevChosenPaths[2]=="1"){
        return path5()

    }else if(prevChosenPaths[0]=="1"&&prevChosenPaths[1]=="2"&&prevChosenPaths[2]=="1"){
    
        //3 Currently Good Luck Goodbye needs more Hudson Valley
    }else{

    }

    
}