// export default class Node{
//     constructor(value){
//         this.data=value
//         this.left = null
//         this.right = null
//         this.center = null
//     }
 
// }
export default class Node {
  constructor(data = null) {
    this.data = data; // object with {title, textLines, prompt, choices: [{label, effects}]}
    this.left = null; // '1' path
    this.right = null; // '2' path
  }
}