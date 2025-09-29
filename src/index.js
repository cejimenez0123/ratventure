import "./style.css";
import ReactGA from "react-ga4";
import myImage from './assets/images/fancy_rat.png'; 
import StoryTree from "./models/StoryTree";
import { v4 as uuidv4 } from 'uuid';
import { getCookie, setCookie } from "./cookie";
const btn = document.getElementById("btn");
const imgElement = document.getElementById("rat");
if (imgElement) {
  imgElement.src = myImage;
}
if(btn){
  console.log("Button found, adding event listener.");
btn.addEventListener("click", startYourJourney);
}



function startYourJourney() {
  const story = new StoryTree();
  story.insertStory();

  // Initialize user cookie
  if (!getCookie('user_id')) {
    const userId = 'user_' + uuidv4();
    setCookie('user_id', userId, 365);
  }

  ReactGA.event({
    category: "Start",
    action: "Start Your Journey",
    label: getCookie("user_id"), 
    nonInteraction: false, 
  });

  // --- NEW SCORING SYSTEM ---
  let scores = {
    ratAffinity: 0,
    approvalRating: 50, // start neutral
    chaosIndex: 0
  };

  story.traverseAndPlay(scores, (finalScores) => {
    // --- ENDING LOGIC ---
    let ending = "";

    if (finalScores.ratAffinity > 5 && finalScores.approvalRating > 60 && finalScores.chaosIndex < 8) {
      ending = `
      🏆 Reelected Mayor!
      Rats and humans alike cheer your weird leadership.
      Final Line: "The pizza rat is dead. Long live the pizza mayor."
      `;
    } 
    else if (finalScores.chaosIndex >= 10 || finalScores.approvalRating <= 20) {
      ending = `
      💀 You were Coupled!
      A rogue faction (rats? pigeons? theatre kids?) storms City Hall.
      Final Line: "The mayor was unavailable for comment. They're currently in a bodega freezer."
      `;
    } 
    else {
      ending = `
      ❌ You Lost the Election.
      New Yorkers voted for vibes instead of policies.
      Final Line: "The new mayor is an animatronic Elmo with a Bloomberg accent."
      `;
    }

    alert(ending);

    ReactGA.event({
      category: "Ending",
      action: ending,
      label: getCookie("user_id"),
      nonInteraction: false,
    });
  });
}


export default startYourJourney;

// import "./style.css"
// import ReactGA from "react-ga4";
// import myImage from './assets/images/fancy_rat.png'; // Adjust the path as necessary
// import StoryTree from "./models/StoryTree";
// import { v4 as uuidv4 } from 'uuid';
// import { getCookie,setCookie ,clearCookie} from "./cookie";
// const imgElement = document.getElementById("rat");
// imgElement.src = myImage;
// function startYourJourney() {
//   const story = new StoryTree()
//   story.insertStory()
//   if (!getCookie('user_id')) {

//     const userId = 'user_' + uuidv4();
//     setCookie('user_id', userId, 365);
//   }
// ReactGA.event({
//   category: "Start",
//   action: "Start Your Journey",
//   label: getCookie("user_id"), 
//   nonInteraction: false, 
// });
// story.traverseAndPlay()
    
