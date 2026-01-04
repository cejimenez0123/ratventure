// StoryTree.js
import ReactGA from "react-ga4";
import { getCookie } from "../cookie";
import Node from "./node";

ReactGA.initialize("G-F1V5591LPW");

export default class StoryTree {
  constructor() {
    this.root = null;
    this.scores = { ratAffinity: 0, approval: 50, chaos: 0 };
    this.history = [];
     this.currentPath = ""; // 
  }

  insert(data, path = "") {
    const newNode = new Node(data);
    if (!this.root) { this.root = newNode; return; }
    let current = this.root;
    for (let i = 0; i < path.length; i++) {
      if (path[i] === "1") { if (!current.left) current.left = new Node(null); current = current.left; }
      else if (path[i] === "2") { if (!current.right) current.right = new Node(null); current = current.right; }
    }
    current.data = data;
  }

  applyEffects(effects) {
    if (!effects) return;
    if (typeof effects.ratAffinity === "number") this.scores.ratAffinity = Math.max(-100, Math.min(100, this.scores.ratAffinity + effects.ratAffinity));
    if (typeof effects.approval === "number") this.scores.approval = Math.max(0, Math.min(100, this.scores.approval + effects.approval));
    if (typeof effects.chaos === "number") this.scores.chaos = Math.max(0, Math.min(100, this.scores.chaos + effects.chaos));
  }

  evaluateEnding() {
    const { ratAffinity, approval, chaos } = this.scores;
    if (ratAffinity <= -40 || chaos >= 90) {
      return {
        ending: "couped",
        title: "💀 Rat Revolt",
        text: `The rats have revolted. You are overthrown and mocked as "Mayor Ratatouille". Rat Affinity: ${ratAffinity}, Chaos: ${chaos}.`
      };
    }
    
    if (approval >= 70 && chaos <= 30) {
      let text = `Voters loved your performance. Approval: ${approval}, Rat Affinity: ${ratAffinity}, Chaos: ${chaos}. `;
      if (ratAffinity >= 50) text += "The rats are thriving, but the clone mocks you as 'Mayor Rat' for bending too much.";
      else if (ratAffinity <= 10) text += "The rats are neglected; the clone criticizes your failure to keep them safe.";
      else text += "Rats are mostly content; the clone gives a mixed review.";
      return { ending: "reelected", title: "🏆 Reelected Mayor", text };
    }
    switch(this.currentPath){
      case "12211222":{
        return {
      ending: "lost",
      title: "Who even is the mayor?",
      text: `Winner: Time Square Elmo Josue. Approval: ${approval}, Rat Affinity: ${ratAffinity}, Chaos: ${chaos}. Lick your wounds have a pina colada in Astoria.`
    };
      }
      case "1221121":{
        return {
      ending: "lost",
      title: "SIRF doesn't negotiate",
      text: `Winner: Clone Mayor. Approval: ${approval}, Rat Affinity: ${ratAffinity}, Chaos: ${chaos}. Lick your wounds, while imprisoned at the Black villa, remembering Milli Vanilli nights.`
    };
      }
      case "12121":{
 return {
      ending: "lost",
      title: "❌ Lost the Election",
      text: `Winner: Time Square Cowboy. Approval: ${approval}, Rat Affinity: ${ratAffinity}, Chaos: ${chaos}. People want warmth after the rain. Go home lick your wounds..`
    };
      }
      default:{
        return {
      ending: "lost",
      title: "❌ Lost the Election",
      text: `City vibes didn't favor you. Approval: ${approval}, Rat Affinity: ${ratAffinity}, Chaos: ${chaos}. Chop Cheese 3000 the animatronic hero stole 10% of votes.`
    };
      }
    }
    
  }

  traverseAndPlay() {
    try {
      let current = this.root; let dayCounter = 0;
      if (!current) { alert("Story not loaded."); return null; }

      while (current && current.data) {
        const node = current.data; dayCounter++;

        if (Array.isArray(node.textLines)) node.textLines.forEach(line => { if (line) alert(line); });
        else if (typeof node.textLines === "string") alert(node.textLines);

        if (dayCounter % 5 === 0) {
          alert(`--- Progress Report (Day ${dayCounter}) ---\n` +
                Object.entries(this.scores).map(([k,v])=>`${k}: ${v}`).join("\n"));
        }

        if (node.choices && node.choices.length>0) {
          let promptText = node.prompt||"Choose:";
          node.choices.forEach((c,idx)=>{ const key=idx===0?"1":"2"; promptText+=`\n(${key}) ${c.label}`; });
          const choice = prompt(promptText);

          if (choice==="1"||choice==="2") {
            const idx = choice==="1"?0:1;
          let chosen=node.choices[idx];
          console.log(chosen)
 if (chosen.resetPath) {
  this.currentPath = chosen.newPath ?? "";

  // reposition traversal pointer
  current = this.root;
  for (let i = 0; i < this.currentPath.length; i++) {
    if (!current) break;
    current = this.currentPath[i] === "1"
      ? current.left
      : current.right;
  }
} else {
  this.currentPath += choice;
  current = idx===0 ? current.left : current.right;
}
console.log(this.currentPath)
this.applyEffects(chosen.effects);

this.history.push({
  nodeTitle: node.title||`Day ${dayCounter}`,
  choice: chosen.label,
  effects: chosen.effects,
  scoresSnapshot:{...this.scores}
});

        
            // this.history.push({nodeTitle: node.title||`Day ${dayCounter}`, choice: chosen.label, effects: chosen.effects, scoresSnapshot:{...this.scores}});
            if(node.conclusionText) alert(node.conclusionText)
            try { ReactGA.event({ category:"Story", action:`${node.title||`Day ${dayCounter}`} - ${chosen.label}`, label:getCookie("user_id"), value: idx+1, nonInteraction:false }); } catch {}
            // current = idx===0?current.left:current.right;
            
            continue;

          } else { alert("Invalid choice! Please choose '1' or '2'."); continue; }
        } else { if(node.conclusionText) alert(node.conclusionText); break; }
      }

      const ending = this.evaluateEnding();
      alert(`${ending.title}\n\n${ending.text}`);
      try { ReactGA.event({ category:"Story-End", action:ending.ending, label:getCookie("user_id"), nonInteraction:false }); } catch {}
      return ending;
    } catch (e) { console.error(e); alert("An error occurred. Check console."); return null; }
  }

