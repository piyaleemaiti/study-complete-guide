const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 14;
const HEAL_VALUE = 20;
const MODE_ATTACK = 'ATTACK';
const MODE_STRONG_ATTACK = 'STRONG_ATTACK';
const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK';
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL';
const LOG_EVENT_GAME_OVER = 'GAME_OVER';

const enterValue = prompt('Maximum life for you and monster', '100');
const battleLog = [];

let choosenMaxLife = parseInt(enterValue);
if (isNaN(choosenMaxLife) || choosenMaxLife <= 0) {
  choosenMaxLife = 100;
}
let currentMonsterHealth = choosenMaxLife;
let currentPlayerHealth = choosenMaxLife;
let bonusHealth = true;

adjustHealthBars(choosenMaxLife);

function writeLog(event, value, monsterHealth, playerHealth) {
  let logEntry = {
    event,
    value,
    finalMosterHealth: monsterHealth,
    finalPlayerHealth: playerHealth,
  }
  switch (event) {
    case LOG_EVENT_PLAYER_ATTACK:
    case LOG_EVENT_PLAYER_STRONG_ATTACK:
      logEntry.target = 'MONSTER';
      break;
    case LOG_EVENT_MONSTER_ATTACK:
      logEntry.target = 'PLAYER';
      break;
    case LOG_EVENT_PLAYER_HEAL:
      logEntry.target = 'PLAYER';
      break;
    default:
      logEntry = {};
      break;
  }
  // if (event === LOG_EVENT_PLAYER_ATTACK || event === LOG_EVENT_PLAYER_STRONG_ATTACK) {
  //   logEntry.target = 'MONSTER';
  // } else if (event === LOG_EVENT_MONSTER_ATTACK) {
  //   logEntry.target = 'PLAYER';
  // } else if (event === LOG_EVENT_PLAYER_HEAL) {
  //   logEntry.target = 'PLAYER';
  // }
  battleLog.push(logEntry);
}

function reset() {
  currentPlayerHealth = choosenMaxLife;
  currentMonsterHealth = choosenMaxLife;
  resetGame(choosenMaxLife);
}

function endRound() {
  const initialPlayerHealth = currentPlayerHealth;
  const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
  currentPlayerHealth -= playerDamage;
  writeLog(LOG_EVENT_MONSTER_ATTACK, playerDamage, currentMonsterHealth, currentPlayerHealth);

  if (currentPlayerHealth <= 0 && bonusHealth) {
    bonusHealth = false;
    removeBonusLife();
    currentPlayerHealth = initialPlayerHealth;
    setPlayerHealth(currentPlayerHealth);
    alert('You would be dead but the bonus life saved you!');
  }
  if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
    alert('You won!');
    writeLog(LOG_EVENT_GAME_OVER, 'Player Won', currentMonsterHealth, currentPlayerHealth);
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
    alert('You lost!');
    writeLog(LOG_EVENT_GAME_OVER, 'Monster Won', currentMonsterHealth, currentPlayerHealth);
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
    alert('You have a draw!');
    writeLog(LOG_EVENT_GAME_OVER, 'A Draw', currentMonsterHealth, currentPlayerHealth);
  }

  if (currentMonsterHealth <= 0 || currentPlayerHealth <= 0) {
    reset();
  }
}

function attackMonster(mode) {
  const attackValue = mode === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
  const logEvent = mode === MODE_ATTACK ? LOG_EVENT_PLAYER_ATTACK : LOG_EVENT_PLAYER_STRONG_ATTACK;
  const damage = dealMonsterDamage(attackValue);
  currentMonsterHealth -= damage;
  writeLog(logEvent, damage, currentMonsterHealth, currentPlayerHealth);
  endRound();
}

function attackHandler() {
  attackMonster(MODE_ATTACK);
}

function strongAttackHandler() {
  attackMonster(MODE_STRONG_ATTACK);
}

function healPlayerHandler() {
  let healValue;
  if (currentPlayerHealth >= choosenMaxLife - HEAL_VALUE) {
    alert(`You can't heal more than your max initial health.`);
    healValue = choosenMaxLife - currentPlayerHealth;
  } else {
    healValue = HEAL_VALUE;
  }
  increasePlayerHealth(healValue);
  currentPlayerHealth += healValue;
  writeLog(LOG_EVENT_PLAYER_HEAL, healValue, currentMonsterHealth, currentPlayerHealth);
  endRound();
}

function logHandler() {
  console.log(battleLog);
}

attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttackHandler);
healBtn.addEventListener('click', healPlayerHandler);
logBtn.addEventListener('click', logHandler);