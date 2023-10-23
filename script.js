

function startYourJourney() {
    alert("You're the mayor of new york the city is in crisis do giant rats powered by diamond dust, what will you do? Here comes your chief of staff")
    let partA = ratPoisonPizza().toLowerCase()
    if(partA == "a") {
      alert("You put poison in the rats drinking water")
      alert("Rats are inebrieted but not inccapacitated")
      let partB = ratNeedleLaughing().toLowerCase()
      if(partB == "a"){
        alert("Rats have stopped fighting now that each is deadlier, they use needles as walking sticks. Move up the class ladder of New York. They are now known as the Ratstors")
        alert("They fund your election and your opponents. That way they always come up on top.")
        alert("You lose elections, it's the way the wind blows. You're no longer mayor")
        alert("Congrats Goodbye")
      }else if(partB=="b"){
        alert("You have introduced gambling. Opened a casino in Times Square underground. The rats are having too much fun. Rat on Rat crime increases. More dead rats but more rats keep coming")
        alert("Spike in crime under your period creates an unprecedented loss for you. Go lick your wounds. Stay away from rats.")
        alert("Good Luck Goodbye")
      }else{
          let partC =ratNeedleGambling().toLowerCase()
        if(partC=="a"){
          alert("You legalized rat dueling. The rats aren't happy but they aren't unhappy. There are less rats. You get to be mayor another day")
          alert("Congrats Goodbye")
        }else if(partC=="b"){
          alert("You start rat strike force. Best of the best. In order to catch a rat, you have to think like a rat, so the rat stike force is made of rats.")
          alert("There's a revolution, rat strike force is leading the way to coup you with a rat army.")
         let partD = prompt("Do you (a)exit out the window and glue some hair on your face or (b)hope rats are nice").toLowerCase()
          if(partD=="a"){
            alert("You escape into dead of night. New York is now a New Rat City. You get to survive and not be mayor")
            alert("Congrats Goodbye")
          }else if(partD=="b"){
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
    }else if(partA=="b"){
      alert("You give the rats pizza, rats have regaular pizza. Rats are in public less and are eating more pizza at home.")
         let partC = ratHudsonNoodles()
          if(partC=="a"){
            alert("Rats have moved to Hudson Valley. They make a town call Ratsville. They are happy with their pizza. You mayor get to bee mayor another day.")
            alert("Congrats Goodbye")
          }else if(partC=="b"){
            alert("Rats have been given cup noodles. The concetrartion of sodium in the cups is too much for rats. Population decimated by hyper tension. You get to be mayor another day")
            alert("Congrats Goodbye")
          }else{
            alert("Rats kept eating pizza. They start pizza delivery company. The fund your opponeent and you in the next election. They go nowhere and become the new Dutch of New York. Good luck ")
          }
    }else{
      alert("Your chief of staff loses his confidence in your ability to make choices. He coups you.")
      alert("You're no longer mayor")
      alert("Congrats Goodbye")
    }
  
  }
  
  function ratPoisonPizza(){
  return prompt("Do you want to (a)poison the rats or give them (b)pizza")
  
  }
  function ratNeedleLaughing(){
  return prompt("The rats are laughing, move to plan b. Do you want to (a)give them needles for little rat duels or (b) introduce gambling")
  
  }
  
  function ratHudsonNoodles(){
    return prompt("You move to next phase of Ratmeggedon, will you (a) lure the rats outside new york to the Hudson Valley or (b) give them cup noodles")
  }
  function ratNeedleGambling(){
    return prompt("You have given the rats needles, and they discovered gambling scraps by betting on duels. There is now black market gambing. Tax coffers do not go up. Option (a) legalize rat dueling or (b) create rat strike force")
  }