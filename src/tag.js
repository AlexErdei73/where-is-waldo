import { getPosition } from './database';

export function createTag(pictureIndex, target) {
    const container = document.querySelector(".picture-container");
    const tags = Array.from(document.querySelectorAll(".tag"));
    const targets = tags.map(tag => tag.getAttribute("target"));
    if (targets.indexOf(target) !== -1) return
    const targetDiv = document.createElement("div");
    targetDiv.setAttribute("target", target);
    targetDiv.textContent = target;
    targetDiv.classList.add("tag");
    getTagPosition(pictureIndex, target)
      .then((pos) => {
        targetDiv.style.top = `${pos.y}px`;
        targetDiv.style.left = `${pos.x}px`;
        container.appendChild(targetDiv);
      });
  }
  
function getTagPosition(pictureIndex, target) {
    return getPosition(pictureIndex, target) 
      .then((pos) => {
        return clacTagPosition(pos);
      });
  }

function clacTagPosition(position) {
  const x = Math.round((position.xmin + position.xmax) / 2);
  const y = Math.round((position.ymin + position.ymax) / 2);
  return { x, y };
}

export function destroyTags() {
    const tags = document.querySelectorAll(".tag");
    tags.forEach(element => element.remove());
}