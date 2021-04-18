import { getPosition } from './database';

export function createTag(pictureIndex, target) {
  const container = document.querySelector(".picture-container");
  const tagDiv = createTagDiv(target, target);
  if (!tagDiv) return
  getTagPosition(pictureIndex, target)
    .then((pos) => {
      tagDiv.style.top = `${pos.y}px`;
      tagDiv.style.left = `${pos.x}px`;
      container.appendChild(tagDiv);
    });
}
  
function getTagPosition(pictureIndex, target) {
    return getPosition(pictureIndex, target) 
      .then((pos) => {
        return calcTagPosition(pos);
      });
}

function calcTagPosition(position) {
  const x = Math.round((position.xmin + position.xmax) / 2);
  const y = Math.round((position.ymin + position.ymax) / 2);
  return { x, y };
}

export function destroyTags() {
    const tags = document.querySelectorAll(".tag");
    tags.forEach(element => element.remove());
}

export function addWarning(pos) {
  const container = document.querySelector(".picture-container");
  const tagDiv = createTagDiv('', 'You missed it!', pos);
  container.appendChild(tagDiv);
  setTimeout(() => {
    tagDiv.remove();
  }, 1500);
}

function createTagDiv(target, text, pos) {
  const tagDiv = document.createElement("div");
  if (target!=='') {
    const tags = Array.from(document.querySelectorAll(".tag"));
    const targets = tags.map(tag => tag.getAttribute("target"));
    if (targets.indexOf(target) !== -1) return
    tagDiv.setAttribute("target", target);
    tagDiv.textContent = target;
  } else {
    tagDiv.textContent = text;
    tagDiv.classList.add("tag");
    tagDiv.style.top = `${pos.y}px`;
    tagDiv.style.left = `${pos.x}px`;
    tagDiv.style.background = 'red';
  }
  tagDiv.classList.add("tag");
  return tagDiv;
}