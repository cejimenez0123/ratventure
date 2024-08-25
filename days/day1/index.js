const startPath1 = require("./path1")
const startPath2 = require("./path2")
module.exports  = function startDay1(choiceArray){
    alert("You put poison in the rats drinking water")
    alert("Rats are inebrieted but not inccapacitated")
     if("1" == choiceArray[0]) {
      return  startPath1()
    }else if("2"==choiceArray[0]){
       return startPath2()
    }else{
      alert("Your chief of staff loses his confidence in your ability to make choices. He coups you.")
      alert("You're no longer mayor")
      alert("Congrats Goodbye")
      //
    }
    alert("Game Over")
   
  }