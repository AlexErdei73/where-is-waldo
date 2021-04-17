import { container } from './index';

export function createIntroPage() {
    const introduction1 = `Let me itroduce you Waldo and his friends:`
    const pElement1 = document.createElement('p');
    pElement1.textContent = introduction1;
    pElement1.style.fontSize = '21px';
    pElement1.style.width = '600px';
    pElement1.style.margin = '20px auto';
    container.appendChild(pElement1);
    const figures = [
      'assets/waldo.jpg',
      'assets/odlaw.jpg',
      'assets/wizzard.jpeg',
      'assets/wenda.jpeg',
    ];
    const names = [
      'waldo',
      'odlaw',
      'wizzard',
      'wenda',
    ]
    let imgElement;
    const div = document.createElement('div');
    div.style.width = '400px';
    div.style.margin = 'auto';
    div.id = 'characters';
    container.appendChild(div);
    for (let i = 0; i < 4; i++) {
      imgElement = document.createElement('img');
      imgElement.src = figures[i];
      imgElement.style.width = '50px';
      imgElement.style.opacity = 1;
      imgElement.style.margin = '20px';
      div.appendChild(imgElement);
    }
    const emptyDiv = document.createElement('div');
    div.appendChild(emptyDiv);
    for (let i = 0; i < 4; i++) {
      const nameElement = document.createElement('div');
      nameElement.textContent = names[i];
      nameElement.style.width = '50px';
      nameElement.style.display = 'inline';
      nameElement.style.margin = '20px';
      div.appendChild(nameElement);
    }
    const introduction2 = `Your task is finding them on the pictures by 
    clicking the right place on the picture. The program measures your
    time, the faster you can find them, the better. Are you ready? 
    Press the button!`
    const pElement2 = document.createElement('p');
    pElement2.textContent = introduction2;
    pElement2.style.fontSize = '21px';
    pElement2.style.width = '600px';
    pElement2.style.margin = '20px auto';
    container.appendChild(pElement2);
  }
  
  export function destroyIntroPage() {
    const pElements = container.querySelectorAll('p');
    pElements.forEach(item => item.remove());
    const div = container.querySelector('#characters');
    div.remove();
  }