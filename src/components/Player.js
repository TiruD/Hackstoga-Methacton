class Player{          
  constructor(type) {
    this.type = type;
  }
  getType() {
    return this.type;
  }

  toString() {
    const names = ["Altruistic", "Cynic", "Coooperative Copycat", "Cynical Copycat", "Grudge", "Gullible"];
    return names[this.type];
  }

  play(ownLast, enemyLast, isStart, mistakeChance) {
    let toReturn;
    if (this.type == 0) {
      toReturn = 0;
    }
    if (this.type == 1) {
      toReturn = 1;
    }
    //initial plays
    if (isStart) {
      if (this.type == 2 || this.type == 4) {
        toReturn = 0;
      }
      if (this.type == 3 || this.type == 5) {
        toReturn = 1;
      }
    }
    
    if (this.type == 2 || this.type == 3) {
      toReturn = enemyLast;
    }
    if (this.type == 4) {
      if (enemyLast == 1 || ownLast == 1) {
        toReturn = 1;
      } else {
        toReturn = 0;
      }
    }
    if (this.type == 5) {
      if (enemyLast == 0 || ownLast == 0) {
        toReturn = 0;
      } else {
        toReturn = 1;
      }
    }

    if (Math.random() < mistakeChance) {
      return Math.abs(toReturn - 1);
    } else {
      return toReturn;
    }
  }
}

// function score() {
//   if (decision1 == 0 && decision2 == 0) {
//     scores[i1] += bothCoop;
//     scores[i2] += bothCoop;
//   } else if (decision1 == 0 && decision2 == 1) {
//     scores[i1] += getCheated;
//     scores[i2] += cheatWin;
//   } else if (decision1 == 1 && decision2 == 0) {
//     scores[i1] += cheatWin;
//     scores[i2] += getCheated;
//   } else if (decision1 == 1 && decision2 == 1) {
//     scores[i1] += bothCheat;
//     scores[i2] += bothCheat;
//   } 
//   let variance = Math.trunc(Math.random() * (maxVariance + 1));
//   if (Math.random() < 0.5) {
//     variance *= -1;
//   }
//   scores[i1] += variance;
//   scores[i2] -= variance;
// }

// let players = Array();
// let scores = Array();
// let amount = 60;
// let bothCoop = 30;
// let bothCheat = 10;
// let cheatWin = 50;
// let getCheated = 0;
// let mistakeChance = 0.0;
// let maxVariance = 10;
// let last1;
// let last2;
// let decision1;
// let decision2;
// for (i = 0; i < amount; i++) {
//   players.push(new Player(Math.floor(i/10)));
//   scores.push(0);
// }



// let toDisplay = "";
// for (i = 0; i < 6; i++) {
//   for (j = 0; j < 10; j++) {
//     toDisplay += scores[j + 10 * i] + " ";
//   }
//   toDisplay += players[i*10].toString();
//   console.log(toDisplay);
//   toDisplay = "";
// }
export default Player;