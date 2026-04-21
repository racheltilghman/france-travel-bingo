function saveScore() {
  console.log("Score saved (local test)");
}

/* 🎯 Bingo Items */
const items = [
"Someone says bon voyage",
"Overpriced airport snack",
"Passport panic",
"Matching travel outfits",
"Gate change",
"See a bird and send Rachel a picture",
"Tomato juice order",
"Plane descent hype",
"Turbulence",
"First bonjour",
"Bad French pronunciation",
"Train confusion",
"Free space 🇫🇷",
"Baguette purchase",
"Eat a croissant",
"Tiny coffee shock",
"This is so European",
"Maps disagreement",
"Group photo chaos",
"I could live here",
"Cobblestone struggle",
"Wine before noon",
"Hear a first impression gasp",
"Airplane selfie",
"First glass of wine at the chateau"
];

/* 🔀 Shuffle */
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

/* 🎲 Generate board */
const grid = document.getElementById("grid");
let shuffled = shuffle([...items]);
let cells = [];

shuffled.forEach(text => {
  const div = document.createElement("div");
  div.className = "cell";
  div.innerText = text;

  if (text.includes("Free space")) {
    div.classList.add("marked");
  }

  div.onclick = () => {
    div.classList.toggle("marked");
    checkBingo();
  };

  grid.appendChild(div);
  cells.push(div);
});

/* 🧠 Check win */
function checkBingo() {
  const patterns = [
    [0,1,2,3,4],[5,6,7,8,9],[10,11,12,13,14],
    [15,16,17,18,19],[20,21,22,23,24],
    [0,5,10,15,20],[1,6,11,16,21],[2,7,12,17,22],
    [3,8,13,18,23],[4,9,14,19,24],
    [0,6,12,18,24],[4,8,12,16,20]
  ];

  for (let p of patterns) {
    if (p.every(i => cells[i].classList.contains("marked"))) {
      win();
    }
  }
}

/* 🥂 Win moment */
function win() {
  document.getElementById("bingoOverlay").style.display = "flex";
  document.getElementById("clink").play();
  saveScore();
}

/* 🏆 Save score */
async function saveScore() {
  const name = document.getElementById("name").value || "Anonymous";

  await addDoc(collection(db, "scores"), {
    name: name,
    time: Date.now()
  });
}

/* 🏆 Live leaderboard */
const q = query(collection(db, "scores"), orderBy("time"));

onSnapshot(q, (snapshot) => {
  const board = document.getElementById("leaderboard");
  board.innerHTML = "";

  snapshot.docs.slice(0,10).forEach(doc => {
    const li = document.createElement("li");
    li.textContent = doc.data().name;
    board.appendChild(li);
  });
});

/* 📸 Screenshot */
window.shareBoard = async function() {
  const canvas = await html2canvas(document.body);
  const link = document.createElement("a");
  link.download = "bingo.png";
  link.href = canvas.toDataURL();
  link.click();
};
