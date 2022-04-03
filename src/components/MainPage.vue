<template>
<div>
    <h1 class='banner'>Prisoner's Dilemma Simulation</h1>
 
    <div v-show="showAddPlayerMenu" style=border-style:solid >
        <input v-model="newPlayer" placeholder="name" type="string" style=margin:10px>
        <button class='secondary-button' > Add Player To Simulation</button>
    </div>
    
    <button class='add-player-button' v-on:click="runSimAndDisplay"> Run Simulation </button>
    <br>
    <button class='add-player-button' v-on:click="displaySettings"> Settings </button>
    <div v-show="showSettingsMenu" style=left:10px>    
        <br>
        <h>Amount of Participents:</h>
        <input v-model="amount" placeholder="Amount of Participents:" style=margin:10px>
        <br>
        <h>Points when both cheat:</h>
        <input v-model="bothCheat" placeholder="Points when both cheat" style=margin:10px>
        <br>
        <h>Points when both cooperate:</h>
        <input v-model="bothCoop" placeholder="Points when both cooperate" style=margin:10px>
        <br>
        <h>Points when one cheats:</h>
        <input v-model="cheatWin" placeholder="Points when one cheats" style=margin:10px>
        <br>
        <h>Points when cheated:</h>
        <input v-model="getCheated" placeholder="Points when cheated" style=margin:10px>
        <br>
        <h>Chance of mistake:</h>
        <input v-model="mistakeChance" placeholder="Chance of mistake" style=margin:10px>
        <br>
        <h>Variance:</h>
        <input v-model="maxVariance" placeholder="Variance" style=margin:10px>
        <br>
        <h>Iterations:</h>
        <input v-model="iterations" placeholder="iterations" style=margin:10px>
        <br>
        <h>Amount killed per iteration:</h>
        <input v-model="amountKilled" placeholder="Amount Killed per Iteration" style=margin:10px>
        <br>
        <h>Trials:</h>
        <input v-model="trials" placeholder="Trials" style=margin:10px>
        
    </div>
    <div v-if="showAverage">
    <h1>Average After {{trials}} trials</h1>
    <ul>
        <li>{{toDisplay0}}</li>
        <li>{{toDisplay1}}</li>
        <li>{{toDisplay2}}</li>
        <li>{{toDisplay3}}</li>
        <li>{{toDisplay4}}</li>
        <li>{{toDisplay5}}</li>
    </ul>
    </div>

</div>
</template>

<script>
import { defineComponent } from '@vue/composition-api';
import Player from './Player.js';


