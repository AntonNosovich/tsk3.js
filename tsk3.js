const readline = require('readline-sync');
const crypto = require('crypto');
class game {
    constructor(moves) {
        this.moves = moves;
    }

    Win(user_c, c, s) {

        if (user_c >= this.getRangeOfComputerLoose(c, s)[0] && user_c <= this.getRangeOfComputerLoose(c, s)[1]) {

            return "Win!";
        } else return "Loose!";

    }

    Losing(user_c, c, s) {

        if (user_c >= this.getRangeOfComputerWin(c, s)[0] && user_c <= this.getRangeOfComputerWin(c, s)[1]) {
            return "Loose!";
        } else return "Win!";
    }

    getStep(a) {
        let b = Math.floor(a.length / 2);
        return b;
    }

    getRangeOfComputerLoose(computer_choise, step) {

        let start = computer_choise + 1;
        let end = computer_choise + step;
        return [start, end]
    }

    getRangeOfComputerWin(computer_choise, step) {

        let start = computer_choise - step;
        let end = computer_choise - 1;
        return [start, end]
    }

    getResult(moves, choise_p, computer_choise, step = this.getStep(moves)) {
        if (choise_p == computer_choise) {
            return "Draw!";
        } else if (computer_choise < moves.length - step) {
            return this.Win(choise_p, computer_choise, step);
        } else if (computer_choise >= moves.length - step) {
            return this.Losing(choise_p, computer_choise, step);
        }
    }

    getComputerMove(a = this.moves.length) {
        let b = Math.floor(Math.random() * (a));
        return b;
    }



}
class tableGeneration extends game {
    makeTable(moves) {
        let table = []
        for (let i = 0; i < moves.length; i++) {
            table[i] = [];

        }
        table[0][0] = "Moves";
        for (let i = 1; i < moves.length; i++) {
            table[0][i] = moves[i - 1]
            table[i][0] = moves[i - 1]
            for (let j = 1; j < moves.length; j++) {
                // table[i][j] = getResult(moves, j - 1, i - 1);
                table[i][j] = this.getResult(moves, j - 1, i - 1);



            }


        }
        return table;
    }

}
class generationHex {
    getHex(a) {
        const sha256hash = crypto.createHash('sha3-256').update(a).digest().toString('hex');
        return sha256hash;

    }
}
class generationKey {
    getKey() {
        var token = crypto.randomBytes(256).toString('hex');
        return token;
    }
}


function createMenu(moves) {
    console.log("Available moves:")
    for (let i = 0; i < moves.length; i++) {
        console.log(i + 1, ') ', moves[i])

    }
    console.log("?", ") ", "Help")
    console.log(0, ") ", "exit");
}

function checkChoise(a, b) {
    if (b < 0 || b > a.length) {
        console.log("Wrong choice of action!");
        while (b < 0 || b > a.length) {
            createMenu(a);
            b = readline.question(`Enter you move->`);
        }
    }
    return b;

}

function checkRepetition(moves) {
    var a = [...new Set(moves)];
    if (a.length == moves.length) {
        return false

    } else return true;

}

function main(moves) {
    if (moves.length <= 1) {
        console.log("The number of arguments must be greater than 1!")

    } else {
        if (moves.length % 2 == 0) {
            console.log("The number of arguments must be odd!");

        } else {

            if (!checkRepetition(moves)) {
                let Game = new game(moves);
                let Key = new generationKey;
                let hmax = new generationHex;
                let computerMove = Game.getComputerMove(moves.length);
                let k1 = Key.getKey();
                let k = k1 + computerMove;
                k = hmax.getHex(k);
                console.log(k);
                createMenu(moves);
                let user_choise = readline.question(`Enter you move->`);
                user_choise = checkChoise(moves, user_choise);

                if (user_choise == 0) {
                    return
                } else if (user_choise == '?') {
                    let table = new tableGeneration

                    console.table(table.makeTable(moves));
                } else {

                    user_choise = ~~user_choise;
                    user_choise -= 1;
                    console.log("Your move->", moves[user_choise])
                    console.log("Computer move->", moves[computerMove])
                    console.log(Game.getResult(moves, user_choise, computerMove));
                    console.log("HMAC key:")
                    console.log(hmax.getHex(k1));


                }


            } else {
                console.log("Arguments must'n be repeated!");
            }

        }

    }
}
main(process.argv.slice(2));