  insertStory() {
    const n = ({title,textLines,prompt,choice1,choice2,conclusionText})=>({title,textLines,prompt,choices:[{label:choice1.label,effects:choice1.effects,resetPath:choice1.resetPath,newPath:choice1.newPath},{label:choice2.label,effects:choice2.effects,resetPath:choice2.resetPath,newPath:choice2.newPath}],conclusionText});


    this.insert(n({
      title: "Day 1 — Ratmeggedon Begins",
      textLines: [
        "You're the mayor of New York City.",
        "Giant rats powered by radioactive diamond dust have lost their sense of danger.",
        "City morale is low and the tabloids love it. They smell blood in the water.",
        "Your Chief of Staff suggests a bold move to control the rats."
      ],
      prompt: "Do you (1) poison the rats to show toughness or (2) give them pizza to keep them placated?",
      choice1: { label: "Poison the rats (show strength)", effects: { ratAffinity: -10, approval: +2, chaos: +15 } },
      choice2: { label: "Feed them pizza (appease them)", effects: { ratAffinity: +10, approval: -3, chaos: +5 } }
    }), "");

         this.insert(n({
      title: "Day 2 — Needle Duels or Gambling?",
      textLines: [
        
        "Poison made rats inebriated but not incapacitated.",
        "Rats are laughing in the sewers — your Chief asks for Plan B."
      ],
      prompt: "Do you (1) give them needles for rat duels (tough, weird), or (2) introduce rat gambling to control them?",
      choice1: { label: "Needle duels", effects: { ratAffinity: -10, approval: -5, chaos: +20 } },
      choice2: { label: "Introduce gambling", effects: { ratAffinity: +10, approval: -2, chaos: +10 } }
    }), "1");

    // Day 2 — follow-ups for pizza
    this.insert(n({
      title:"Day 2 — Pizza Diplomacy",
      textLines:[
        "The rats happily devour your pizza, they hang more at home. Less in public.",
        "Your advisors suggest you take further action."
      ],
      prompt:"Do you (1) relocate rats to Long Island or (2) give them cup noodles event?",
      choice1:{label:"Relocate",effects:{ratAffinity:-5,approval:+3,chaos:-5}},
      choice2:{label:"Cup noodles event",effects:{ratAffinity:+15,approval:-1,chaos:+2}}
    }),"2");
         this.insert(n({
      title: "Day 3 — Ratsville, Long Island",
      textLines: [
     
        "Rats move to Long Island and form Ratsville.",
        "They develop tastes in aged prosciutto — budget crisis looms."
      ],
      prompt: "Do you (1) source prosciutto from Little Italy (expensive) or (2) negotiate with Costco?",
      choice1: { label: "Little Italy", effects: { ratAffinity: +5, approval: -5, chaos: +3 } },
      choice2: { label: "Costco bulk deal", effects: { ratAffinity: -2, approval: +4, chaos: +1 } }
    }), "21");
         this.insert(n({
      title: "Day 4 — Costco Terms",
      textLines: [
        "Costco demands school hot dogs in return. Parents riot in the suburbs.",
      ],
      prompt: "Do you (1) give kids hot dogs or (2) refuse and search other suppliers?",
      choice1: { label: "Hot dogs for kids", effects: { approval: -6, chaos: +5, ratAffinity: +8 } },
      choice2: { label: "Refuse & search suppliers", effects: { approval: +4, chaos: -2, ratAffinity: -2 } }
    }), "212");
        this.insert(n({
      title: "Day 9 — Clone Appears",
      textLines: [
        "A clone claims to be the 'real' mayor. Media goes wild.",
      ],
      prompt: "Do you (1) prove it's a clone publicly or (2) hold town halls to look mayorly?",
      choice1: { label: "Prove clone", effects: { approval: +3, chaos: -5, ratAffinity: 0 } },
    choice2: { label: "Host town halls", effects: { approval: +3, chaos: +4, ratAffinity: 2 } }
  // choice2: { label: "Debate on TV", effects: { approval: +1, chaos: +8, ratAffinity: 0 } }
    }), "2121");
    this.insert(n({
  title:"Day 13 — Borough Debate",
  textLines:[
    "Each borough presents unique complaints: rats, pigeons, traffic, and food deserts."
  ],
  prompt:"Do you (1) visit each borough personally or (2) send deputies?",
  choice1:{label:"Visit personally",effects:{approval:+10,chaos:+2,ratAffinity:0}},
  choice2:{label:"Send deputies",effects:{approval:-5,chaos:-2,ratAffinity:0}}
}),"21212");


      this.insert(n({
      title: "Day 3 — Deadly Rat Aristocracy",
      textLines: [
       "Needle duels backfired: rats evolve into a class with canes and monocles.",
        "They form the Ratstors and start funding both campaigns."
      ],
      prompt: "Do you (1) accept their donations (legitimize) or (2) outlaw rat ownership of LLCs?",
      choice1: { label: "Accept donations", effects: { ratAffinity: +25, approval: -20, chaos: +10 } },
      choice2: { label: "Outlaw rat LLCs", effects: { ratAffinity: -20, approval: +5, chaos: +5 } }
    }), "11");
         this.insert(n({
      title: "Day 4 — Outlaw Rat LLCs",
      textLines: [
        "You outlaw rat LLCs. Rat lawyers sue you in small claims courts across boroughs.",
      ],
      prompt: "Do you (1) fight it in court or (2) propose a Compromise: Rat Permits?",
      choice1: { label: "Fight in court", effects: { approval: -3, chaos: +10, ratAffinity: -15 } },
      choice2: { label: "Rat permits", effects: { approval: +3, chaos: -4, ratAffinity: -5 } }
    }), "112");
    this.insert(n({
  title:"Day 8 — Clone Critique",
  textLines:[
    "Your clone publicly critiques your decisions: either for bending to Dutch Gary failing to protect rats."
  ],
  prompt:"Do you (1) respond humbly or (2) argue back?",
  choice1:{label:"Humble response",effects:{approval:+5,chaos:-2,ratAffinity:0}},
  choice2:{label:"Argue back",effects:{approval:-5,chaos:+5,ratAffinity:0}}
}),"1121");
      this.insert(n({
      title: "Day 4 — Ratstors & Donations",
      textLines: [
        "Accepting rat money creates scandals: 'Mayor funded by vermin' headlines.",
      ],
  prompt:     "Do you (1) hold a transparency press conference or (2) quietly accept and promise oversight?",
      choice1: { label: "Transparency", effects: { approval: +6, chaos: -5, ratAffinity: -5 } },
      choice2: { label: "Quiet accept", effects: { approval: -10, chaos: +8, ratAffinity: +10 } }
    }), "111");
  this.insert(n({
      title: "Day 5 — Your Clone Leads a Rally",
      textLines: [
        "A Clone mayor appears",
        "Your clone organizes a flash mob asking for more authenticity in government.",
      ],
      prompt: "Do you (1) join your clone (performance art) or (2) denounce it?",
      choice1: { label: "Join clone", effects: { approval: +7, chaos: +6, ratAffinity: 0 } },
      choice2: { label: "Denounce", effects: { approval: -3, chaos: -2, ratAffinity: 0 } }
    }), "1112");
     this.insert(n({
      title: "Day 13 — Subway Opera",
      textLines: [
     
        "Commuters are staged into a viral subway opera; critics love it but riders don't.",
      ],
      prompt: "Do you (1) fund the opera as cultural tourism or (2) issue commuter refunds?",
      choice1: { label: "Fund opera", effects: { approval: +2, chaos: +3, ratAffinity: 0 } },
      choice2: { label: "Refunds", effects: { approval: +5, chaos: -3, ratAffinity: 0 } }
    }), "11121");
  this.insert(n({
      title: "Day 5 — Provide refunds",
      textLines: [
        "Computer refunds go to OMNY cards, munipal budget gets over charged.",
        "Columbia Philosophy Dept. offers to buy it."
      ],
      prompt: "Do you sell the MTA or tell New Yorkers ride on the train?",
      
      choice1: { label: "Sell MTA to Philophy Dept.", effects: { approval: -4, chaos: 0, ratAffinity: -5 } },
      choice2: { label: "Ride on the train", effects: { approval: +6, chaos: -2, ratAffinity: +2 } }
    }), "111212");
        this.insert(n({
      title: "Day 7 — MTA AI Quoting Sartre",
      textLines: [  
        "Subways stop for long monologues. Commuters are split between existential dread and bemusement.",
      ],
      prompt: "Do you (1) ask to have AI patched or (2) declare a 'Philosophy on the Q' festival?",
      choice1: { label: "Patch the AI", effects: { approval: +3, chaos: -6, ratAffinity: 0 } },
      choice2: { label: "Festival", effects: { approval: +5, chaos: +4, ratAffinity: 0 } }
    }), "111212");
          this.insert(n({
      title: "Day 8 — Philosopy Thunder Dome",
      textLines: [  
        "You talk to Columbia to stop philosopical soliloquies. They phrase it as a question but they tell you to eat rocks.",
        "A contract is a contract"
      ],
      prompt: "Do you (1) call for help or (2) declare the festival?",
      choice1: { label: "Festival.", effects: { approval: +3, chaos: -5, ratAffinity: 0 } },
      choice2: { label: "Call for help.", effects: { approval: +5, chaos: +4, ratAffinity: 0 } }
    }), "1112121");
        this.insert(n({
      title:"Day 18 — Improv Chaos",
      textLines:["Rogue billionaires fund improv chaos across boroughs."],
      prompt:"Do you (1) negotiate with Billionaires or (2) call your own improv actors to confuse them?",
      choice1:{label:"Negotiate",effects:{approval:+4,chaos:-8,ratAffinity:0}},
      choice2:{label:"Improv actors",effects:{approval:-2,chaos:+10,ratAffinity:0}},
      conclusionText:"Improv actors shit in your bed and call it color commentary"
    }),"11121");

    this.insert(n({
      title: "Day 18 — A Rogue Militia (or Billionaire DAO)",
      textLines: [
        "A rogue Staten Island militia (or SIRF) attempts to execute a symbolic takeover.",
      ],
      prompt: "Do you (1) negotiate with leaders or (2) call in improv actors to confuse them?",
      choice1: { label: "Negotiate", effects: { approval: +4, chaos: -8, ratAffinity: 0 } },
      choice2: { label: "Improv actors", effects: { approval: -2, chaos: +10, ratAffinity: 0 } },
   
    }), "11122");
    
    this.insert(n({
      title:"Day 3 — Rat Casino",
      textLines:["Rats start a casino under the Times Square McDonald's. Crime spikes."],
      prompt:"Do you (1) shut it down or (2) regulate and tax it?",
      choice1:{label:"Shut it down",effects:{ratAffinity:-10,approval:+2,chaos:-10}},
      choice2:{label:"Regulate and tax",effects:{ratAffinity:+5,approval:+3,chaos:+8}}
    }),"12");
       this.insert(n({
      title: "Day 4 — Regulate & Tax",
      textLines: [
        "Regulation brings revenue. Rat unions demand benefits.",
      ],
      prompt: "Do you (1) grant benefits or (2) deny union status?",
      choice1: { label: "Grant benefits", effects: { approval: +2, chaos: +2, ratAffinity: +10 } },
      choice2: { label: "Deny union status", effects: { approval: -5, chaos: +6, ratAffinity: -10 } }
    }), "122");
     this.insert(n({
      title: "Day 5 — Grant Benifits",
      textLines: [
        "You grant benifits to Rat Union",
        "Now, Time Square Elmos wants the same."
      ],
      prompt: "Do you (1) meet demands or (2) create minimum-elmo standards?",
      choice1: { label: "Meet demands", effects: { approval: +5, chaos: +2, ratAffinity: 0 } },
      choice2: { label: "Min standards", effects: { approval: +8, chaos: +5, ratAffinity: 10 } }
      
    }), "1221");
    this.insert(n({
  title:"Day 16 — Secret Garden Initiative",
  textLines:[
    "Citizens propose rooftop gardens to calm both humans and rats."
  ],
  prompt:"Do you (1) fund gardens or (2) ignore proposals?",
  choice1:{label:"Fund gardens",effects:{ratAffinity:+5,approval:+5,chaos:-2}},
  choice2:{label:"Ignore",effects:{ratAffinity:-5,approval:-3,chaos:+2}}
}),"12212");
     this.insert(n({
      title: "Day 6 — Times Square Elmo Union",
      textLines: [
        "Union Wins pacify majority of Time Square Elmos",
        "Mom and pop Staten Island Millionaires wants right to hire laws (aka right to fire laws) for Rat and Elmo union. Police Union remains untouched.",
  
      ],

      prompt:"Do you (1) agree with mom and pop Staten Island Millionaires or (2)keep minimum stands",
      choice1: { label: "Agree with mom and pop Millionaires", effects: { approval: -6, chaos: +2, ratAffinity: 0 } },
      choice2: { label: "Keep min standards", effects: { approval: -3, chaos: +5, ratAffinity: 0 } }
    }), "12211");
         this.insert(n({
      title: "Day 18 — A Rogue Militia ",
      textLines: [
        "A rogue Staten Island militia (or SIRF) attempts to execute a symbolic takeover.",
      ],
      prompt: "Do you (1) negotiate with leaders or (2) call in improv actors to confuse them?",
      choice1: { label: "Negotiate", effects: { approval: +4, chaos: -8, ratAffinity: 0 } },
      choice2: { label: "Improv actors", effects: { approval: -2, chaos: +10, ratAffinity: 0 } }
    }), "122112");
          this.insert(n({
      title: "Day 18 — A Rogue Militia ",
      textLines: [
        "Actors confuse the militia with firemen lights and ghettotech music. You have to hide. Do you hide in the Bronx or Queens?",
      ],
      prompt: "Do you (1) hide in the Bronx or (2) hide in Queens?",
      choice1: { label: "Bronx", effects: { approval: +4, chaos: -8, ratAffinity: 0 } },
      choice2: { label: "Queens", effects: { approval: -2, chaos: +10, ratAffinity: 0 } }
    }), "122112");
           this.insert(n({
      title: "Day 18 — A Rogue Militia ",
      textLines: [
        "You live a quiet life in Queens. You hear New York city call you, it's not your name, but you hear its you.",
      ],
      prompt: "Do you (1) get back into politics or (2) the quiet quality Queens life?",
      choice1: { label: "Get back into politics",
         resetPath: true,
  newPath: "1112",
        effects: { approval: +4, chaos: -3, ratAffinity: 5 } },
      choice2: { label: "Quiet Quality Queens Life", effects: { approval: +10, chaos: +10, ratAffinity: 0 } }
    }), "1221122");
  
  this.insert(n({
      title: "Day 4 — Shutdown Backlash",
      textLines: [
        "Shutting the rat casino triggers nightlife protests: 'anti-vivisection nightlife' shows up.",
      ],
      prompt: "Do you (1) offer alternative venues or (2) crack down on protests?",
      choice1: { label: "Offer venues", effects: { approval: +4, chaos: -5, ratAffinity: +2 } },
      choice2: { label: "Crack down", effects: { approval: -8, chaos: +10, ratAffinity: -5 } }
    }), "121");
  this.insert(n({
      title: "Day 6 — NFT Air & Stats",
      textLines: [
     "The real estate market sells intangible assets; the press calls it 'airbnb for nothing'."
   
        // "Developers sell NFTs for slices of sky. You get calls from the MTA AI, now quoting Sartre.",
      ],
     prompt: "Do you (1) tax them aggressively or (2) create a 'public air' NFT to fund schools?",
      choice1: { label: "Regulate NFTs", effects: { approval: +4, chaos: -5, ratAffinity: -2 } },
      choice2: { label: "Sky Commons fund", effects: { approval: +2, chaos: +3, ratAffinity: 0 } }
    }), "1211");
  
        this.insert(n({
      title: "Day 7 — Developers Auction Air Above Buildings",
      textLines: [
        "The auctions are chaotic. Protests emerge by housing advocates who want their black tar beaches back."
      ],
      prompt: "Do you (1) stop the auctions with emergency ordinance or (2) let market decide?",
      choice1: { label: "Stop auctions", effects: { approval: +6, chaos: -6, ratAffinity: 0 } },
      choice2: { label: "Let market decide", effects: { approval: -4, chaos: +10, ratAffinity: 0 } }
    }), "12112");
   
     this.insert(n({
      title: "Day 15 — Your Clone Leads a Rally",
      textLines: [
        "Your clone organizes a flash mob asking for more authenticity in government.",
      ],
      prompt: "Do you (1) join your clone (performance art) or (2) denounce it?",
      choice1: { label: "Join clone", effects: { approval: +7, chaos: +6, ratAffinity: 0 } },
      choice2: { label: "Denounce", effects: { approval: -3, chaos: -2, ratAffinity: 0 } }
    }), "12221");
    this.insert(n({
      title: "Day 16 — You Lean In or Clamp Down",
      textLines: [
   
        "The city expects a tone. Your aides say: lean into absurdism or try to restore 'normal'."
      ],
      prompt: "Do you (1) embrace absurdism & make creative allies or (2) clamp down and restore order?",
      choice1: { label: "Embrace absurdism", effects: { approval: +6, chaos: +5, ratAffinity: +5 } },
      choice2: { label: "Restore order", effects: { approval: -4, chaos: -6, ratAffinity: -3 } }
    }), "122211");
    // --- Days 16-19: Final Spiral ---

    // Day 16
    this.insert(n({
      title: "Day 16 — You Lean In or Clamp Down",
      textLines: [
   
        "The city expects a tone. Your aides say: lean into absurdism or try to restore 'normal'."
      ],
      prompt: "Do you (1) embrace absurdism & make creative allies or (2) clamp down and restore order?",
      choice1: { label: "Embrace absurdism", effects: { approval: +6, chaos: +5, ratAffinity: +5 } },
      choice2: { label: "Restore order", effects: { approval: -4, chaos: -6, ratAffinity: -3 } }
    }), "121122");
    // Day 7
//     this.insert(node({
//       title: "Day 7 — MTA AI Quoting Sartre",
//       textLines: [
        
//         "Subways stop for long monologues. Commuters are split between existential dread and applause.",
//       ],
//       prompt: "Do you (1) patch the AI or (2) declare a 'Philosophy on the Q' festival?",
//       choice1: { label: "Patch the AI", effects: { approval: +3, chaos: -6, ratAffinity: 0 } },
//       choice2: { label: "Festival", effects: { approval: +5, chaos: +4, ratAffinity: 0 } }
//     }), "1221");
this.insert(n({
      title: "Day 3 — Rat Open Mic",
      textLines: [
      
        "Cup noodles yielded comedians. Rat Pryor is trending with a bit about pizza patriarchy.",
        "Press asks for comment."
      ],
      prompt: "Do you (1) deflect and call for focus, or (2) praise New York humor?",
      choice1: { label: "Deflect", effects: { ratAffinity: -5, approval: +1, chaos: +2 } },
      choice2: { label: "Praise humor", effects: { ratAffinity: +5, approval: +2, chaos: -2 } }
    }), "22");
    // 222 (2->2->2)
    this.insert(n({
      title: "Day 4 — Praise Humor",
      textLines: [
        "Praising Rat humor angers the conservative Evil Times. (Yep, they're not hiding it.) Call you `Rat Rap Clap Trap`",
      ],
      prompt: "Do you (1) host a borough comedy tour or (2) double-down on policy memos?",
      choice1: { label: "Comedy tour", effects: { approval: +8, chaos: +2, ratAffinity: +5 } },
      choice2: { label: "Policy memos", effects: { approval: -1, chaos: -1, ratAffinity: -2 } }
    }), "222");
     this.insert(n({
      title: "Day 4 — Deflect Press",
      textLines: [
        "Deflecting causes media to paint you cold. Young voters go 'Not my mayor!!`",
      ],
      prompt: "Do you (1) perform a viral bit to win back hearts or (2) stay statesmanlike?",
      choice1: { label: "Viral bit", effects: { approval: +6, chaos: +5, ratAffinity: +3 } },
      choice2: { label: "Statesmanlike", effects: { approval: -2, chaos: -1, ratAffinity: -2 } }
    }), "221");
 // Day 5 — Pigeon faction

    this.insert(n({
      title:"Day 5 — Pigeon Factions",
      textLines:["Pigeons radicalize teens using voice messaging app CooTalk. Two factions appear: futurists vs. socialists."],
      prompt:"Do you (1) treat pigeons as influencers or (2) partner for education?",
      choice1:{label:"Influencers (P.I.D.G.E.O.N. Act)",effects:{approval:-4,chaos:+6,ratAffinity:-3}},
      choice2:{label:"Partner for education",effects:{approval:+5,chaos:-3,ratAffinity:0}}
    }),"1222");
    
  


// Day 6 — Street artist uprising
this.insert(n({
  title:"Day 6 — Street Artist Uprising",
  textLines:[
    "Street artists demand city-sponsored murals. Some work in alleyways with hidden codes."
  ],
  prompt:"Do you (1) fund the murals or (2) ban coded art?",
  choice1:{label:"Fund murals",effects:{approval:+8,chaos:+2,ratAffinity:0}},
  choice2:{label:"Ban coded art",effects:{approval:-5,chaos:-3,ratAffinity:0}}
}),"12222");

// Day 7 — Sewer flooding
this.insert(n({
  title:"Day 7 — Sewer Flooding",
  textLines:[
    "Parts of Manhattan flood. Brooklyn tweets: 'we didn't do it'."
    ],
   prompt: "Do you (1) blame Brooklyn & appoint a Weather Czar or (2) build a coalition of boroughs?",
      choice1: { label: "Blame Brooklyn", effects: { approval: -8, chaos: +10, ratAffinity: -2 } },
      choice2: { label: "Coalition", effects: { approval: +6, chaos: -4, ratAffinity: 0 } },
   conclusionText:"Brooklyn say: 'You throw a shot at Brooklyn. You think Brooklyn won't slug back. Really!'"})
   ,"1212");
       this.insert(n({
  title:"Day 13 — Borough Town Hall",
  textLines:[
    "Each borough presents unique complaints: rats, pigeons, traffic, and food deserts.",
    "Changes are needed to help Brooklyn. Who is too self concious to ask for help"
  ],
  prompt:"Do you (1) visit each borough personally or (2) send deputies?",
  choice1:{label:"Visit personally",effects:{approval:+10,chaos:+2,ratAffinity:0}},
  choice2:{label:"Send deputies",effects:{approval:-2,chaos:-2,ratAffinity:0}}
}),"12122");


// Day 8 — Clone critique


// Day 9 — Albanian LLM scandal
// this.insert(n({
//   title:"Day 9 — Albanian LLM",
//   textLines:[
//     "An Albanian AI language model leaks city secrets. Media frenzy erupts."
//   ],
//   prompt:"Do you (1) negotiate with the AI or (2) shut down its servers?",
//   choice1:{label:"Negotiate",effects:{approval:+3,chaos:-5,ratAffinity:0}},
//   choice2:{label:"Shut down",effects:{approval:-3,chaos:+10,ratAffinity:0}}
// }),"1122");

// Day 10 — Subway takeover
this.insert(n({
  title:"Day 10 — Subway Takeover",
  textLines:[
    "Rats occupy subway tunnels, demanding recognition as citizens."
  ],
  prompt:"Do you (1) grant them symbolic citizenship or (2) evict them?",
  choice1:{label:"Grant citizenship",effects:{ratAffinity:+15,approval:-2,chaos:+5}},
  choice2:{label:"Evict them",effects:{ratAffinity:-20,approval:+3,chaos:+8}}
}),"1111");

// Day 11 — Chop Cheese 3000 surge

    
this.insert(n({
  title:"Day 11 — Chop Cheese 3000",
  textLines:[
     "New Canidate animatronic Chop Cheese 3000 joins the race."
     ,"Chop Cheese 3000 gains 10% of popular support with flashy sandwiches and memes."
    ],
  prompt:"Do you (1) ignore them or (2) release your own viral campaign?",
  choice1:{label:"Ignore",effects:{approval:-5,chaos:+2,ratAffinity:0}},
  choice2:{label:"Viral campaign",effects:{approval:+5,chaos:-2,ratAffinity:0}}
}),"11122");

// Day 12 — Graffiti rebellion
this.insert(n({
  title:"Day 12 — Graffiti Rebellion",
  textLines:[
    "Unauthorized graffiti spreads anti-mayor messages citywide."
  ],
  prompt:"Do you (1) prosecute artists or (2) organize community murals?",
  choice1:{label:"Prosecute",effects:{approval:-10,chaos:-2,ratAffinity:0}},
  choice2:{label:"Community murals",effects:{approval:+10,chaos:+3,ratAffinity:0}}
}),"11211");

// Day 13 — Borough debate


// Day 14 — Underground art heist
this.insert(n({
  title:"Day 14 — Underground Art Heist",
  textLines:[
    "Rats steal subway sculptures. Public outrage and fascination follow."
  ],
  prompt:"Do you (1) recover artworks or (2) let rats keep them?",
  choice1:{label:"Recover",effects:{ratAffinity:-10,approval:+5,chaos:-5}},
  choice2:{label:"Let rats keep them",effects:{ratAffinity:+15,approval:-3,chaos:+2}}
}),"12111");

// Day 15 — Tech startup chaos
this.insert(n({
  title:"Day 15 — Tech Startup Chaos",
  textLines:[
    "AI startups flood the city with apps predicting rat and pigeon behavior.",
    "Will the birds drop droppings form above. Will the rats give accurate observations. "
  ],
  prompt:"Do you (1) regulate AI or (2) invest in partnerships?",
  choice1:{label:"Regulate AI",effects:{approval:-2,chaos:-5,ratAffinity:0}},
  choice2:{label:"Invest",effects:{approval:+3,chaos:+3,ratAffinity:+2}}
}),"12112");

// Day 16 — Secret garden initiative
// this.insert(n({
//   title:"Day 16 — Secret Garden Initiative",
//   textLines:[
//     "Citizens propose rooftop gardens to calm both humans and rats."
//   ],
//   prompt:"Do you (1) fund gardens or (2) ignore proposals?",
//   choice1:{label:"Fund gardens",effects:{ratAffinity:+5,approval:+5,chaos:-2}},
//   choice2:{label:"Ignore",effects:{ratAffinity:-5,approval:-3,chaos:+2}}
// }),"12211");

// Day 17 — Rumors of impeachment
// Day 17 — Key Negotiations: Oligarchs vs Rat Union
this.insert(n({
  title:"Day 17 — Key Negotiations",
  textLines:[
    function(scores, currentPath){
      // Determine context from path
      if(currentPath=="1111"){ // Ratstors path
        return "The Ratstors (rat oligarchs) demand further perks and influence over city decisions.";
      } else { // Newsies / human path
        return "The displaced Newsies, now sharing news via Threads, push for protections and fair reporting.";
      }
    }(this.scores,this.currentPath)
  ],
  prompt:"Do you (1) meet with the oligarchs / Ratstors or (2) meet with the Union / Newsies?",
  choice1:{label:"Meet Oligarchs / Ratstors",effects:{ratAffinity:+5,approval:-5,chaos:+5}},
  choice2:{label:"Meet Union / Newsies",effects:{ratAffinity:-3,approval:+6,chaos:-2}}
}),"11112"); // attach under Day 16 path
  this.insert(n({
      title: "Day 4 — Regulate & Tax",
      textLines: [
        "Regulation brings revenue. Rat unions demand benefits.",
      ],
      prompt: "Do you (1) grant benefits or (2) deny union status?",
      choice1: { label: "Grant benefits", effects: { approval: +2, chaos: +2, ratAffinity: +10 } },
      choice2: { label: "Deny union status", effects: { approval: -5, chaos: +6, ratAffinity: -10 } }
    }), "111122");

    // Day 18 — Billionaire-funded improv jihad

// Day 19 — Final Polls & Clone Critique (ratAffinity-based)
this.insert(n({
  title:"Day 19 — Final Polls Drop",
  textLines:[
    function(scores){
      const ratAffinity = scores.ratAffinity;
      if(ratAffinity >= 50){
        return "Your clone critiques your indulgence: 'Mayor Ratatouille of NYC!'";
      } else if(ratAffinity <= -20){
        return "Your clone scolds you for neglect: 'You failed to protect the rats, Mayor.'";
      } else {
        return "Your clone offers mild critique, noting your mixed handling of rat affairs.";
      }
    },
    "Meanwhile, polls show your opponents gaining with surrealist campaigns and performance candidates."
  ],
  prompt:"Do you (1) respond with a heartfelt policy speech or (2) release a weird viral ad?",
  choice1:{label:"Policy speech",effects:{approval:+3,chaos:-2,ratAffinity:0}},
  choice2:{label:"Weird viral ad",effects:{approval:+4,chaos:+4,ratAffinity:+2}}
}),"1111211");

// Day 20 — Final debate
this.insert(n({
  title:"Day 20 — Debate / Final Message",
  textLines:["Opponents include Chop Cheese 3000 , tweeting tree, animatronic Elmo."],
  prompt:"Do you (1) give a grand speech or (2) deliver a bold, confusing message?",
      choice1:{label:"Grand speech",effects:{approval:+5,chaos:-5,ratAffinity:0}},
      choice2:{label:"Bold confusing",effects:{approval:-6,chaos:+15,ratAffinity:0}}
    }),"11112111");

    // Passive days, clone critique, and Albanian LLM handled in evaluateEnding()
  }
}


    //    this.insert(n({
    //   title: "Day 9 — Clone Clues",
    //   textLines: [
    //     "You have your cheif of staff look for info on your clone",
    //     "After 2 days, they come back. The look like they fought a tiger.",
    //     "You have the clones secrets. The clone was developed consortium of AI Companies and the Albanian Mafia."
    //   ],
    //   prompt: "Do you (1) rlease the infomation (2) ?",
    //   choice1: { label: "Release information", effects: { approval: +2, chaos: -10, ratAffinity: 0 } },
    //   choice2: { label: "Host town halls", effects: { approval: +3, chaos: +4, ratAffinity: 2 } }
    // }), "2121");

    //  this.insert(n({
    //   title: "Day 5 — Your Clone Leads a Rally",
    //   textLines: [
    //     "Your clone organizes a flash mob asking for more authenticity in government.",
    //   ],
    //   prompt: "Do you (1) join your clone (performance art) or (2) denounce it?",
    //   choice1: { label: "Join clone", effects: { approval: +7, chaos: +6, ratAffinity: 0 } },
    //   choice2: { label: "Denounce", effects: { approval: -3, chaos: -2, ratAffinity: 0 } }
    // }), "1112");
