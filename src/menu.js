import { getNumberOfCharacters } from './database';
import { onClickBtn } from './index';

const menuButtons = document.querySelectorAll(".choice");

export function resetMenuButtons() {
    menuButtons.forEach(button => {
      button.removeEventListener("click", onClickBtn);
      button.removeAttribute('disabled');
      button.style = '';
    })
  }
  
export function setupMenuButtons() {
    getNumberOfCharacters()
    .then((number) => {
      menuButtons.forEach((button, index) => {
        button.addEventListener("click", onClickBtn);
        if (index >= number) { 
          button.setAttribute("disabled", true); 
          button.style.opacity = 0;
        }
        if (number === 4) button.style.height = '16px';
      });
    });
  }

