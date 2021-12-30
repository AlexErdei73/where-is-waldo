import {
  loadPicture,
  addClickToCurrentGame,
  addNameToCurrentGame,
  addListenerForScores,
} from "./database";
import { createIntroPage, destroyIntroPage } from "./intro";
import {
  showModal,
  setUpReadonlyOfInput,
  hideModal,
  setModalBodyText,
  getUserName,
} from "./modal";
import { setupMenuButtons, resetMenuButtons } from "./menu";
import { destroyTags } from "./tag";

export const container = document.querySelector(".picture-container");
export const image = document.querySelector("#game-hero");
export let pictureIndex = 0;
export const numberOfPictures = 3;
export let showScores = false;
const popupMenu = document.querySelector(".popup-menu");
const startButton = document.querySelector("#start");
const borderWidth = 30;
const borderHeight = 60;
let hasImageClicked = false;
let gameOver = false;
const click = {
  x: 0,
  y: 0,
  target: "",
};
container.style.marginTop = `60px`;
createIntroPage();
const nextButton = document.querySelector("#next");
const scoresButton = document.querySelector("#scores");

image.addEventListener("click", onClickImg);
startButton.addEventListener("click", onClickStart);
nextButton.addEventListener("click", onClickNext);
scoresButton.addEventListener("click", onClickScores);
setupMenuButtons();
addListenerForScores();

function onClickImg(event) {
  if (hasImageClicked || gameOver || showScores) return;
  const x = event.layerX;
  const y = event.layerY;
  click.x = x;
  click.y = y;
  popupMenu.classList.add("show");
  popupMenu.style.top = `${y - borderHeight / 2}px`;
  popupMenu.style.left = `${x - borderWidth / 2}px`;
  hasImageClicked = true;
}

export function onClickBtn(event) {
  const target = event.target;
  click.target = target.textContent;
  popupMenu.classList.remove("show");
  hasImageClicked = false;
  addClickToCurrentGame(click);
}

function onClickStart() {
  startButton.style.visibility = "hidden";
  destroyIntroPage();
  loadPicture();
}

function onClickNext() {
  quitModal();
  if (pictureIndex === numberOfPictures - 1) showScores = true;
  else {
    pictureIndex++;
    loadPicture();
    resetMenuButtons();
    setupMenuButtons();
  }
}

function onClickScores() {
  quitModal();
  showScores = true;
}

function quitModal() {
  hideModal();
  const username = getUserName();
  addNameToCurrentGame(username);
  image.classList.remove("show");
  gameOver = false;
  hasImageClicked = false;
  destroyTags();
}

export function handleGameOver(data) {
  const isGameOver = data.isGameOver;
  if (!isGameOver) return;
  const time = data.time;
  if (!time) return;
  const text = `You have found everybody in ${time}s`;
  setModalBodyText(text);
  setUpReadonlyOfInput();
  showModal();
  gameOver = true;
}
