const monsterInfo = document.getElementById("monster-info");
const playerObj = document.getElementById("player-obj");
const playerStat = document.getElementById("player-stat");
const btnDiv = document.getElementById("attack-btn-div");
const monsterObj = document.getElementById("monster-obj");
const [monsterHealthBar, playerHealthBar] =
  document.querySelectorAll(".health-bar");
const nextStage = document.getElementById("next-stage");
const playerXp = playerObj.firstElementChild;
const [attackBtn, criticalBtn] = btnDiv.querySelectorAll(".btn");
const monsterLevel = document.getElementById("monster-level");
const coolTimeIndex = document.getElementById("remain-cool");
const monsterHealthIndicate = document.querySelector(
  ".health-indicate.monster"
);
const playerHealthIndicate = document.querySelector(".health-indicate.player");

const makeStat = (strength, defense, health, speed, coolTime, imgUrl) => {
  const stat = {
    strength: strength,
    defense: defense,
    health: health,
    speed: speed,
    coolTime: coolTime,
    imgUrl: imgUrl,
  };

  return stat;
};

const monsterStats = [
  makeStat(
    0,
    0,
    0,
    0,
    0,
    "https://i.namu.wiki/i/CIOAWlxeyxrA55dvF54Q3xsYXI8JJlQe-PUgwuwO2LcUcc7JPqBRlAwAwxskigti_fGn2VOazXjYExJ_OQwQcw.webp"
  ),
  makeStat(
    2,
    2,
    2,
    0,
    1,
    "https://cdn-store.leagueoflegends.co.kr/images/v2/champion-chromas/27013.png"
  ),
  makeStat(
    3,
    3,
    3,
    3,
    2,
    "https://mblogthumb-phinf.pstatic.net/MjAyMDA2MTZfMjgw/MDAxNTkyMjcxOTg3NjQ5.giD_B186-k5XAr1T2GAnwUKZw8FfjBZnyt3xDlmKHsAg.fc_HdctAajudkhzRRG8m40PQ2gZxh7jUsM0bAOTbxxEg.PNG.thdbdlaeo/15.png?type=w420"
  ),
  makeStat(
    4,
    4,
    4,
    5,
    4,
    "https://w7.pngwing.com/pngs/609/52/png-transparent-dota-2-character-league-of-legends-summoner-zed-icon-zed-high-quality-presentation-video-game-sticker.png"
  ),
  makeStat(
    7,
    4,
    6,
    7,
    4,
    "https://w7.pngwing.com/pngs/168/707/png-transparent-league-of-legends-computer-file-darius-image-file-formats-superhero-fictional-character-thumbnail.png"
  ),
  makeStat(
    10,
    5,
    7,
    8,
    5,
    "https://storage.enuri.info/pic_upload/enurinews/tempImages/smart/202105/61505_7.png"
  ),
  makeStat(
    10,
    6,
    9,
    10,
    7,
    "https://i.namu.wiki/i/CIOAWlxeyxrA55dvF54Q3xsYXI8JJlQe-PUgwuwO2LcUcc7JPqBRlAwAwxskigti_fGn2VOazXjYExJ_OQwQcw.webp"
  ),
];

const playerStats = makeStat(
  1,
  0,
  0,
  0,
  0,
  "https://liquipedia.net/commons/images/5/54/League_Infobox_Ezreal.jpg"
);

const BASICCOOL = 13;
const BASICHEALTH = 1000;
const TOMULTYPLYHEALTH = 120;
const GIVENXP = 7;
const BASICATTACK = 55;
const TOMULTYPLYSTREANGTH = 7;
const BASICCRITICAL = 100;
const TOMULTYPLYDEFENSE = 8;
const TODEVIDESPEED = 17;

let xp = 0;
let cool = BASICCOOL;
let curMonsterLevel = 1;
let monsterCoolTime = BASICCOOL;

const updateCurInfo = () => {
  const a =
    BASICHEALTH + monsterStats[curMonsterLevel - 1].health * TOMULTYPLYHEALTH;
  const b = BASICHEALTH + playerStats.health * TOMULTYPLYHEALTH;
  return [a, b];
};

let [curMonsterHealth, curPlayerHealth] = updateCurInfo();

