import "./style.css";
import ReactGA from "react-ga4";
import myImage from './assets/images/fancy_rat.png'; 
import StoryTree from "./models/StoryTree";
import { v4 as uuidv4 } from 'uuid';
import { getCookie, setCookie } from "./cookie";
const btn = document.getElementById("btn");
const imgElement = document.getElementById("rat");
ReactGA.initialize("G-F1V5591LPW");
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
