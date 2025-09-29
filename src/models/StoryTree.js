// StoryTree.js
import ReactGA from "react-ga4";
import { getCookie } from "../cookie";
import Node from "./node";
// Simple Node class if you don't already have one


export default class StoryTree {
  constructor() {
    this.root = null;

    // Running scores
    this.scores = {
      ratAffinity: 0, // positive = pro-rat decisions
      approval: 50,   // 0-100 baseline
      chaos: 0        // 0-100
    };

    // optional history for UI or debugging
    this.history = [];
  }

  // Insert node data at a path string of '1' and '2'
  insert(data, path = "") {
    const newNode = new Node(data);
    if (this.root === null) {
      this.root = newNode;
      return;
    }

    let current = this.root;
    for (let i = 0; i < path.length; i++) {
      if (path[i] === "1") {
        if (!current.left) current.left = new Node(null);
        current = current.left;
      } else if (path[i] === "2") {
        if (!current.right) current.right = new Node(null);
        current = current.right;
      }
    }
    current.data = data;
  }

  // Apply effects to scores (effects can be partial: {ratAffinity: +10, approval: -5, chaos: +8})
  applyEffects(effects) {
    if (!effects) return;
    if (typeof effects.ratAffinity === "number") {
      this.scores.ratAffinity = Math.max(-100, Math.min(100, this.scores.ratAffinity + effects.ratAffinity));
    }
    if (typeof effects.approval === "number") {
      this.scores.approval = Math.max(0, Math.min(100, this.scores.approval + effects.approval));
    }
    if (typeof effects.chaos === "number") {
      this.scores.chaos = Math.max(0, Math.min(100, this.scores.chaos + effects.chaos));
    }
  }