// // StoryTree.js
// import ReactGA from "react-ga4";
// import { getCookie } from "../cookie";
// import Node from "./node";
// // Simple Node class if you don't already have one

// ReactGA.initialize("G-F1V5591LPW");
// export default class StoryTree {
//   constructor() {
//     this.root = null;

//     // Running scores
//     this.scores = {
//       ratAffinity: 0, // positive = pro-rat decisions
//       approval: 50,   // 0-100 baseline
//       chaos: 0        // 0-100
//     };

//     // optional history for UI or debugging
//     this.history = [];
//   }

//   // Insert node data at a path string of '1' and '2'
//   insert(data, path = "") {
//     const newNode = new Node(data);
//     if (this.root === null) {
//       this.root = newNode;
//       return;
//     }

//     let current = this.root;
//     for (let i = 0; i < path.length; i++) {
//       if (path[i] === "1") {
//         if (!current.left) current.left = new Node(null);
//         current = current.left;
//       } else if (path[i] === "2") {
//         if (!current.right) current.right = new Node(null);
//         current = current.right;
//       }
//     }
//     current.data = data;
//   }

//   // Apply effects to scores (effects can be partial: {ratAffinity: +10, approval: -5, chaos: +8})
//   applyEffects(effects) {
//     if (!effects) return;
//     if (typeof effects.ratAffinity === "number") {
//       this.scores.ratAffinity = Math.max(-100, Math.min(100, this.scores.ratAffinity + effects.ratAffinity));
//     }
//     if (typeof effects.approval === "number") {
//       this.scores.approval = Math.max(0, Math.min(100, this.scores.approval + effects.approval));
//     }
//     if (typeof effects.chaos === "number") {
//       this.scores.chaos = Math.max(0, Math.min(100, this.scores.chaos + effects.chaos));
//     }
//   }