const handleAttack = () => {
  const damage = BASICATTACK + playerStats.strength * TOMULTYPLYSTREANGTH;
  if (cool !== 0) {
    cool -= 1;
    showCool();
    if (cool === 0) {
      toggleCritical();
    }
  }
  console.log(cool);
  monsterTakeDamage(damage, false);
};

const handleCritical = () => {
  const damage = BASICCRITICAL + playerStats.strength * TOMULTYPLYSTREANGTH;
  updateCool();
  showCool();
  if (cool !== 0) {
    toggleCritical();
  }
  console.log(cool);
  monsterTakeDamage(damage, true);
};

const attackLogic = (stat, takedDamage, isCritical) => {
  const curStat = stat;
  const realDamage = takedDamage - curStat.defense * TOMULTYPLYDEFENSE;
  const randomNum = Math.random();
  const damage = BASICATTACK + curStat.strength * TOMULTYPLYSTREANGTH;
  if (curStat.speed !== 0 && !isCritical) {
    if (randomNum <= curStat.speed / TODEVIDESPEED) {
      if (stat === playerStats) {
        showSpeed("player-speed");
      } else {
        showSpeed("monster-speed");
      }
      return [0, damage];
    }
  }
  return [realDamage, damage];
};

const monsterTakeDamage = (takedDamage, isCritical) => {
  const damages = attackLogic(
    monsterStats[curMonsterLevel - 1],
    takedDamage,
    isCritical
  );
  curMonsterHealth -= damages[0];
  console.log(curMonsterHealth);
  if (monsterCoolTime === 0) {
    playerTakeDamage(
      BASICCRITICAL +
        monsterStats[curMonsterLevel - 1].strength * TOMULTYPLYSTREANGTH,
      true
    );
    updateMonsterCool();
    updateMonsterHealthIndicateValue();
    return;
  }
  monsterCoolTime -= 1;
  updateMonsterHealthIndicateValue();
  playerTakeDamage(damages[1], false);
};

const playerTakeDamage = (takedDamage, isCritical) => {
  const damages = attackLogic(playerStats, takedDamage, isCritical);
  curPlayerHealth -= damages[0];
  updatePlayerIndicateValue();
  if (curMonsterHealth <= 0 || curPlayerHealth <= 0) {
    if (curMonsterHealth <= 0 && curPlayerHealth <= 0) {
      if (curMonsterHealth < curPlayerHealth) {
        updateResult(handleWin);
        console.log("win");
        return;
      } else if (curPlayerHealth < curMonsterHealth) {
        updateResult(handleLose);
        console.log("lose");
        return;
      } else {
        updateResult(handleDraw);
        console.log("draw");
        return;
      }
    } else if (curMonsterHealth <= 0) {
      updateResult(handleWin);
      console.log("win");
      return;
    } else if (curPlayerHealth <= 0) {
      updateResult(handleLose);
      console.log("lose");
      return;
    }
  }
  showHealth();
  console.log(curPlayerHealth);
  console.log("----------");
};

const updateResult = (resultFn) => {
  const result = resultFn;
  curMonsterHealth = 0;
  curPlayerHealth = 0;
  updateMonsterHealthIndicateValue();
  updatePlayerIndicateValue();
  showHealth();
  result();
};

const updateCool = () => {
  cool = BASICCOOL - playerStats.coolTime;
};

const updateMonsterCool = () => {
  monsterCoolTime = BASICCOOL - monsterStats[curMonsterLevel - 1].coolTime;
};

const showStat = () => {
  for (const key in playerStats) {
    if (key !== "imgUrl") {
      const statEl = document.createElement("div");
      statEl.classList.add("stat-div");
      statEl.innerHTML = `
      <div>
      <span class="stat">${key}</span>
      <span class="stat ${key}">${playerStats[key]} / 10</span>
      </div>
      <button class="btn __stat ${key}"></button>
    `;
      const statBtn = statEl.querySelector("button");
      statBtn.addEventListener("click", updateStat.bind(this, key));
      playerStat.append(statEl);
    }
  }
};

const toggleCritical = () => {
  criticalBtn.classList.toggle("cool-time");
};

