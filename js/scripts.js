const image = document.querySelector("img");
const popupMenu = document.querySelector(".popup-menu");
const menuButtons = document.querySelectorAll(".choice");
const borderWidth = 30;
const borderHeight = 60;

image.addEventListener("click", onClickImg);
menuButtons.forEach((button) => {
  button.addEventListener("click", onClickBtn);
});

function onClickImg(event) {
  const x = event.layerX;
  const y = event.layerY;
  console.log({ x, y });
  popupMenu.classList.add("show");
  popupMenu.style.top = `${y - borderHeight / 2}px`;
  popupMenu.style.left = `${x - borderWidth / 2}px`;
}

function onClickBtn(event) {
  const target = event.target;
  console.log(target.textContent);
  popupMenu.classList.remove("show");
}