  // Decide ending based on scores
  evaluateEnding() {
    const { ratAffinity, approval, chaos } = this.scores;

    // Simple deterministic rules (tweak to taste)
    if (chaos >= 70 || ratAffinity >= 70) {
      return {
        ending: "couped",
        title: "💀 Couped",
        text: `Chaos soared (${chaos}) and non-human factions aligned (${ratAffinity}). You're taken out mid-speech and thawed in a bodega freezer.`
      };
    }

    if (approval >= 60 && chaos <= 40) {
      return {
        ending: "reelected",
        title: "🏆 Reelected Mayor",
        text: `Voters loved your weird but functional performance. Approval: ${approval}, Rat Affinity:${ratAffinity}, Chaos: ${chaos}. The pizza rat salutes you.`
      };
    }

    // fallback: lost election
    return {
      ending: "lost",
      title: "❌ Lost the Election",
      text: `You fought hard. Approval: ${approval},Rat Affinity:${ratAffinity}, Chaos: ${chaos}.  The city voted for vibes over policy (and Elmo got 42%).`
    };
  }
  traverseAndPlay() {
  try {
    let current = this.root;
    let dayCounter = 0; // keep track of days

    if (!current) {
      alert("Story not loaded.");
      return null;
    }

    while (current && current.data) {
      const node = current.data;
      dayCounter++;

      // show narrative lines
      if (Array.isArray(node.textLines)) {
        node.textLines.forEach(line => {
          if (line) alert(line);
        });
      } else if (typeof node.textLines === "string") {
        alert(node.textLines);
      }

      // Show scores every 5 days
      if (dayCounter % 5 === 0) {
        alert(
          `--- Progress Report (Day ${dayCounter}) ---\n` +
          Object.entries(this.scores)
            .map(([k, v]) => `${k}: ${v}`)
            .join("\n")
        );
      }

      // If there are choices, prompt. Otherwise this is an ending node.
      if (node.choices && node.choices.length > 0) {
        let promptText = node.prompt || "Choose:";
        node.choices.forEach((c, idx) => {
          const key = idx === 0 ? "1" : "2";
          promptText += `\n(${key}) ${c.label}`;
        });

        const choice = prompt(promptText);

        if (choice === "1" || choice === "2") {
          const idx = choice === "1" ? 0 : 1;
          const chosen = node.choices[idx];

          // apply effects
          this.applyEffects(chosen.effects);

          // record history
          this.history.push({
            nodeTitle: node.title || `Day ${dayCounter}`,
            choice: chosen.label,
            effects: chosen.effects,
            scoresSnapshot: { ...this.scores }
          });

          // GA tracking
          try {
            ReactGA.event({
              category: "Story",
              action: `${node.title || `Day ${dayCounter}`} - ${chosen.label}`,
              label: getCookie("user_id"),
              value: idx + 1,
              nonInteraction: false
            });
          } catch (gaErr) {}

          // Move along tree
          current = idx === 0 ? current.left : current.right;
          continue;
        } else {
          alert("Invalid choice! Please choose '1' or '2'.");
          continue; // stay in same node
        }
      } else {
        if (node.conclusionText) alert(node.conclusionText);
        break;
      }
    }

    // Final ending
    const ending = this.evaluateEnding();
    alert(`${ending.title}\n\n${ending.text}`);

    try {
      ReactGA.event({
        category: "Story-End",
        action: ending.ending,
        label: getCookie("user_id"),
        nonInteraction: false
      });
    } catch (gaErr) {}

    return ending;
  } catch (e) {
    try {
      ReactGA.event({
        category: "Error",
        action: getCookie("user_id"),
        label: e.message,
        nonInteraction: true
      });
    } catch (_) {}
    console.error(e);
    alert("An error occurred. Check console.");
    return null;
  }
}

// traverseAndPlay(scores, onEnd) {
//   try {
//     let current = this.root;
//     let dayCounter = 0;

//     while (current) {
//       // Loop through the narrative lines
//       for (let i = 0; i < current.data.length - 1; i++) {
//         const line = current.data[i];

//         // Detect a new "Day"
//         if (line.startsWith("Day")) {
//           dayCounter++;

//           // Every 5 days, show scores
//           if (dayCounter % 5 === 0) {
//             alert(
//               `📊 Score Update (Day ${dayCounter}):\n\n` +
//               `🐀 Rat Affinity: ${scores.ratAffinity}\n` +
//               `📈 Approval Rating: ${scores.approvalRating}\n` +
//               `🔥 Chaos Index: ${scores.chaosIndex}`
//             );
//           }
//         }

//         alert(line);
//       }

//       // If choices exist
//       if (current.left || current.right) {
//         const choice = prompt(current.data[current.data.length - 1]);

//         if (choice === '1') {
//           // Example scoring — tweak per branch
//           scores.chaosIndex += 1;
//           scores.approvalRating += 2;
//           current = current.left;
//         } else if (choice === '2') {
//           scores.ratAffinity += 2;
//           scores.approvalRating -= 1;
//           current = current.right;
//         } else {
//           alert("Invalid choice! Please choose '1' or '2'.");
//         }
//       } else {
//         // End of path
//         onEnd(scores);
//         break;
//       }
//     }
//   } catch (e) {
//     ReactGA.event({
//       category: "Error",
//       action: getCookie("user_id"),
//       label: e.message,
//       nonInteraction: true,
//     });
//   }
// }

  // Traverse the tree interactively. Uses prompt/alert as in your original.
  // Returns final ending object.
  // traverseAndPlay() {
  //   try {
  //     let current = this.root;
  //     if (!current) {
  //       alert("Story not loaded.");
  //       return null;
  //     }

  //     while (current && current.data) {
  //       const node = current.data;

  //       // show narrative lines (alerts keep behavior similar to your old code)
  //       if (Array.isArray(node.textLines)) {
  //         node.textLines.forEach(line => {
  //           if (line) alert(line);
  //         });
  //       } else if (typeof node.textLines === "string") {
  //         alert(node.textLines);
  //       }

  //       // If there are choices, prompt. Otherwise this is an ending node.
  //       if (node.choices && node.choices.length > 0) {
  //         // Build prompt string with options
  //         let promptText = node.prompt || "Choose:";
  //         node.choices.forEach((c, idx) => {
  //           const key = idx === 0 ? "1" : "2";
  //           promptText += `\n(${key}) ${c.label}`;
  //         });

  //         const choice = prompt(promptText);

  //         // Validate
  //         if (choice === "1" || choice === "2") {
  //           const idx = choice === "1" ? 0 : 1;
  //           const chosen = node.choices[idx];

  //           // apply effects
  //           this.applyEffects(chosen.effects);

  //           // record history
  //           this.history.push({
  //             nodeTitle: node.title || "Day",
  //             choice: chosen.label,
  //             effects: chosen.effects,
  //             scoresSnapshot: { ...this.scores }
  //           });