//   // Decide ending based on scores
//   evaluateEnding() {
//     const { ratAffinity, approval, chaos } = this.scores;

//     // Simple deterministic rules (tweak to taste)
//     if (chaos >= 70 || ratAffinity >= 70) {
//       return {
//         ending: "couped",
//         title: "💀 Couped",
//         text: `Chaos soared (${chaos}) and non-human factions aligned (${ratAffinity}). You're taken out mid-speech and thawed in a bodega freezer.`
//       };
//     }

//     if (approval >= 60 && chaos <= 40) {
//       return {
//         ending: "reelected",
//         title: "🏆 Reelected Mayor",
//         text: `Voters loved your weird but functional performance. Approval: ${approval}, Rat Affinity:${ratAffinity}, Chaos: ${chaos}. The pizza rat salutes you.`
//       };
//     }

//     // fallback: lost election
//     return {
//       ending: "lost",
//       title: "❌ Lost the Election",
//       text: `You fought hard. Approval: ${approval},Rat Affinity:${ratAffinity}, Chaos: ${chaos}.  The city voted for vibes over policy (and Elmo got 42%).`
//     };
//   }
//   traverseAndPlay() {
//   try {
//     let current = this.root;
//     let dayCounter = 0; // keep track of days

//     if (!current) {
//       alert("Story not loaded.");
//       return null;
//     }

