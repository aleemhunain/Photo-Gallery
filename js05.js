"use strict";
/*    JavaScript 7th Edition
      Chapter 5
      Chapter Case

      Application to generate a slide show
      Author: 
      Date:   

      Filename: js05.js
*/

window.addEventListener("load", setupGallery);


function setupGallery() {
   let imageCount = imgFiles.length;

   //gallery container
   let galleryBox = document.getElementById("lightbox");
   let currentSlide = 1;
   let runShow = true;
   let showRunning;
   
   //parts of the gallery
   let galleryTitle = document.createElement("h1");
   let slideCounter = document.createElement("div");
   let leftBox = document.createElement("div");
   let rightBox = document.createElement("div");
   let playPause = document.createElement("div");
   let slideBox = document.createElement("div");
   let faveBox = document.createElement("div"); //designate new favorites section
   let faveCross = document.createElement("div");
   

   //design the lightbox title
   
   galleryBox.appendChild(galleryTitle);
   galleryTitle.id = "lbTitle";
   galleryTitle.textContent = lightboxTitle;
   
   //design the gallery slide counter
   
   galleryBox.appendChild(slideCounter);
   slideCounter.id = "lbCounter";
   slideCounter.textContent = currentSlide + "/" + imageCount;
   
   // gallery previous button
   
   galleryBox.appendChild(leftBox);
   leftBox.id = "lbPrev";
   leftBox.innerHTML = "&#9664;";
   leftBox.onclick = moveToLeft;   
   
   // gallery next button
   
   galleryBox.appendChild(rightBox);
   rightBox.id = "lbNext";
   rightBox.innerHTML = "&#9654;";  
   rightBox.onclick = moveToRight;   
   
   // gallery play-pause button
   
   galleryBox.appendChild(playPause);
   playPause.id = "lbPlay";
   playPause.innerHTML = "&#9199;";
   playPause.onclick = startStopShow;
   
   // design gallery image container
   
   galleryBox.appendChild(slideBox);
   slideBox.id = "lbImages";

   // pad some line space for the favorites
   for (let index = 0; index < 9; index++) {
      galleryBox.appendChild(document.createElement("br"));
      
   }

   //add box and text inside
   galleryBox.appendChild(faveBox);
   faveBox.id = "lbFavorites";
   let faveText = document.createElement("span");
   faveText.innerText = "Favorites: ";
   faveBox.appendChild(faveText);

   //set div for favorite images to be
   let faveGallery = document.createElement("div");
   faveBox.appendChild(faveGallery);
   faveGallery.id = "lbFaveGallery";
   let favImgs = [];
   console.log(favImgs); //check how many there are, should be 0, will delete later
   document.getElementsByTagName("body")[0].appendChild(faveCross);
   faveCross.innerHTML = "&#10006;";
   faveCross.classList.add("cross");

   
   //designs the lightbox container
   
   for (let i = 0; i < imageCount; i++) {
      let image = document.createElement("img");
      image.src = imgFiles[i];
      image.alt = imgCaptions[i];
      image.onclick = createModal;
      slideBox.appendChild(image);
   }
   

   
   function moveToRight() {
      let firstImage = slideBox.firstElementChild.cloneNode("true");
      firstImage.onclick = createModal;
      slideBox.appendChild(firstImage);
      slideBox.removeChild(slideBox.firstElementChild);
      currentSlide++;
      if (currentSlide > imageCount) {
         currentSlide = 1;
      }
      slideCounter.textContent = currentSlide + " / " + imageCount;
   }
   
   function moveToLeft() {
      let lastImage = slideBox.lastElementChild.cloneNode("true");
      lastImage.onclick = createModal;
      slideBox.removeChild(slideBox.lastElementChild);
      slideBox.insertBefore(lastImage, slideBox.firstElementChild);
      currentSlide--;
      if (currentSlide === 0) {
         currentSlide = imageCount;
      }
      slideCounter.textContent = currentSlide + " / " + imageCount;      
   }  
   
   function startStopShow() {
      if (runShow) {
         showRunning = window.setInterval(moveToRight, 2000);
         runShow = false;
      } else {
         window.clearInterval(showRunning);
         runShow = true;
      }
   }
   
   function createModal() {
      let modalWindow = document.createElement("div");
      modalWindow.id = "lbOverlay";

      //add figure box to overlay
      let figureBox = document.createElement("figure");
      modalWindow.appendChild(figureBox);
      
      //add image to the figure box
      let modalImage = this.cloneNode("true");
      figureBox.appendChild(modalImage);
      
      //add the caption
      let figureCaption = document.createElement("figcaption");
      figureCaption.textContent = modalImage.alt;
      figureBox.appendChild(figureCaption);
      
      //create close button to overlay
      let closeBox = document.createElement("div");
      closeBox.id = "lbOverlayClose";
      closeBox.innerHTML = "&times;";
      closeBox.onclick = function() {
         document.body.removeChild(modalWindow);
      }

      //new favourites box
      let starBox = document.createElement("div");
      starBox.id = "lbOverlayFave";

      //determine if image is in favorites and where it is
      starBox.innerHTML = "&star;";
      let favorited = false;
      let position = -1;
      for (let i = 0; i < favImgs.length; i++) {
         if (favImgs[i].src == modalImage.src) {
            starBox.innerHTML = "&starf;";
            position = i;
            favorited = true;
         }
      }
      (favorited) ? console.log('in-list') : console.log('not-list');
      

      starBox.onclick = addremFav;
      
      modalWindow.appendChild(closeBox);
      modalWindow.appendChild(starBox);
      
      document.body.appendChild(modalWindow);

      function addremFav() {
         console.log(favImgs.length);
         console.log(`position: ${position}`);
         console.log(faveGallery.children);
         if (favorited) {
            starBox.innerHTML = "&star;";
            favImgs.splice(position,1);
            favorited = false;
            favRender();
            console.log('removed');
         }else {
            if (favImgs.length == 5) {
               window.alert("Maximum limit of favorites is 5, unfavorite a prior image to proceed");     
            }else {
               starBox.innerHTML = "&starf;";
               let tempImg = modalImage.cloneNode("true");
               favImgs.push(tempImg);
               position = favImgs.length - 1;
               favorited = true;
               favRender();
               console.log('added');
            }
            
         }
         console.log(favImgs.length);
         console.log(favImgs);
          
      }

   }

   function favRender() {
      faveGallery.innerHTML = "";
      for (let i = 0; i < favImgs.length; i++) {
         let tempImg2 = favImgs[i].cloneNode("true");
         faveGallery.appendChild(tempImg2);
         tempImg2.setAttribute("width", "20%");
         tempImg2.addEventListener("mouseover", favCrossShow);
         tempImg2.addEventListener("mouseout", favCrossHide);
         faveGallery.onclick = favDeleter;
      }
   }

   function favCrossShow() {
      this.classList.add("removeimg");
      faveCross.style.fontSize = '500%';
      let pos = this.getBoundingClientRect();
      let posx = faveCross.getBoundingClientRect();
      
      let xpos = (pos.x + 0.5*(pos.right - pos.x) - 0.5*(posx.right - posx.left) + window.scrollX).toString() + 'px';
      let ypos = (pos.y + 0.5*(pos.bottom - pos.y) - 0.5*(posx.bottom - posx.y) + window.scrollY).toString() + 'px';
      faveCross.style.left = xpos;     
      faveCross.style.top = ypos;
      faveCross.style.visibility = "visible";
      
      console.log(this.classList);
   }

   function favCrossHide() {
      this.classList.remove("removeimg");
      faveCross.style.left = "0px";     
      faveCross.style.top = "0px";
      faveCross.style.visibility = "hidden";
      console.log(this.classList);
   }

   function favDeleter() {
      console.log("delete happens");
      let hoveredImage = document.getElementsByClassName("removeimg")[0];
      for (let k = 0; k < favImgs.length; k++) {
         if (favImgs[k].src == hoveredImage.src) {
            favImgs.splice(k,1);
         }
      }
      hoveredImage.remove();
      favRender();
      faveCross.style.visibility = "hidden";
   }
   
}