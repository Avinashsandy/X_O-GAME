const boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let newGameBtn = document.querySelector("#new-btn");
const msgContainer = document.querySelector(".msg-container");
const msg = document.querySelector(".msg");

let turnO = true;
let count = 0;
let isComputerPlaying = true;

const winPatterns = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 4, 6],
    [2, 5, 8],
    [3, 4, 5],
    [6, 7, 8],
];

//to reset the game
const resetGame = () => {
    turnO = true;
    count = 0;
    enableBoxes();
    msgContainer.classList.add("hide");
};

//handle boxes clicks
boxes.forEach((box) => {
    box.addEventListener("click", () => {
        if (box.innerText !== "") return;
        if (turnO) {
            //player O
            box.innerText = "O";

        } else {
            //player X
            box.innerText = "X";

        }
        box.disabled = true;
        count++;

        //check for a winner  or draw 
        let isWinner = checkWinner();
        if (count === 9 && !isWinner) {
            gameDraw();
        }
        //
        if (isComputerPlaying && !isWinner && count < 9) {

            turnO = !turnO;
            setTimeout(computerMove, 500);
        } else {
            turnO = !turnO;
        }
    });
});


const computerMove = () => {
    let bestMove = findBestMove();
    if (bestMove !== -1) {
        boxes[bestMove].innerText = "X";
        boxes[bestMove].disabled = true;
        count++;
    }
    if (checkWinner() || count === 9) {
        if (count === 9) gameDraw();
        return;
    }
    turnO = !turnO;
};

const findBestMove = () => {
    let availableBoxes = Array.from(boxes).map((box, idx) => box.innerText === "" ? idx : -1).filter(idx => idx !== -1);
    
    // 1. Check if computer can win
    for (let pattern of winPatterns) {
        let move = getWinningMove(pattern, "X");
        if (move !== -1) return move;
    }
    
    // 2. Block opponent's winning move
    for (let pattern of winPatterns) {
        let move = getWinningMove(pattern, "O");
        if (move !== -1) return move;
    }
    
    // 3. Choose center if available
    if (availableBoxes.includes(4)) return 4;
    
    // 4. Choose a corner if available
    let corners = [0, 2, 6, 8].filter(idx => availableBoxes.includes(idx));
    if (corners.length > 0) return corners[Math.floor(Math.random() * corners.length)];
    
    // 5. Choose a side if available
    let sides = [1, 3, 5, 7].filter(idx => availableBoxes.includes(idx));
    if (sides.length > 0) return sides[Math.floor(Math.random() * sides.length)];
    
    return -1;
};

const getWinningMove = (pattern, player) => {
    let [a, b, c] = pattern;
    let values = [boxes[a].innerText, boxes[b].innerText, boxes[c].innerText];
    if (values.filter(v => v === player).length === 2 && values.includes("")) {
        return [a, b, c].find(idx => boxes[idx].innerText === "");
    }
    return -1;
};


// game draw logic
const gameDraw = () => {
    msg.innerText = `Game is Draw.`;
    msgContainer.classList.remove("hide");
    disableBoxes();
};
//  disable all boxes
const disableBoxes = () => {
    for (let box of boxes) {
        box.disabled = true;
    }
};
// enable all boxes
const enableBoxes = () => {
    boxes.forEach((box) => {
        box.disabled = false;
        box.innerText = "";
    });
};
//show the winner
const showWinner = (winner) => {
    msg.innerText = `Congrulations, Winner is ${winner}`;
    msgContainer.classList.remove("hide");
    disableBoxes();
};

//check for a winner
const checkWinner = () => {
    for (let pattern of winPatterns) {
        let pos1Val = boxes[pattern[0]].innerText;
        let pos2Val = boxes[pattern[1]].innerText;
        let pos3Val = boxes[pattern[2]].innerText;
        if (pos1Val != "" && pos2Val != "" && pos3Val != "") {
            if (pos1Val === pos2Val && pos2Val === pos3Val) {
                showWinner(pos1Val);
                return true;
            }
        }
    }
    return false;
};


newGameBtn.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);