//     while (current && current.data) {
//       const node = current.data;
//       dayCounter++;

//       // show narrative lines
//       if (Array.isArray(node.textLines)) {
//         node.textLines.forEach(line => {
//           if (line) alert(line);
//         });
//       } else if (typeof node.textLines === "string") {
//         alert(node.textLines);
//       }

//       // Show scores every 5 days
//       if (dayCounter % 5 === 0) {
//         alert(
//           `--- Progress Report (Day ${dayCounter}) ---\n` +
//           Object.entries(this.scores)
//             .map(([k, v]) => `${k}: ${v}`)
//             .join("\n")
//         );
//       }

//       // If there are choices, prompt. Otherwise this is an ending node.
//       if (node.choices && node.choices.length > 0) {
//         let promptText = node.prompt || "Choose:";
//         node.choices.forEach((c, idx) => {
//           const key = idx === 0 ? "1" : "2";
//           promptText += `\n(${key}) ${c.label}`;
//         });

//         const choice = prompt(promptText);

//         if (choice === "1" || choice === "2") {
//           const idx = choice === "1" ? 0 : 1;
//           const chosen = node.choices[idx];

//           // apply effects
//           this.applyEffects(chosen.effects);

//           // record history
//           this.history.push({
//             nodeTitle: node.title || `Day ${dayCounter}`,
//             choice: chosen.label,
//             effects: chosen.effects,
//             scoresSnapshot: { ...this.scores }
//           });

