
import Node from "./node";
import ReactGA from "react-ga4"
import { getCookie } from "../cookie";
export default class StoryTree {
    constructor() {
      this.root = null;
    }
  
    // Function to insert a new node into the tree
    insert(data, path = "") {
      const newNode = new Node(data);
      if (this.root === null) {
        this.root = newNode;
      } else {
        let current = this.root;
        for (let i = 0; i < path.length; i++) {
          if (path[i] === '1') {
            if (!current.left) current.left = new Node(null);  // Create node if it doesn't exist
            current = current.left;
          } else if (path[i] === '2') {
            if (!current.right) current.right = new Node(null);
            current = current.right;
          }
          // else{
          //   if (!current.center) current.center = new Node(null);
          //   current = current.center
          // }
        }
        current.data = data;  // Set the story point or choice at the node
      }
    }
  
    traverseAndPlay() {
      try{
        let current = this.root;
        while (current) {
         
            for(let i=0;i<current.data.length-1;i++){
                alert(current.data[i])
            }

            if (current.left || current.right) {
             
            const choice = prompt(current.data[current.data.length-1])
            if (choice === '1') {
              ReactGA.event({
                category: "Story",
                action: current.data,
                label: getCookie("user_id"),
                value:1, 
                nonInteraction: false, 
              });
              current = current.left;
            } else if (choice === '2') {
              ReactGA.event({
                category: "Story",
                action:current.data, 
                label: getCookie("user_id"),
                value: '2', 
                nonInteraction: false, 
              });
              current = current.right;
            } else {
              alert("Invalid choice! Please choose '1' or '2'.");
            }
          } else {
            // End of path, no more choices
            alert("The End!");
            break;
          }
        }
      }catch(e){
        ReactGA.event({
          category: "Error",
          action:getCookie("user_id"),
          label:e.message, 
      
          nonInteraction: true, 
        });
        // console.log(e)
      }
      }
      insertStory(){
        this.insert(["Day 1","You're the mayor of New York City." 
   +" City in crisis due to giant rats powered by radioactive diamond dust and lost their sense of danger."
   +" What will you do? Here comes your chief of staff",
   "Do you want to (1) poison the rats or give them (2) pizza?"
  ])
       this.insert(["You put poison in the rats drinking water",
      "Rats are inebrieted but not inccapacitated","Day 2","The rats are laughing,"+
       " move to plan b."+
        " Do you want to (1) give them needles"+
        " for little rat duels or (2) introduce gambling?"],"1")

        this.insert(["Rats have stopped fighting now that each is deadlier,"+
           " they use needles as walking sticks.",
        "Rats move up the class ladder of New York."+
        "They are now known as the Ratstors",
       "They fund your election and your opponents. That way they always come up on top."+
      "You lose elections, it's the way the wind blows. You're no longer mayor",
       "Congrats Goodbye"],"11")
       this.insert(["You have introduced gambling."+
       " Got your hands greased,"+
       " and greased some hands and opened a casino.",
       "The casion opens under the former McDonalds near Times Square.",
        "The rats are having too much fun. Rat on Rat crime increases. More dead rats but more rats keep coming",
       "Spike in crime under your period creates an unprecedented electoral loss for you. Go lick your wounds. Stay away from rats."
       ,"Good Luck Goodbye"],"12")
      this.insert(["You give the rats pizza,"
          +" rats have pizza regaularly."+
          " Rats are in public less and are eating more pizza at home.",
          "Day 2","You move to next"+
           "phase of Ratmeggedon, will you (1) lure the rats outside"+
          " the city to Long Island or (2) give them cup noodles?"],"2")
          this.insert(["Rats have been given cup noodles. Rats get high blood pressue.",
          "Rats die young from getting up to fast."
                  +"The survivors become sluggish but hilarious.",
                  "Day 3",
                 "Rat start comedy open mic. Rats start Rat Jam open mic.",
        "One becomes popular as Rat Pryor. Rat Pryor says there is no beef on the pizza, just on your face.",
        "You're asked about the comment at a press conference. 'Mayor how do you feel?'",
        "(1) 'We got bigger things to worry about than name calling"
        +"like protecting the community' or \n (2)'New Yorkers are known "+
        "for their sense of humor, and that's what makes this city great.'"],"22")
        this.insert(["Day 4",
        "Community Board:The people are complaining about mocking rats."
        +" They just sit near the curb and laugh. Menacingly",
        "Sir, what will you do"+
            "(1) citywide campaign against public mocking or"+
              " (2) install noisy mosquitoes that only rats can hear?"],"222")
       this.insert([
        "Day 4",
        "Community Board:The people are complaining about mocking rats. They just sit near the curb and laugh. Menacingly",
       "Sir, what will you do"+
           "(1) citywide campaign against public mocking or"+
             " (2) install noisy mosquitoes that only rats can hear?"
       ],"221")
       this.insert(["You spend tax dollars on anti mocking campaign. People mock anti mocking campaign"
       ,"It is ineffectual.",
         "You get to mayor another day.","To Be Continued..."],"2221")
              this.insert(["Mosquitoes make high pitch noise. Rats scurry back inside.",
             "Kids can also hear it. Kids cry because painful ears. Teens don't congregate.",
             "Parents near the mosquitoes can't sleep because of kids"+
             "Parents don't know why kids cry when ever they open a window...",
             // "Day 3",
            "Keep a low profile to stay off parents radar."
            ,"You get to be mayor another day."
            // +"Do you go to the (1) Serbian Parade or (2) 20/20 Club?."
             ,"To Be Continued.."         
           ],"2222")
       this.insert(["You spend tax dollars on anti mocking campaign. People mock anti mocking campaign"
,"It is ineffectual.",
  "You get to mayor another day.","To Be Continued..."],"2211")
       this.insert(["Mosquitoes make high pitch noise that makes rats scurry inside.",
      "Kids can also hear it. Kids cry because painful ears. Teens don't congregate.",
      "Parents near the mosquitoes can't sleep because of kids"+
      "Parents don't know why kids cry when ever they open a window...",
      // "Day 3",
     "Keep a low profile to stay off parents radar."
     ,"You get to be mayor another day."
     // +"Do you go to the (1) Serbian Parade or (2) 20/20 Club?."
      ,"To Be Continued.."         
    ],"2212")
      
       this.insert(["Rats have moved to Long Island."+
       " They make a town call Ratsville."+
       " They are happy with their pizza.",
       "Day 3"
       ,"Rats pick up terrible habits like aderral "+
       "and aged prosciutto.",
       "City Budget did not account for rat taste."+
         "You now need to find aged prosciutto at a city budget.",
         "Do you go to (1) the city's little italy or (2) Costco?"
       ],"21")
      this.insert(["Little Italy is now a gelato stand.",
      "No prosciutto",
      "To Be Continued... \n"+
      "Arthur Ave or Bensonhurst"
      // "Do you go to go to Arthur Ave. (1) or Bensonhurst(2)?"
      ],"211")
      this.insert(["You go to Costco in Long Island City.",
      "You try make a deal for bulk order proscuitto.",
        "Costco says they'll do it if you get Costco Hot Dogs in school",
        // "To Be Continued..."
        
        "Do you (1) agree let's get kids some hot dogs or (2) no hot dogs for kids?"

      ],"212")
    
      this.insert([
        "Kids get Hot Dogs.","No questions are asked, but expectations are rasied by kids, lowered by parents.",
        "Day 5",
        "Rats kept eating pizza. They start pizza delivery company."+
        "The Rats fund your opponent and you in the next election."+
        "The Rats go nowhere with pizza delivery, and become the new"+
        " Dutch of New York and furniture retailer that also sells merch."+
        " Good luck "
      ],"2121")
      this.insert([
        "No hot dogs for kids. You don't get porsciutto. Rats live without prosciutto.",
        "They instead move to hot honey.",
        "Day 5",
      "Rats kept eating pizza. They start pizza delivery company."+
      "The Rats fund your opponent and you in the next election."+
      "The Rats go nowhere with pizza delivery, and become the new"+
      " Dutch of New York and furniture retailer that also sells merch."+
      " Good luck "
    ],"2122")
      
      }
  }
  