export default defineComponent({
    setup() {
        
    },
    data(){
        return {
            showAddPlayerMenu: false,
            showSettingsMenu: false,
            playerList: ["Altruist: always cooperate", 
                             "Cynic: always defect", 
                             "Cooperative Copycat: cooperate first, copy the other player's last move", 
                             "Cycnical Copycat: defect first, copy the other player's last move",
                             "Grudge: Start cooperatively, but defect for the rest of the game if defected against",
                             "Gullible: Defect first, cooperate for the rest of the game if the other player cooperates"
                             ],
            newPlayer: "",
            players: Array(),
            scores: Array(),
            amount: 60,
            bothCoop: 30,
            bothCheat: 10,
            cheatWin: 50,
            getCheated: 0,
            mistakeChance: 0.0,
            maxVariance: 10,
            last1: 0,
            last2: 0,
            decision1: 0,
            decision2: 0,
            toDisplay0:"",
            toDisplay1:"",
            toDisplay2:"",
            toDisplay3:"",
            toDisplay4:"",
            toDisplay5:"",
            totalScores: [0, 0, 0, 0, 0, 0],
            amountKilled: 5,
            iterations: 20,
            trials: 10,
            showAverage:false,

        }
    },
    methods: {
        displayMenu(){
            if (this.showAddPlayerMenu){
                this.showAddPlayerMenu = false;
            } else {
                this.showAddPlayerMenu = true;
            }
        },
        displaySettings(){
            if (this.showSettingsMenu){
                this.showSettingsMenu = false;
            } else {
                this.showSettingsMenu = true;
            }
        },
        addPlayers(){
            this.players=[];
            this.scores=[];
            for (let i = 0; i < this.amount; i++) {
                this.players.push(new Player(Math.floor(i/(this.amount/6))));
                this.scores.push(0);
            }
        },
        score(i1, i2) {
            if (this.decision1 == 0 && this.decision2 == 0) {
                this.scores[i1] += this.bothCoop;
                this.scores[i2] += this.bothCoop;
            } else if (this.decision1 == 0 && this.decision2 == 1) {
                this.scores[i1] += this.getCheated;
                this.scores[i2] += this.cheatWin;
            } else if (this.decision1 == 1 && this.decision2 == 0) {
                this.scores[i1] += this.cheatWin;
                this.scores[i2] += this.getCheated;
            } else if (this.decision1 == 1 && this.decision2 == 1) {
                this.scores[i1] += this.bothCheat;
                this.scores[i2] += this.bothCheat;
            } 
            let variance = Math.trunc(Math.random() * (this.maxVariance + 1));
            if (Math.random() < 0.5) {
                variance *= -1;
            }
            this.scores[i1] += variance;
            this.scores[i2] -= variance;
        },
        runSimulation(){
            for (let i1 = 0; i1 < this.amount - 1; i1++) {
                for (let i2 = i1 + 1; i2 < this.amount; i2++) {
                    this.decision1 = this.players[i1].play(0, 0, true, this.mistakeChance);
                    this.decision2 = this.players[i2].play(0, 0, true, this.mistakeChance);
                    this.score(i1, i2);
                    this.last1 = this.decision1;
                    this.last2 = this.decision2;
                    for (let i = 0; i < 9; i++) {
                        this.decision1 = this.players[i1].play(this.last1, this.last2, false, this.mistakeChance);
                        this.decision2 = this.players[i2].play(this.last2, this.last1, false, this.mistakeChance);
                        this.score(i1, i2);
                        this.last1 = this.decision1;
                        this.last2 = this.decision2;
                    }
                }
            }
        },
        display(){
            let amountOfType = 0;
            for (let k = 0; k < 6; k++) {
                for (let i = 0; i < this.scores.length; i++) {
                    if (this.players[i].getType() == k) {
                        amountOfType++;
                    }
                }
                console.log(new Player(k).toString() + ": " + amountOfType);
                this.totalScores[k] += amountOfType;
                amountOfType = 0;
            }
            console.log();
        },
        runSimAndDisplay(){
            this.totalScores=[0, 0, 0, 0, 0, 0];
            for (let m=0; m<this.trials; m++){
                this.addPlayers();
                for (let x = 0; x < this.iterations; x++) {
                    for (let i = 0; i < this.scores.length; i++) {
                    this.scores[i] = 0;
                    }
                    this.runSimulation();
                    this.kill();
                    this.reproduce();
                }
                this.display();
            }
            console.log("Averages: \n");
            // for (let k = 0; k < 6; k++) {   
            //     this.toDisplay = this.toDisplay + "\n" + new Player(k).toString() + ": " + this.totalScores[k] / this.trials;
            // }
            this.toDisplay0 = new Player(0).toString() + ": " + this.totalScores[0] / this.trials;
            this.toDisplay1 = new Player(1).toString() + ": " + this.totalScores[1] / this.trials;
            this.toDisplay2 = new Player(2).toString() + ": " + this.totalScores[2] / this.trials;
            this.toDisplay3 = new Player(3).toString() + ": " + this.totalScores[3] / this.trials;
            this.toDisplay4 = new Player(4).toString() + ": " + this.totalScores[4] / this.trials;
            this.toDisplay5 = new Player(5).toString() + ": " + this.totalScores[5] / this.trials;
            this.showAverage = true;
            
            
        },
        kill() {
            for (let k = 0; k < this.amountKilled; k++) {
                let min = 0;
                for (let i = 1; i < this.scores.length; i++) {
                    if (this.scores[i] < this.scores[min]) {
                        min = i;
                    }
                }
                this.scores.splice(min, 1);
                this.players.splice(min, 1);
            }
        },
        reproduce() {
            for (let k = 0; k < this.amountKilled; k++) {
                let max = 0;
                for (let i = 1; i < this.scores.length; i++) {
                    if (this.scores[i] > this.scores[max]) {
                        max = i;
                    }
                }
                this.players.push(new Player(this.players[max].getType()));
                this.scores.push(0);
            }
        },
    }
})
</script>

<style scoped>
    .banner{
        text-align: center;
        font:bold; 
        top: 10%;
        

    }
    .add-player-menu{
        border: black;
        padding: 10px;
        margin: 10px;
        align-items: center;
        justify-content: center;
    }
    .add-player-button {
    position:relative;
    background-color: rgb(170, 228, 165);
    padding:10px;
    margin:20px;
    text-emphasis-color: white;
    border-radius: 10px;
    }
    .secondary-button{
        position:relative;
        background-color: rgb(157, 157, 157);
        padding:10px;
        margin:20px;
        text-emphasis-color: white;
        border-radius: 10px;
    }
</style>