//           // GA tracking
//           try {
//             ReactGA.event({
//               category: "Story",
//               action: `${node.title || `Day ${dayCounter}`} - ${chosen.label}`,
//               label: getCookie("user_id"),
//               value: idx + 1,
//               nonInteraction: false
//             });
//           } catch (gaErr) {}

//           // Move along tree
//           current = idx === 0 ? current.left : current.right;
//           continue;
//         } else {
//           alert("Invalid choice! Please choose '1' or '2'.");
//           continue; // stay in same node
//         }
//       } else {
//         if (node.conclusionText) alert(node.conclusionText);
//         break;
//       }
//     }

//     // Final ending
//     const ending = this.evaluateEnding();
//     alert(`${ending.title}\n\n${ending.text}`);

//     try {
//       ReactGA.event({
//         category: "Story-End",
//         action: ending.ending,
//         label: getCookie("user_id"),
//         nonInteraction: false
//       });
//     } catch (gaErr) {}

//     return ending;
//   } catch (e) {
//     try {
//       ReactGA.event({
//         category: "Error",
//         action: getCookie("user_id"),
//         label: e.message,
//         nonInteraction: true
//       });
//     } catch (_) {}
//     console.error(e);
//     alert("An error occurred. Check console.");
//     return null;
//   }
// }

// // traverseAndPlay(scores, onEnd) {

//   insertStory() {
//       const { ratAffinity, approval, chaos } = this.scores;
//     // helper to shorten node building
//     const node = ({ title, textLines, prompt, choice1, choice2, conclusionText }) => ({
//       title,
//       textLines,
//       prompt,
//       choices: [
//         { label: choice1.label, effects: choice1.effects },
//         { label: choice2.label, effects: choice2.effects }
//       ],
//       conclusionText
//     });

//     // Day 1
//     this.insert(node({
//       title: "Day 1 — Ratmeggedon Begins",
//       textLines: [
//         "You're the mayor of New York City.",
//         "Giant rats powered by radioactive diamond dust have lost their sense of danger.",
//         "City morale is low and the tabloids love it. They smell blood in the water.",
//         "Your Chief of Staff suggests a bold move to control the rats."
//       ],
//       prompt: "Do you (1) poison the rats to show toughness or (2) give them pizza to keep them placated?",
//       choice1: { label: "Poison the rats (show strength)", effects: { ratAffinity: -20, approval: +2, chaos: +15 } },
//       choice2: { label: "Feed them pizza (appease them)", effects: { ratAffinity: +20, approval: -3, chaos: +5 } }
//     }), "");

//     // Day 2 (1) -> after poison

    
//     this.insert(node({
//       title: "Day 2 — Needle Duels or Gambling?",
//       textLines: [
        
//         "Poison made rats inebriated but not incapacitated.",
//         "Rats are laughing in the sewers — your Chief asks for Plan B."
//       ],
//       prompt: "Do you (1) give them needles for rat duels (tough, weird), or (2) introduce rat gambling to control them?",
//       choice1: { label: "Needle duels", effects: { ratAffinity: -10, approval: -5, chaos: +20 } },
//       choice2: { label: "Introduce gambling", effects: { ratAffinity: +10, approval: -2, chaos: +10 } }
//     }), "1");

//     // Day 2 (2) -> after pizza
//     this.insert(node({
//       title: "Day 2 — Pizza At Home",
//       textLines: [

//         "Rats enjoy pizza at home. They are less visible in public.",
//         "Your advisors say we need to shape their public behavior."
//       ],
//       prompt: "Do you (1) lure rats to Long Island (relocate) or (2) offer them cup noodles (domesticate taste)?",
//       choice1: { label: "Relocate them to Long Island", effects: { ratAffinity: -5, approval: +3, chaos: -5 } },
//       choice2: { label: "Cup noodles", effects: { ratAffinity: +15, approval: -1, chaos: +2 } }
//     }), "2");

//     // Day 3 nodes (11,12,21,22)
//     // 11 (1->1)
//     this.insert(node({
//       title: "Day 3 — Deadly Rat Aristocracy",
//       textLines: [
//        "Needle duels backfired: rats evolve into a class with canes and monocles.",
//         "They form the Ratstors and start funding both campaigns."
//       ],
//       prompt: "Do you (1) accept their donations (legitimize) or (2) outlaw rat ownership of LLCs?",
//       choice1: { label: "Accept donations", effects: { ratAffinity: +25, approval: -20, chaos: +10 } },
//       choice2: { label: "Outlaw rat LLCs", effects: { ratAffinity: -20, approval: +5, chaos: +5 } }
//     }), "11");

//     // 12 (1->2)
//     this.insert(node({
//       title: "Day 3 — Rat Casino",
//       textLines: [
//      "Your gambling plan created a rat casino under an old McDonald's. Rat-on-rat crime spikes.",
//         "Humans complain about the smell of mint juleps and pocket change."
//       ],
//       prompt: "Do you (1) shut the casino down or (2) regulate and tax it?",
//       choice1: { label: "Shut it down", effects: { ratAffinity: -15, approval: +5, chaos: -10 } },
//       choice2: { label: "Regulate & tax", effects: { ratAffinity: +5, approval: +3, chaos: +8 } }
//     }), "12");

//     // 21 (2->1)
//     this.insert(node({
//       title: "Day 3 — Ratsville, Long Island",
//       textLines: [
     
//         "Rats move to Long Island and form Ratsville.",
//         "They develop tastes in aged prosciutto — budget crisis looms."
//       ],
//       prompt: "Do you (1) source prosciutto from Little Italy (expensive) or (2) negotiate with Costco?",
//       choice1: { label: "Little Italy", effects: { ratAffinity: +5, approval: -5, chaos: +3 } },
//       choice2: { label: "Costco bulk deal", effects: { ratAffinity: -2, approval: +4, chaos: +1 } }
//     }), "21");

