(()=>{"use strict";var e={d:(t,n)=>{for(var o in n)e.o(n,o)&&!e.o(t,o)&&Object.defineProperty(t,o,{enumerable:!0,get:n[o]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t)};function t(e,t,n){const o=document.createElement("div");if(""!==e){if(-1!==Array.from(document.querySelectorAll(".tag")).map((e=>e.getAttribute("target"))).indexOf(e))return;o.setAttribute("target",e),o.textContent=e}else o.textContent=t,o.classList.add("tag"),o.style.top=`${n.y}px`,o.style.left=`${n.x}px`,o.style.background="red";return o.classList.add("tag"),o}let n;e.d({},{nC:()=>s,Tx:()=>w,BH:()=>d,QO:()=>m,eR:()=>C,tM:()=>u,HZ:()=>p});const o=storage.ref();function r(){o.child(["pictures/waldo-1.jpg","pictures/waldo-2.jpg","pictures/waldo-3.jpg"][u]).getDownloadURL().then((e=>{d.src=e,d.onload=()=>{d.classList.add("show"),d.removeAttribute("onload")},db.collection("games").add({clicks:[],pictureIndex:u}).then((e=>{n=e.id,db.collection("secureGameData").doc(n).onSnapshot((e=>{const n=e.data();if(!n)return;const o=n.target;if(o)if(n.hit)(function(e,n){const o=document.querySelector(".picture-container"),r=t(n,n);r&&function(e,t){return function(e,t){return db.collection("secureGameData").doc("pictureInfo").get().then((n=>n.data().positions[e][t]))}(e,t).then((e=>{return t=e,{x:Math.round((t.xmin+t.xmax)/2),y:Math.round((t.ymin+t.ymax)/2)};var t}))}(e,n).then((e=>{r.style.top=`${e.y}px`,r.style.left=`${e.x}px`,o.appendChild(r)}))})(u,o),w(n);else{const e=n.click;!function(e){const n=document.querySelector(".picture-container"),o=t("","You missed it!",e);n.appendChild(o),setTimeout((()=>{o.remove()}),1500)}({x:e.x,y:e.y})}}))})).catch((e=>{console.error("Error adding document: ",e)}))}))}let c,l=0;const a=document.querySelectorAll(".choice");function i(){db.collection("secureGameData").doc("pictureInfo").get().then((e=>e.data().numbersOfCharacters[u])).then((e=>{a.forEach(((t,n)=>{t.addEventListener("click",C),n>=e&&(t.setAttribute("disabled",!0),t.style.opacity=0),4===e&&(t.style.height="16px")}))}))}const s=document.querySelector(".picture-container"),d=document.querySelector("#game-hero");let u=0;const m=3;let p=!1;const y=document.querySelector(".popup-menu"),h=document.querySelector("#start");let f=!1,g=!1;const x={x:0,y:0,target:""};s.style.marginTop="60px",function(){const e="Let me itroduce you Waldo and his friends:",t=document.createElement("p");t.style.fontSize="21px",t.style.width="600px",t.style.margin="20px auto",s.appendChild(t);const n=["assets/waldo.jpg","assets/odlaw.jpg","assets/wizzard.jpeg","assets/wenda.jpeg"],o=["waldo","odlaw","wizzard","wenda"];let r;const a=document.createElement("div");a.style.width="400px",a.style.margin="auto",a.id="characters",s.appendChild(a);for(let e=0;e<4;e++)r=document.createElement("img"),r.src=n[e],r.style.width="50px",r.style.opacity=1,r.style.margin="20px",a.appendChild(r);const i=document.createElement("div");a.appendChild(i);for(let e=0;e<4;e++){const t=document.createElement("div");t.textContent=o[e],t.style.width="50px",t.style.display="inline",t.style.margin="20px",a.appendChild(t)}const d="Your task is finding them on the pictures by \n    clicking the right place on the picture. The program measures your\n    time, the faster you can find them, the better. Are you ready? \n    Press the button!",u=document.createElement("p");c=setInterval((()=>{if(l<=e.length)t.textContent=e.slice(0,l),l++;else{if(l-e.length>d.length)return void clearInterval(c);l++,u.textContent=d.slice(0,l-e.length)}}),50),u.style.fontSize="21px",u.style.width="600px",u.style.margin="20px auto",s.appendChild(u)}();const v=document.querySelector("#next"),b=document.querySelector("#scores");function C(e){const t=e.target;x.target=t.textContent,y.classList.remove("show"),f=!1,function(e){db.collection("games").doc(n).update({clicks:firebase.firestore.FieldValue.arrayUnion(e)}).catch((e=>{console.error("Error updating document: ",e)}))}(x)}function E(){document.querySelector(".modal").style.visibility="hidden",document.querySelector(".modal-content").classList.replace("show-modal","hide-modal");var e;e=document.querySelector("#name").value,db.collection("games").doc(n).update({username:e}).catch((e=>{console.error("Error updating document: ",e)})),d.classList.remove("show"),g=!1,f=!1,document.querySelectorAll(".tag").forEach((e=>e.remove()))}function w(e){if(!e.isGameOver)return;const t=e.time;var n;t&&(n=`You have found everybody in ${t}s`,document.querySelector(".modal-body").querySelector("p").textContent=n,function(){const e=document.querySelector("#name");0===u?e.removeAttribute("readonly"):e.setAttribute("readonly",!0)}(),document.querySelector(".modal").style.visibility="visible",document.querySelector(".modal-content").classList.replace("hide-modal","show-modal"),g=!0)}d.addEventListener("click",(function(e){if(f||g)return;const t=e.layerX,n=e.layerY;x.x=t,x.y=n,y.classList.add("show"),y.style.top=n-30+"px",y.style.left=t-15+"px",f=!0})),h.addEventListener("click",(function(){h.style.visibility="hidden",s.querySelectorAll("p").forEach((e=>e.remove())),s.querySelector("#characters").remove(),r()})),v.addEventListener("click",(function(){E(),u===m-1?p=!0:(u++,r(),a.forEach((e=>{e.removeEventListener("click",C),e.removeAttribute("disabled"),e.style=""})),i())})),b.addEventListener("click",(function(){E(),p=!0})),i(),db.collection("secureGameData").doc("scores").onSnapshot((e=>{const t=e.data(),n=[],o=[];for(let e=0;e<m;e++)o.push(t[e].length),n.push(t[e]);!function(e,t){if(!p)return;d.classList.remove("show"),d.style.position="absolute";const n=document.createElement("table");let o,r=document.createElement("tr");for(let e=0;e<m;e++)o=document.createElement("th"),o.textContent=`Picture-${e}`,o.setAttribute("colspan","2"),r.appendChild(o);n.appendChild(r);const c=t.reduce(((e,t)=>e>t?e:t));let l,a;for(let o=0;o<c;o++){r=document.createElement("tr");for(let n=0;n<m;n++)a=document.createElement("td"),o<t[n]?(l=e[n][o],a.textContent=l.username,r.appendChild(a),a=document.createElement("td"),a.textContent=l.time+"s"):a.setAttribute("colspan","2"),r.appendChild(a);n.appendChild(r)}s.appendChild(n)}(n,o)}))})();