  //           // GA event (keeps your existing tracking)
  //           try {
  //             ReactGA.event({
  //               category: "Story",
  //               action: `${node.title || "Day"} - ${chosen.label}`,
  //               label: getCookie("user_id"),
  //               value: idx + 1,
  //               nonInteraction: false
  //             });
  //           } catch (gaErr) {
  //             // swallow GA errors
  //           }

  //           // Move along tree
  //           current = idx === 0 ? current.left : current.right;
  //           continue;
  //         } else {
  //           alert("Invalid choice! Please choose '1' or '2'.");
  //           // loop and re-prompt the same node (or you could skip)
  //           continue;
  //         }
  //       } else {
  //         // leaf node — show conclusion content (if any)
  //         if (node.conclusionText) alert(node.conclusionText);
  //         break;
  //       }
  //     } // end while

  //     // Evaluate final ending
  //     const ending = this.evaluateEnding();

  //     // Final messages
  //     alert(`${ending.title}\n\n${ending.text}`);
  //     // log final GA
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

  // ---------- Insert full 20-day story tree ----------
  // This is a best-effort full tree with two choices each day.
  // Each choice carries effects: {ratAffinity:+/-n, approval:+/-n, chaos:+/-n}
  // Paths follow the pattern: root = '', day1 choice1 -> '1', day1 choice2 -> '2', etc.
  insertStory() {
      const { ratAffinity, approval, chaos } = this.scores;
    // helper to shorten node building
    const node = ({ title, textLines, prompt, choice1, choice2, conclusionText }) => ({
      title,
      textLines,
      prompt,
      choices: [
        { label: choice1.label, effects: choice1.effects },
        { label: choice2.label, effects: choice2.effects }
      ],
      conclusionText
    });

    // Day 1
    this.insert(node({
      title: "Day 1 — Ratmeggedon Begins",
      textLines: [
        "You're the mayor of New York City.",
        "Giant rats powered by radioactive diamond dust have lost their sense of danger.",
        "City morale is low and the tabloids love it.",
        "Your Chief of Staff suggests a bold move to control the rats."
      ],
      prompt: "Do you (1) poison the rats to show toughness or (2) give them pizza to keep them placated?",
      choice1: { label: "Poison the rats (show strength)", effects: { ratAffinity: -20, approval: +2, chaos: +15 } },
      choice2: { label: "Feed them pizza (appease them)", effects: { ratAffinity: +20, approval: -3, chaos: +5 } }
    }), "");

    // Day 2 (1) -> after poison

    
    this.insert(node({
      title: "Day 2 — Needle Duels or Gambling?",
      textLines: [
        
        "Poison made rats inebriated but not incapacitated.",
        "Rats are laughing in the sewers — your Chief asks for Plan B."
      ],
      prompt: "Do you (1) give them needles for rat duels (tough, weird), or (2) introduce rat gambling to control them?",
      choice1: { label: "Needle duels", effects: { ratAffinity: -10, approval: -5, chaos: +20 } },
      choice2: { label: "Introduce gambling", effects: { ratAffinity: +10, approval: -2, chaos: +10 } }
    }), "1");

    // Day 2 (2) -> after pizza
    this.insert(node({
      title: "Day 2 — Pizza At Home",
      textLines: [

        "Rats enjoy pizza at home. They are less visible in public.",
        "Your advisors say we need to shape their public behavior."
      ],
      prompt: "Do you (1) lure rats to Long Island (relocate) or (2) offer them cup noodles (domesticate taste)?",
      choice1: { label: "Relocate them to Long Island", effects: { ratAffinity: -5, approval: +3, chaos: -5 } },
      choice2: { label: "Cup noodles", effects: { ratAffinity: +15, approval: -1, chaos: +2 } }
    }), "2");

    // Day 3 nodes (11,12,21,22)
    // 11 (1->1)
    this.insert(node({
      title: "Day 3 — Deadly Rat Aristocracy",
      textLines: [
       "Needle duels backfired: rats evolve into a class with canes and monocles.",
        "They form the Ratstors and start funding both campaigns."
      ],
      prompt: "Do you (1) accept their donations (legitimize) or (2) outlaw rat ownership of LLCs?",
      choice1: { label: "Accept donations", effects: { ratAffinity: +25, approval: -20, chaos: +10 } },
      choice2: { label: "Outlaw rat LLCs", effects: { ratAffinity: -20, approval: +5, chaos: +5 } }
    }), "11");

    // 12 (1->2)
    this.insert(node({
      title: "Day 3 — Rat Casino",
      textLines: [
     "Your gambling plan created a rat casino under an old McDonald's. Rat-on-rat crime spikes.",
        "Humans complain about the smell of mint juleps and pocket change."
      ],
      prompt: "Do you (1) shut the casino down or (2) regulate and tax it?",
      choice1: { label: "Shut it down", effects: { ratAffinity: -15, approval: +5, chaos: -10 } },
      choice2: { label: "Regulate & tax", effects: { ratAffinity: +5, approval: +3, chaos: +8 } }
    }), "12");

    // 21 (2->1)
    this.insert(node({
      title: "Day 3 — Ratsville, Long Island",
      textLines: [
     
        "Rats move to Long Island and form Ratsville.",
        "They develop tastes in aged prosciutto — budget crisis looms."
      ],
      prompt: "Do you (1) source prosciutto from Little Italy (expensive) or (2) negotiate with Costco?",
      choice1: { label: "Little Italy", effects: { ratAffinity: +5, approval: -5, chaos: +3 } },
      choice2: { label: "Costco bulk deal", effects: { ratAffinity: -2, approval: +4, chaos: +1 } }
    }), "21");

    // 22 (2->2)
    this.insert(node({
      title: "Day 3 — Rat Open Mic",
      textLines: [
      
        "Cup noodles yielded comedians. Rat Pryor is trending with a bit about pizza patriarchy.",
        "Press asks for comment."
      ],
      prompt: "Do you (1) deflect and call for focus, or (2) praise New York humor?",
      choice1: { label: "Deflect", effects: { ratAffinity: -5, approval: +1, chaos: +2 } },
      choice2: { label: "Praise humor", effects: { ratAffinity: +5, approval: +2, chaos: -2 } }
    }), "22");

    // Day 4 nodes (111,112,121,122,211,212,221,222)
    // Keep building — to avoid an explosion of unique content I'll write them concisely but meaningfully.

    // 111 (1->1->1)
    this.insert(node({
      title: "Day 4 — Ratstors & Donations",
      textLines: [
        "Accepting rat money creates scandals: 'Mayor funded by vermin' headlines.",
      ],
      prompt: "Do you (1) hold a transparency press conference or (2) quietly accept and promise oversight?",
      choice1: { label: "Transparency", effects: { approval: +6, chaos: -5, ratAffinity: -5 } },
      choice2: { label: "Quiet accept", effects: { approval: -10, chaos: +8, ratAffinity: +10 } }
    }), "111");

    // 112 (1->1->2)
    this.insert(node({
      title: "Day 4 — Outlaw Rat LLCs",
      textLines: [
        "You outlaw rat LLCs. Rat lawyers sue you in small claims courts across boroughs.",
      ],
      prompt: "Do you (1) fight it in court or (2) propose a Compromise: Rat Permits?",
      choice1: { label: "Fight in court", effects: { approval: -3, chaos: +10, ratAffinity: -15 } },
      choice2: { label: "Rat permits", effects: { approval: +3, chaos: -4, ratAffinity: -5 } }
    }), "112");

    // 121 (1->2->1)
    this.insert(node({
      title: "Day 4 — Shutdown Backlash",
      textLines: [
        "Shutting the rat casino triggers nightlife protests: 'anti-vivisection nightlife' shows up.",
      ],
      prompt: "Do you (1) offer alternative venues or (2) crack down on protests?",
      choice1: { label: "Offer venues", effects: { approval: +4, chaos: -5, ratAffinity: +2 } },
      choice2: { label: "Crack down", effects: { approval: -8, chaos: +10, ratAffinity: -5 } }
    }), "121");

    // 122 (1->2->2)
    this.insert(node({
      title: "Day 4 — Regulate & Tax",
      textLines: [
        "Regulation brings revenue. Rat unions demand benefits.",
      ],
      prompt: "Do you (1) grant benefits or (2) deny union status?",
      choice1: { label: "Grant benefits", effects: { approval: +2, chaos: +2, ratAffinity: +10 } },
      choice2: { label: "Deny union status", effects: { approval: -5, chaos: +6, ratAffinity: -10 } }
    }), "122");

    // 211 (2->1->1)
    this.insert(node({
      title: "Day 4 — Arthur Ave Hopes",
      textLines: [
        "You try Little Italy — it's now a gelato stand. The pasta artisans left town.",
      ],
      prompt: "Do you (1) incentivize artisanal prosciutto or (2) pivot to honey-glazed rat diets?",
      choice1: { label: "Incentivize prosciutto", effects: { approval: -2, chaos: +3, ratAffinity: +5 } },
      choice2: { label: "Honey-glazed", effects: { approval: +1, chaos: -1, ratAffinity: -3 } }
    }), "211");

    // 212 (2->1->2)
    this.insert(node({
      title: "Day 4 — Costco Terms",
      textLines: [
        "Costco demands school hot dogs in return. Parents riot in the suburbs.",
      ],
      prompt: "Do you (1) give kids hot dogs or (2) refuse and search other suppliers?",
      choice1: { label: "Hot dogs for kids", effects: { approval: -6, chaos: +5, ratAffinity: +8 } },
      choice2: { label: "Refuse & search suppliers", effects: { approval: +4, chaos: -2, ratAffinity: -2 } }
    }), "212");

    // 221 (2->2->1)
    this.insert(node({
      title: "Day 4 — Deflect Press",
      textLines: [
        "Deflecting causes media to paint you aloof. Young voters grumble.",
      ],
      prompt: "Do you (1) perform a viral bit to win back hearts or (2) stay statesmanlike?",
      choice1: { label: "Viral bit", effects: { approval: +6, chaos: +5, ratAffinity: +3 } },
      choice2: { label: "Statesmanlike", effects: { approval: -2, chaos: -1, ratAffinity: -2 } }
    }), "221");

    // 222 (2->2->2)
    this.insert(node({
      title: "Day 4 — Praise Humor",
      textLines: [
        "Praising humor wins some hearts but anger the conservative editorial pages.",
      ],
      prompt: "Do you (1) host a borough comedy tour or (2) double-down on policy memos?",
      choice1: { label: "Comedy tour", effects: { approval: +8, chaos: +2, ratAffinity: +5 } },
      choice2: { label: "Policy memos", effects: { approval: -1, chaos: -1, ratAffinity: -2 } }
    }), "222");


    this.insert(node({
      title: "Day 5 — Staten Island Independence",
      textLines: [
        "Staten Island threatens secession and forms a militia of former mall Santas.",
      ],
      prompt: "Do you (1) negotiate autonomy or (2) send in negotiators with bagels and backrub coupons?",
      choice1: { label: "Negotiate autonomy", effects: { approval: -5, chaos: +10, ratAffinity: 0 } },
      choice2: { label: "Bagels & backrubs", effects: { approval: +6, chaos: -3, ratAffinity: 0 } }
    }), "1111");

    // 1112
    this.insert(node({
      title: "Day 5 — Times Square Elmo Union",
      textLines: [
        "Elmos demand dental. Mid-town gets theatrical.",
      ],
      prompt: "Do you (1) meet demands or (2) create minimum-elmo standards?",
      choice1: { label: "Meet demands", effects: { approval: +5, chaos: +2, ratAffinity: 0 } },
      choice2: { label: "Min standards", effects: { approval: -3, chaos: +5, ratAffinity: 0 } }
    }), "1112");

    // 1121
    this.insert(node({
      title: "Day 5 — Billionaires Into Sewers",
      textLines: [
        "Billionaires move into the sewers to dodge taxes — rats sue the billionaires.",
      ],
      prompt: "Do you (1) tax sewer dwellings or (2) offer them art-subsidy deals?",
      choice1: { label: "Tax them", effects: { approval: +3, chaos: +8, ratAffinity: -5 } },
      choice2: { label: "Art-subsidy", effects: { approval: -2, chaos: -2, ratAffinity: +2 } }
    }), "1121");

    // 1222
    this.insert(node({
      title: "Day 5 — Pigeon Social Network 'CooTalk'",
      textLines: [
        "Pigeons radicalize teens with a platform of nested coos.",
      ],
      prompt: "Do you (1) treat pigeons as influencers (P.I.D.G.E.O.N. Act) or (2) partner with them for education?",
      choice1: { label: "P.I.D.G.E.O.N. Act", effects: { approval: -4, chaos: +6, ratAffinity: -3 } },
      choice2: { label: "Partner for education", effects: { approval: +5, chaos: -3, ratAffinity: 0 } }
    }), "1222");

    // --- Days 6-10: Human Mayhem (more variety) ---

    // Day 6 (one representative node inserted in a few branches)
    this.insert(node({
      title: "Day 6 — NFT Air & Stats",
      textLines: [
     
        "Developers sell NFTs for slices of sky. You get calls from the MTA AI, now quoting Sartre.",
      ],
      prompt: "Do you (1) regulate NFTs of air or (2) embrace and create a 'Sky Commons' fund?",
      choice1: { label: "Regulate NFTs", effects: { approval: +4, chaos: -5, ratAffinity: -2 } },
      choice2: { label: "Sky Commons fund", effects: { approval: +2, chaos: +3, ratAffinity: 0 } }
    }), "1211"); // attach under earlier path

    // Day 7
    this.insert(node({
      title: "Day 7 — MTA AI Quoting Sartre",
      textLines: [
        
        "Subways stop for long monologues. Commuters are split between existential dread and applause.",
      ],
      prompt: "Do you (1) patch the AI or (2) declare a 'Philosophy on the Q' festival?",
      choice1: { label: "Patch the AI", effects: { approval: +3, chaos: -6, ratAffinity: 0 } },
      choice2: { label: "Festival", effects: { approval: +5, chaos: +4, ratAffinity: 0 } }
    }), "1221");

    // Day 8
    this.insert(node({
      title: "Day 8 — Flooding Because Brooklyn 'Stole Weather'",
      textLines: [
        "Parts of Manhattan flood. Brooklyn tweets: 'we didn't do it'."
      ],
      prompt: "Do you (1) blame Brooklyn & appoint a Weather Czar or (2) build a coalition of boroughs?",
      choice1: { label: "Blame Brooklyn", effects: { approval: -8, chaos: +10, ratAffinity: -2 } },
      choice2: { label: "Coalition", effects: { approval: +6, chaos: -4, ratAffinity: 0 } }
    }), "2112");

    // Day 9
    this.insert(node({
      title: "Day 9 — Clone Appears",
      textLines: [
        "A clone claims to be the 'real' mayor. Media goes wild.",
      ],
      prompt: "Do you (1) prove it's a clone publicly or (2) let them debate you on live TV?",
      choice1: { label: "Prove clone", effects: { approval: +3, chaos: -5, ratAffinity: 0 } },
      choice2: { label: "Debate on TV", effects: { approval: +1, chaos: +8, ratAffinity: 0 } }
    }), "2121");

    // Day 10
    this.insert(node({
      title: "Day 10 — Developers Sell Air NFTs",
      textLines: [
          "The real estate market sells intangible assets; the press calls it 'airbnb for nothing'."
      ],
      prompt: "Do you (1) tax them aggressively or (2) create a 'public air' NFT to fund schools?",
      choice1: { label: "Tax aggressively", effects: { approval: +2, chaos: +5, ratAffinity: -1 } },
      choice2: { label: "Public air NFT", effects: { approval: +3, chaos: +2, ratAffinity: 0 } }
    }), "1212");

    // --- Days 11-15: Infrastructure collapses (identity, tech, statue tears) ---

    // Day 11
    this.insert(node({
      title: "Day 11 — Statue of Liberty Weeps",
      textLines: [
        "The Statue of Liberty starts crying daily. The tabloids blame your climate rhetoric.",
      ],
      prompt: "Do you (1) reassure the city with an emotional speech or (2) study the phenomenon with scientists?",
      choice1: { label: "Emotional speech", effects: { approval: +4, chaos: +2, ratAffinity: 0 } },
      choice2: { label: "Study phenomenon", effects: { approval: +1, chaos: -1, ratAffinity: 0 } }
    }), "12211");

    // Day 12
    this.insert(node({
      title: "Day 12 — Sentient Grid Blackouts",
      textLines: [
        "The city's grid insists on a living wage and refuses to power luxury condos.",
      ],
      prompt: "Do you (1) negotiate a contract with the grid (yes, negotiate) or (2) force reset?",
      choice1: { label: "Negotiate", effects: { approval: +3, chaos: -5, ratAffinity: 0 } },
      choice2: { label: "Force reset", effects: { approval: -8, chaos: +15, ratAffinity: -2 } }
    }), "12212");

    // Day 13
    this.insert(node({
      title: "Day 13 — Subway Opera",
      textLines: [
     
        "Commuters are staged into a viral subway opera; critics love it but riders don't.",
      ],
      prompt: "Do you (1) fund the opera as cultural tourism or (2) issue commuter refunds?",
      choice1: { label: "Fund opera", effects: { approval: +2, chaos: +3, ratAffinity: 0 } },
      choice2: { label: "Refunds", effects: { approval: +5, chaos: -3, ratAffinity: 0 } }
    }), "1112");

    // Day 14
    this.insert(node({
      title: "Day 14 — Developers Auction Air Above Buildings (real chaos)",
      textLines: [
        "The auctions are chaotic. Protests emerge."
      ],
      prompt: "Do you (1) stop the auctions with emergency ordinance or (2) let market decide?",
      choice1: { label: "Stop auctions", effects: { approval: +6, chaos: -6, ratAffinity: 0 } },
      choice2: { label: "Let market decide", effects: { approval: -4, chaos: +8, ratAffinity: 0 } }
    }), "1122");

    // Day 15
    this.insert(node({
      title: "Day 15 — Your Clone Leads a Rally",
      textLines: [
        "Your clone organizes a flash mob asking for more authenticity in government.",
      ],
      prompt: "Do you (1) join your clone (performance art) or (2) denounce it?",
      choice1: { label: "Join clone", effects: { approval: +7, chaos: +6, ratAffinity: 0 } },
      choice2: { label: "Denounce", effects: { approval: -3, chaos: -2, ratAffinity: 0 } }
    }), "12221");

    // --- Days 16-19: Final Spiral ---

    // Day 16
    this.insert(node({
      title: "Day 16 — You Lean In or Clamp Down",
      textLines: [
   
        "The city expects a tone. Your aides say: lean into absurdism or try to restore 'normal'."
      ],
      prompt: "Do you (1) embrace absurdism & make creative allies or (2) clamp down and restore order?",
      choice1: { label: "Embrace absurdism", effects: { approval: +6, chaos: +5, ratAffinity: +5 } },
      choice2: { label: "Restore order", effects: { approval: -4, chaos: -6, ratAffinity: -3 } }
    }), "11111");

    // Day 17
    this.insert(node({
      title: "Day 17 — Rat Pryor Endorsement",
      textLines: [
        "Rat Pryor offers endorsement in exchange for a 'Rat Arts' fund.",
      ],
      prompt: "Do you (1) accept the endorsement or (2) refuse it (principle)?",
      choice1: { label: "Accept (Rat Arts)", effects: { ratAffinity: +15, approval: +3, chaos: +2 } },
      choice2: { label: "Refuse", effects: { ratAffinity: -10, approval: -2, chaos: -1 } }
    }), "11112");

    // Day 18
    this.insert(node({
      title: "Day 18 — A Rogue Militia (or Billionaire DAO)",
      textLines: [
        "A rogue Staten Island militia (or SIRF) attempts to execute a symbolic takeover.",
      ],
      prompt: "Do you (1) negotiate with leaders or (2) call in improv actors to confuse them?",
      choice1: { label: "Negotiate", effects: { approval: +4, chaos: -8, ratAffinity: 0 } },
      choice2: { label: "Improv actors", effects: { approval: -2, chaos: +10, ratAffinity: 0 } }
    }), "111121");

    // Day 19
    this.insert(node({
      title: "Day 19 — Final Polls Drop",
      textLines: [
        "Your opponent runs a surrealist ad featuring an animatronic Time Square Elmo with a Bloomberg impression.",
      ],
      prompt: "Do you (1) respond with a heartfelt policy speech or (2) release a weird viral ad?",
      choice1: { label: "Policy speech", effects: { approval: +3, chaos: -2, ratAffinity: 0 } },
      choice2: { label: "Weird viral ad", effects: { approval: +4, chaos: +4, ratAffinity: +2 } }
    }), "1111211");

    // Day 20: Final Decision — Endings are decided after this node
    this.insert(node({
      title: "Day 20 — The Debate / Final Message",
      textLines: [
        "The debate stage is set. Opponents include a deli cat named 'Chop Cheese 3000', a tweeting tree, and animatronic Elmo."
      ],
      prompt: "What's your closing message?",
      choice1: { label: "\"New York is an idea that fights you back\" (grand speech)", effects: { approval: +5, chaos: -5, ratAffinity: 0 } },
      choice2: { label: "\"Replace the NYPD with stage actors\" (confusing, bold)", effects: { approval: -6, chaos: +15, ratAffinity: 0 } }
    }), "11112111");

 
  } // end insertStory
}

