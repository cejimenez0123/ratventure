

function startDay2(){


    alert("You put poison in the rats drinking water")
    alert("Rats are inebrieted but not inccapacitated")
    let partB = prompt("The rats are laughing,"+
    " move to plan b."+
    " Do you want to (1) give them needles"+
    " for little rat duels or (2) introduce gambling?")
    if(partB == "1"){
      alert("Rats have stopped fighting now that each is deadlier,"+
      " they use needles as walking sticks."+
      " Move up the class ladder of New York."+
      " They are now known as the Ratstors")
      alert("They fund your election and your opponents. That way they always come up on top.")
      alert("You lose elections, it's the way the wind blows. You're no longer mayor")
      alert("Congrats Goodbye")
    }else if(partB=="2"){
      alert("You have introduced gambling."+
      " Got your hands greased,"+
      " and greased some hands and opened a casino "
      +" under the former CVS now McDonalds near Times Square."+
       " The rats are having too much fun. Rat on Rat crime increases. More dead rats but more rats keep coming")
      alert("Spike in crime under your period creates an unprecedented electoral loss for you. Go lick your wounds. Stay away from rats.")
      alert("Good Luck Goodbye")
    }else{
     
        let partC =prompt("The rats are laughing,"
        +" move to plan b."
        +" Do you want to (1) give them needles for little rat duels or"+
        "(2) introduce gambling")
        
      if(partC=="1"){
        alert("You legalized rat dueling."+
        " The rats aren't happy but they aren't unhappy."+
        "There are less rats. You get to be mayor another day")
        alert("Congrats Goodbye")
      }else if(partC=="2"){
        alert("You start rat strike force. Best of the best. In order to catch a rat, you have to think like a rat, so the rat stike force is made of rats.")
        alert("There's a revolution, rat strike force is leading the way to coup you with a rat army.")
       let partD = prompt("Do you (1) exit out the window and glue some hair on your face or (2) hope rats are nice").toLowerCase()
        if(partD=="1"){
          alert("You escape into dead of night."+
          " New York is now New Rat City."+
          " You get to survive and not be the mayor.")
          alert("Congrats Goodbye")
        }else if(partD=="2"){
          alert("The rats see you huddle behind the curtains. They bring you in for trial you plead qualified immunity.")
          alert("Rats say this rat city. No such thing.")
          alert("Good luck with trial. Good Bye")
        }else{
          alert("You fall out the window as the rats try to give you hug. ")
          alert("Goodbye Mayor")
        }
      }else{
        alert("There's a recall election")
        alert("You're no longer mayor")
        alert("Congrats Goodbye")
      }
      
    }
}