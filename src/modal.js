import { pictureIndex } from './index';

export function showModal() {
    const modal = document.querySelector('.modal');
    modal.style.visibility = 'visible';
    const modalContent = document.querySelector('.modal-content');
    modalContent.classList.replace('hide-modal','show-modal');
  }
  
export function setUpReadonlyOfInput() {
    const input = document.querySelector('#name');
    if (pictureIndex === 0) input.removeAttribute('readonly') 
      else input.setAttribute('readonly', true);
  } 
  
export function hideModal() {
    const modal = document.querySelector('.modal');
    modal.style.visibility = 'hidden';
    const modalContent = document.querySelector('.modal-content');
    modalContent.classList.replace('show-modal','hide-modal');
  }
  
export function setModalBodyText(text) {
    const modalBody = document.querySelector('.modal-body');
    const pElement = modalBody.querySelector('p');
    pElement.textContent = text;
  }

export function getUserName() {
    const input = document.querySelector('#name');
    return input.value;
  }