const showHealth = () => {
  monsterHealthBar.textContent = `${curMonsterHealth}/${updateCurInfo()[0]}`;
  playerHealthBar.textContent = `${curPlayerHealth}/${updateCurInfo()[1]}`;
};

const showCool = () => {
  coolTimeIndex.textContent = `cool time: ${cool}/${
    BASICCOOL - playerStats.coolTime
  }`;
};

const handleLose = () => {
  alert("You Lose! Try Again!");
  location.reload();
};

const handleWin = () => {
  alert("You Win!");
  xp += GIVENXP;
  reorganize();
};

const handleDraw = () => {
  alert("You Had A Draw! You Can Try This Level Again!");
  update("draw");
};

const updateImg = () => {
  monsterObj.removeChild(monsterObj.lastChild);
  const newImg = document.createElement("img");
  newImg.src = monsterStats[curMonsterLevel - 1].imgUrl;
  monsterObj.appendChild(newImg);
};

const reorganize = () => {
  removeBtn();
  playerStat.classList.remove("first-hide");
  playerStat.classList.remove("hide");
  playerStat.classList.add("open");
  coolTimeIndex.classList.add("hidden");
  nextStage.classList.add("visible");
  attackBtn.classList.add("prevent");
  monsterLevel.textContent = "Compelete!";
  playerXp.textContent = `XP: ${xp}`;
};

const update = (tag) => {
  if (tag === "win") {
    curMonsterLevel += 1;
  }
  [curMonsterHealth, curPlayerHealth] = updateCurInfo();
  playerStat.classList.remove("open");
  playerStat.classList.add("hide");
  coolTimeIndex.classList.remove("hidden");
  attackBtn.classList.remove("prevent");
  monsterLevel.textContent = `Lv.${curMonsterLevel}`;
  nextStage.classList.remove("visible");
  criticalBtn.classList.add("cool-time");
  showHealth();
  updateCool();
  updateMonsterCool();
  showCool();
  updateMonsterHealthIndicateMax();
  updateMonsterHealthIndicateValue();
  updatePlayerIndicateMax();
  updatePlayerIndicateValue();
  updateImg();
};

const updateStat = (key) => {
  if (xp !== 0 && playerStats[key] !== 10) {
    console.log(key);
    playerStats[key]++;
    const toUpdateEl = document.querySelector(`span.${key}`);
    toUpdateEl.textContent = `${playerStats[key]} / 10`;
    xp--;
    playerXp.textContent = `XP: ${xp}`;
    removeBtn();
    if (xp === 0) {
      setTimeout(() => {
        playerStat.classList.remove("open");
        playerStat.classList.add("hide");
      }, 300);
    }
  }
};

const removeBtn = () => {
  for (const k in playerStats) {
    if (playerStats[k] === 10) {
      const toRemoveBtn = document.querySelector(`.btn.${k}`);
      toRemoveBtn.classList.add("hidden");
    }
  }
};

const showSpeed = (hookId) => {
  const speedDiv = document.getElementById(hookId);
  const speedEl = document.createElement("div");
  speedEl.innerHTML = `
    <h2>회피함!</h2>
  `;
  speedEl.firstElementChild.classList.add("speed-interprint");
  speedDiv.append(speedEl);
  setTimeout(() => {
    speedEl.firstElementChild.classList.add("removed");
  }, 400);
  setTimeout(() => {
    speedEl.remove();
  }, 550);
};

const updatePlayerIndicateValue = () => {
  playerHealthIndicate.value = curPlayerHealth;
};

const updatePlayerIndicateMax = () => {
  playerHealthIndicate.max = updateCurInfo()[1];
};

const updateMonsterHealthIndicateValue = () => {
  monsterHealthIndicate.value = curMonsterHealth;
};

const updateMonsterHealthIndicateMax = () => {
  monsterHealthIndicate.max = updateCurInfo()[0];
};

nextStage.addEventListener("click", update.bind(null, "win"));
attackBtn.addEventListener("click", handleAttack);
criticalBtn.addEventListener("click", handleCritical);

showStat();
showHealth();
showCool();
updateMonsterHealthIndicateMax();
updateMonsterHealthIndicateValue();
updatePlayerIndicateMax();
updatePlayerIndicateValue();
console.log("hello");
updateImg();