//     // 22 (2->2)
//     this.insert(node({
//       title: "Day 3 — Rat Open Mic",
//       textLines: [
      
//         "Cup noodles yielded comedians. Rat Pryor is trending with a bit about pizza patriarchy.",
//         "Press asks for comment."
//       ],
//       prompt: "Do you (1) deflect and call for focus, or (2) praise New York humor?",
//       choice1: { label: "Deflect", effects: { ratAffinity: -5, approval: +1, chaos: +2 } },
//       choice2: { label: "Praise humor", effects: { ratAffinity: +5, approval: +2, chaos: -2 } }
//     }), "22");

//     // Day 4 nodes (111,112,121,122,211,212,221,222)
//     // Keep building — to avoid an explosion of unique content I'll write them concisely but meaningfully.

//     // 111 (1->1->1)
//     this.insert(node({
//       title: "Day 4 — Ratstors & Donations",
//       textLines: [
//         "Accepting rat money creates scandals: 'Mayor funded by vermin' headlines.",
//       ],
//       prompt: "Do you (1) hold a transparency press conference or (2) quietly accept and promise oversight?",
//       choice1: { label: "Transparency", effects: { approval: +6, chaos: -5, ratAffinity: -5 } },
//       choice2: { label: "Quiet accept", effects: { approval: -10, chaos: +8, ratAffinity: +10 } }
//     }), "111");

//     // 112 (1->1->2)
//     this.insert(node({
//       title: "Day 4 — Outlaw Rat LLCs",
//       textLines: [
//         "You outlaw rat LLCs. Rat lawyers sue you in small claims courts across boroughs.",
//       ],
//       prompt: "Do you (1) fight it in court or (2) propose a Compromise: Rat Permits?",
//       choice1: { label: "Fight in court", effects: { approval: -3, chaos: +10, ratAffinity: -15 } },
//       choice2: { label: "Rat permits", effects: { approval: +3, chaos: -4, ratAffinity: -5 } }
//     }), "112");

//     // 121 (1->2->1)
//     this.insert(node({
//       title: "Day 4 — Shutdown Backlash",
//       textLines: [
//         "Shutting the rat casino triggers nightlife protests: 'anti-vivisection nightlife' shows up.",
//       ],
//       prompt: "Do you (1) offer alternative venues or (2) crack down on protests?",
//       choice1: { label: "Offer venues", effects: { approval: +4, chaos: -5, ratAffinity: +2 } },
//       choice2: { label: "Crack down", effects: { approval: -8, chaos: +10, ratAffinity: -5 } }
//     }), "121");

//     // 122 (1->2->2)
//     this.insert(node({
//       title: "Day 4 — Regulate & Tax",
//       textLines: [
//         "Regulation brings revenue. Rat unions demand benefits.",
//       ],
//       prompt: "Do you (1) grant benefits or (2) deny union status?",
//       choice1: { label: "Grant benefits", effects: { approval: +2, chaos: +2, ratAffinity: +10 } },
//       choice2: { label: "Deny union status", effects: { approval: -5, chaos: +6, ratAffinity: -10 } }
//     }), "122");

//     // 211 (2->1->1)
//     this.insert(node({
//       title: "Day 4 — Arthur Ave Hopes",
//       textLines: [
//         "You try Little Italy — it's now a gelato stand. The pasta artisans left town.",
//       ],
//       prompt: "Do you (1) incentivize artisanal prosciutto or (2) pivot to honey-glazed rat diets?",
//       choice1: { label: "Incentivize prosciutto", effects: { approval: -2, chaos: +3, ratAffinity: +5 } },
//       choice2: { label: "Honey-glazed", effects: { approval: +1, chaos: -1, ratAffinity: -3 } }
//     }), "211");

//     // 212 (2->1->2)
//     this.insert(node({
//       title: "Day 4 — Costco Terms",
//       textLines: [
//         "Costco demands school hot dogs in return. Parents riot in the suburbs.",
//       ],
//       prompt: "Do you (1) give kids hot dogs or (2) refuse and search other suppliers?",
//       choice1: { label: "Hot dogs for kids", effects: { approval: -6, chaos: +5, ratAffinity: +8 } },
//       choice2: { label: "Refuse & search suppliers", effects: { approval: +4, chaos: -2, ratAffinity: -2 } }
//     }), "212");

//     // 221 (2->2->1)
//     this.insert(node({
//       title: "Day 4 — Deflect Press",
//       textLines: [
//         "Deflecting causes media to paint you aloof. Young voters grumble.",
//       ],
//       prompt: "Do you (1) perform a viral bit to win back hearts or (2) stay statesmanlike?",
//       choice1: { label: "Viral bit", effects: { approval: +6, chaos: +5, ratAffinity: +3 } },
//       choice2: { label: "Statesmanlike", effects: { approval: -2, chaos: -1, ratAffinity: -2 } }
//     }), "221");

//     // 222 (2->2->2)
//     this.insert(node({
//       title: "Day 4 — Praise Humor",
//       textLines: [
//         "Praising humor wins some hearts but anger the conservative editorial pages.",
//       ],
//       prompt: "Do you (1) host a borough comedy tour or (2) double-down on policy memos?",
//       choice1: { label: "Comedy tour", effects: { approval: +8, chaos: +2, ratAffinity: +5 } },
//       choice2: { label: "Policy memos", effects: { approval: -1, chaos: -1, ratAffinity: -2 } }
//     }), "222");


//     this.insert(node({
//       title: "Day 5 — Staten Island Independence",
//       textLines: [
//         "Staten Island threatens secession and forms a militia of former mall Santas.",
//       ],
//       prompt: "Do you (1) negotiate autonomy or (2) send in negotiators with bagels and backrub coupons?",
//       choice1: { label: "Negotiate autonomy", effects: { approval: -5, chaos: +10, ratAffinity: 0 } },
//       choice2: { label: "Bagels & backrubs", effects: { approval: +6, chaos: -3, ratAffinity: 0 } }
//     }), "1111");

//     // 1112
//     this.insert(node({
//       title: "Day 5 — Times Square Elmo Union",
//       textLines: [
//         "Elmos demand dental. Mid-town gets theatrical.",
//       ],
//       prompt: "Do you (1) meet demands or (2) create minimum-elmo standards?",
//       choice1: { label: "Meet demands", effects: { approval: +5, chaos: +2, ratAffinity: 0 } },
//       choice2: { label: "Min standards", effects: { approval: -3, chaos: +5, ratAffinity: 0 } }
//     }), "1112");

//     // 1121
//     this.insert(node({
//       title: "Day 5 — Billionaires Into Sewers",
//       textLines: [
//         "Billionaires move into the sewers to dodge taxes — rats sue the billionaires.",
//       ],
//       prompt: "Do you (1) tax sewer dwellings or (2) offer them art-subsidy deals?",
//       choice1: { label: "Tax them", effects: { approval: +3, chaos: +8, ratAffinity: -5 } },
//       choice2: { label: "Art-subsidy", effects: { approval: -2, chaos: -2, ratAffinity: +2 } }
//     }), "1121");

//     // 1222
//     this.insert(node({
//       title: "Day 5 — Pigeon Social Network 'CooTalk'",
//       textLines: [
//         "Pigeons radicalize teens with a platform of nested coos.",
//       ],
//       prompt: "Do you (1) treat pigeons as influencers (P.I.D.G.E.O.N. Act) or (2) partner with them for education?",
//       choice1: { label: "P.I.D.G.E.O.N. Act", effects: { approval: -4, chaos: +6, ratAffinity: -3 } },
//       choice2: { label: "Partner for education", effects: { approval: +5, chaos: -3, ratAffinity: 0 } }
//     }), "1222");