//  alert("You give the rats pizza,"
    //     +"rats have pizza regaularly."+
    //     "Rats are in public less and are eating more pizza at home.")
    //     alert("Day 2")
    //     const hudsonValleyOrCupNoodles = prompt("You move to next"+
    //     "phase of Ratmeggedon, will you (1) lure the rats outside"+
    //     " the city to the Long Island or (2) give them cup noodles?"+
    //     " or IDK")
         
    // let begin = prompt("Do you want to (1) poison the rats or give them (2) pizza?")
    // let poisonOrPizza = PoisonOrPizza(begin)
    // if(poisonOrPizza == "1") {
    //     // poisonPath()
    //   alert("You put poison in the rats drinking water")
    //   alert("Rats are inebrieted but not inccapacitated")
    //   alert("Day 2")
    //   let partB = prompt("The rats are laughing,"+
    //   " move to plan b."+
    //   " Do you want to (1) give them needles"+
    //   " for little rat duels or (2) introduce gambling?")
    //   if(partB == "1"){
    //     alert("Rats have stopped fighting now that each is deadlier,"+
    //     " they use needles as walking sticks."+
    //     " Move up the class ladder of New York."+
    //     " They are now known as the Ratstors")
    //     alert("They fund your election and your opponents. That way they always come up on top.")
    //     alert("You lose elections, it's the way the wind blows. You're no longer mayor")
    //     alert("Congrats Goodbye")
    //   }else if(partB=="2"){
    //     alert("You have introduced gambling."+
    //     " Got your hands greased,"+
    //     " and greased some hands and opened a casino "
    //     +" under the former CVS now McDonalds near Times Square."+
    //      " The rats are having too much fun. Rat on Rat crime increases. More dead rats but more rats keep coming")
    //     alert("Spike in crime under your period creates an unprecedented electoral loss for you. Go lick your wounds. Stay away from rats.")
    //     alert("Good Luck Goodbye")
    //   }else{
       
    //       let partC =prompt("The rats are laughing,"
    //       +" move to plan b."
    //       +" Do you want to (1) give them needles for little rat duels or"+
    //       "(2) introduce gambling")
          
    //     if(partC=="1"){
    //       alert("You legalized rat dueling."+
    //       " The rats aren't happy but they aren't unhappy."+
    //       "There are less rats. You get to be mayor another day")
    //       alert("Congrats Goodbye")
    //     }else if(partC=="2"){
    //       alert("You start rat strike force. Best of the best. In order to catch a rat, you have to think like a rat, so the rat stike force is made of rats.")
    //       alert("There's a revolution, rat strike force is leading the way to coup you with a rat army.")
    //      let partD = prompt("Do you (1) exit out the window and glue some hair on your face or (2) hope rats are nice").toLowerCase()
    //       if(partD=="1"){
    //         alert("You escape into dead of night."+
    //         " New York is now New Rat City."+
    //         " You get to survive and not be the mayor.")
    //         alert("Congrats Goodbye")
    //       }else if(partD=="2"){
    //         alert("The rats see you huddle behind the curtains. They bring you in for trial you plead qualified immunity.")
    //         alert("Rats say this rat city. No such thing.")
    //         alert("Good luck with trial. Good Bye")
    //       }else{
    //         alert("You fall out the window as the rats try to give you hug. ")
    //         alert("Goodbye Mayor")
    //       }
    //     }else{
    //       alert("There's a recall election")
    //       alert("You're no longer mayor")
    //       alert("Congrats Goodbye")
    //     }
        
    //   }
    // }else if(poisonOrPizza=="2"){
    //     alert("You give the rats pizza,"
    //     +"rats have pizza regaularly."+
    //     "Rats are in public less and are eating more pizza at home.")
    //     alert("Day 2")
    //     const hudsonValleyOrCupNoodles = prompt("You move to next"+
    //     "phase of Ratmeggedon, will you (1) lure the rats outside"+
    //     " the city to the Long Island or (2) give them cup noodles?"+
    //     " or IDK")
         
         
    //      if(hudsonValleyOrCupNoodles =="1"){
    //         alert("Rats have moved to Long Island."+
    //         " They make a town call Ratsville."+
    //         " They are happy with their pizza.")
    //         alert("Day 3")
    //         alert("Rats pick up terrible habits like aderral"+
    //         "and then more expensive pizza.")
    //         alert("City Budget did not account for rat taste"+
    //           "they want aged prociutto"
    //         )
    //         const buyAgedMeatOrGetJob=prompt("Do you (1)buy aged prociutto or (2)tell them they need to work for it?")
    //         let arthurAveOrBesonhurst =BuyAgeMeatOrGetJob(buyAgedMeatOrGetJob)
    //                                   ArthurAveOrBensonhurst(arthurAveOrBesonhurst)
        








    //         alert("Congrats Goodbye")
    //       }else if(hudsonValleyOrCupNoodles =="2"){
    //         alert("Rats have been given cup noodles. Rats get high blood pressue.")
    //         alert("Rats die young from getting up to fast."
    //         +"The survivors become sluggish but hilarious.")
    //         alert("Rat start comedy open mic. Rats start Rat Jam open mic. They are now on HBO.")
    //         alert("With humorous jabs at the city, one becomes popular as Rat Pryor. Rat Pryor says there is no beef on the pizza, just on your face. ")
    //         alert("You’re asked about the comment at a press conference. “Mayor how do you feel? ")
    //          prompt("(1) We got bigger things to worry about than name calling like protecting the community or (2) New Yorkers are known for their sense of humor, and that's what makes this city great.")
            
    //          alert("Community Board:The people are complaining about mocking rats. They just sit near the curb and laugh. Menacingly")
        
    //         let answer = prompt("Sir, what will you do"+
    //          "(1) citywide campaign against public mocking or"+
    //          " (2) install noisy mosquitoes that only rats can hear ")
    //         if(answer=="1"){
    //           alert("spent tax dollars on anti mocking campaign. People mock anti mocking campaign")
    //           alert("You get to be mayor another day")
        
    //         }else if(answer=="2"){
    //           alert("Mosquitoes make high pitch noise. Rats scurry back inside.")
             
    //           alert("You get to be mayor another day.")
    //         }
    //       }else{
    //         alert("Rats kept eating pizza. They start pizza delivery company."+
    //         " The Rats fund your opponent and you in the next election."+
    //         " The Rats go nowhere with pizza delivery, and become the new Dutch of New York and furniture retailer that also sells merch. Good luck ")
    //       }
    // }else{
    //   alert("Your chief of staff loses his confidence in your ability to make choices. He coups you.")
    //   alert("You're no longer mayor")
    //   alert("Congrats Goodbye")
    //   //
    // }
    // alert("Game Over")
   
//   }
//  btn.addEventListener("click",startYourJourney)


