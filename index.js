const startDay1 = require("./days/day1")
const startDay2 = require("./days/day2")
function startYourJourney() {
    alert("You're the mayor of New York City." 
    +" City in crisis due to giant rats powered by radioactive diamond dust and lost their sense of danger."
    +" What will you do? Here comes your chief of staff")
    let choiceArray = []
    const choice0 = prompt("Do you want to (1) poison the rats or give them (2) pizza?")
    choiceArray.concat(choice0)
    const chosen1 = startDay1(choiceArray)
    choiceArray.concat(chosen1)
    const chosen2 = startDay2(choiceArray)
    const chosen3 = startDay3(chosen2)
    alert("Game Over")
  }