//     // --- Days 6-10: Human Mayhem (more variety) ---

//     // Day 6 (one representative node inserted in a few branches)
//     this.insert(node({
//       title: "Day 6 — NFT Air & Stats",
//       textLines: [
     
//         "Developers sell NFTs for slices of sky. You get calls from the MTA AI, now quoting Sartre.",
//       ],
//       prompt: "Do you (1) regulate NFTs of air or (2) embrace and create a 'Sky Commons' fund?",
//       choice1: { label: "Regulate NFTs", effects: { approval: +4, chaos: -5, ratAffinity: -2 } },
//       choice2: { label: "Sky Commons fund", effects: { approval: +2, chaos: +3, ratAffinity: 0 } }
//     }), "1211"); // attach under earlier path



//     // Day 8
//     this.insert(node({
//       title: "Day 8 — Flooding Because Brooklyn 'Stole Weather'",
//       textLines: [
//         "Parts of Manhattan flood. Brooklyn tweets: 'we didn't do it'."
//       ],
//       prompt: "Do you (1) blame Brooklyn & appoint a Weather Czar or (2) build a coalition of boroughs?",
//       choice1: { label: "Blame Brooklyn", effects: { approval: -8, chaos: +10, ratAffinity: -2 } },
//       choice2: { label: "Coalition", effects: { approval: +6, chaos: -4, ratAffinity: 0 } }
//     }), "2112");

//     // Day 9
//     this.insert(node({
//       title: "Day 9 — Clone Appears",
//       textLines: [
//         "A clone claims to be the 'real' mayor. Media goes wild.",
//       ],
//       prompt: "Do you (1) prove it's a clone publicly or (2) let them debate you on live TV?",
//       choice1: { label: "Prove clone", effects: { approval: +3, chaos: -5, ratAffinity: 0 } },
//       choice2: { label: "Debate on TV", effects: { approval: +1, chaos: +8, ratAffinity: 0 } }
//     }), "2121");

//     // Day 10
//     this.insert(node({
//       title: "Day 10 — Developers Sell Air NFTs",
//       textLines: [
//           "The real estate market sells intangible assets; the press calls it 'airbnb for nothing'."
//       ],
//       prompt: "Do you (1) tax them aggressively or (2) create a 'public air' NFT to fund schools?",
//       choice1: { label: "Tax aggressively", effects: { approval: +2, chaos: +5, ratAffinity: -1 } },
//       choice2: { label: "Public air NFT", effects: { approval: +3, chaos: +2, ratAffinity: 0 } }
//     }), "1212");

//     // --- Days 11-15: Infrastructure collapses (identity, tech, statue tears) ---

//     // Day 11
//     this.insert(node({
//       title: "Day 11 — Statue of Liberty Weeps",
//       textLines: [
//         "The Statue of Liberty starts crying daily. The tabloids blame your climate rhetoric.",
//       ],
//       prompt: "Do you (1) reassure the city with an emotional speech or (2) study the phenomenon with scientists?",
//       choice1: { label: "Emotional speech", effects: { approval: +4, chaos: +2, ratAffinity: 0 } },
//       choice2: { label: "Study phenomenon", effects: { approval: +1, chaos: -1, ratAffinity: 0 } }
//     }), "12211");

//     // Day 12
//     this.insert(node({
//       title: "Day 12 — Sentient Grid Blackouts",
//       textLines: [
//         "The city's grid insists on a living wage and refuses to power luxury condos.",
//       ],
//       prompt: "Do you (1) negotiate a contract with the grid (yes, negotiate) or (2) force reset?",
//       choice1: { label: "Negotiate", effects: { approval: +3, chaos: -5, ratAffinity: 0 } },
//       choice2: { label: "Force reset", effects: { approval: -8, chaos: +15, ratAffinity: -2 } }
//     }), "12212");

//     // Day 13
//     this.insert(node({
//       title: "Day 13 — Subway Opera",
//       textLines: [
     
//         "Commuters are staged into a viral subway opera; critics love it but riders don't.",
//       ],
//       prompt: "Do you (1) fund the opera as cultural tourism or (2) issue commuter refunds?",
//       choice1: { label: "Fund opera", effects: { approval: +2, chaos: +3, ratAffinity: 0 } },
//       choice2: { label: "Refunds", effects: { approval: +5, chaos: -3, ratAffinity: 0 } }
//     }), "1112");

//     // Day 14
//     this.insert(node({
//       title: "Day 14 — Developers Auction Air Above Buildings (real chaos)",
//       textLines: [
//         "The auctions are chaotic. Protests emerge."
//       ],
//       prompt: "Do you (1) stop the auctions with emergency ordinance or (2) let market decide?",
//       choice1: { label: "Stop auctions", effects: { approval: +6, chaos: -6, ratAffinity: 0 } },
//       choice2: { label: "Let market decide", effects: { approval: -4, chaos: +8, ratAffinity: 0 } }
//     }), "1122");

//     // Day 15
//     this.insert(node({
//       title: "Day 15 — Your Clone Leads a Rally",
//       textLines: [
//         "Your clone organizes a flash mob asking for more authenticity in government.",
//       ],
//       prompt: "Do you (1) join your clone (performance art) or (2) denounce it?",
//       choice1: { label: "Join clone", effects: { approval: +7, chaos: +6, ratAffinity: 0 } },
//       choice2: { label: "Denounce", effects: { approval: -3, chaos: -2, ratAffinity: 0 } }
//     }), "12221");

//     // --- Days 16-19: Final Spiral ---

//     // Day 16
//     this.insert(node({
//       title: "Day 16 — You Lean In or Clamp Down",
//       textLines: [
   
//         "The city expects a tone. Your aides say: lean into absurdism or try to restore 'normal'."
//       ],
//       prompt: "Do you (1) embrace absurdism & make creative allies or (2) clamp down and restore order?",
//       choice1: { label: "Embrace absurdism", effects: { approval: +6, chaos: +5, ratAffinity: +5 } },
//       choice2: { label: "Restore order", effects: { approval: -4, chaos: -6, ratAffinity: -3 } }
//     }), "11111");

//     // Day 17
//     this.insert(node({
//       title: "Day 17 — Rat Pryor Endorsement",
//       textLines: [
//         "Rat Pryor offers endorsement in exchange for a 'Rat Arts' fund.",
//       ],
//       prompt: "Do you (1) accept the endorsement or (2) refuse it (principle)?",
//       choice1: { label: "Accept (Rat Arts)", effects: { ratAffinity: +15, approval: +3, chaos: +2 } },
//       choice2: { label: "Refuse", effects: { ratAffinity: -10, approval: -2, chaos: -1 } }
//     }), "11112");


//     // Day 19
//     this.insert(node({
//       title: "Day 19 — Final Polls Drop",
//       textLines: [
//         "Your opponent runs a surrealist ad featuring an animatronic Time Square Elmo with a Bloomberg impression.",
//       ],
//       prompt: "Do you (1) respond with a heartfelt policy speech or (2) release a weird viral ad?",
//       choice1: { label: "Policy speech", effects: { approval: +3, chaos: -2, ratAffinity: 0 } },
//       choice2: { label: "Weird viral ad", effects: { approval: +4, chaos: +4, ratAffinity: +2 } }
//     }), "1111211");

//     // Day 20: Final Decision — Endings are decided after this node
//     this.insert(node({
//       title: "Day 20 — The Debate / Final Message",
//       textLines: [
//         "The debate stage is set. Opponents include a deli cat named 'Chop Cheese 3000', a tweeting tree, and animatronic Elmo."
//       ],
//       prompt: "What's your closing message?",
//       choice1: { label: "\"New York is an idea that fights you back\" (grand speech)", effects: { approval: +5, chaos: -5, ratAffinity: 0 } },
//       choice2: { label: "\"Replace the NYPD with stage actors\" (confusing, bold)", effects: { approval: -6, chaos: +15, ratAffinity: 0 } }
//     }), "11112111");

 
//   } // end insertStory
// }

