import { image, showScores, numberOfPictures, container } from './index';

export function createScoresPage(scores, lengths) {
  if (!showScores) return
  image.classList.remove('show');
  image.style.position = 'absolute';
  const table = document.createElement('table');
  let tr = document.createElement('tr');
  let th;
  for (let i = 0; i < numberOfPictures; i++) {
    th = document.createElement('th');
    th.textContent = `Picture-${i}`;
    th.setAttribute('colspan', '2');
    tr.appendChild(th);
  }
  table.appendChild(tr);
  const maxLength = lengths.reduce((prev, current) => {
    if (prev > current) return prev
      else return current;
  })
  let score;
  let td;
  for (let row = 0; row < maxLength; row++) {
    tr = document.createElement('tr');
    for (let col = 0; col < numberOfPictures; col++) {
      td = document.createElement('td');
      if (row < lengths[col]) {
        score = scores[col][row];
        td.textContent = score.username;
        tr.appendChild(td);
        td = document.createElement('td');
        td.textContent = score.time + 's';
      } else {
        td.setAttribute("colspan", "2");
      }
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
  container.appendChild(table);
}