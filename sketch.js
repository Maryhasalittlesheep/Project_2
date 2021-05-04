/***********************************************************************************
Flipping
by Mary Huang

Overview
This is an Social Justice topic project about Sexism in the different points of viewing in terms of male gender. 
The game is controling Jason, the main character and going through differnt room and interact with differnt NPCs with the dialogue.


Technical Details

This program adding P5.Adventure.js library,P5.clickable.js library, and P5.play.js library. State mangement,State changed, and clickable items are manged through adventureStates.csv, clickableLayout.csv, and interactionTable.csv files. By using the class function to handle the changes of each subclass room load,draw functions to PNGRoom.

***********************************************************************************/

// adventure manager global  
var adventureManager;

// p5.play
var playerSprite;
var playerAnimation;

// Clickables: the manager class
var clickablesManager;    // the manager class
var clickables;           // an array of clickable objects

//npc and item img
var npcs = [];
var items = [];
var trashcollecteditem = false;
var trashnum = 0;
// NPC talking global variables
var talkedToWeirdNPC = false;
var talkedToXNPC = false;
var Font = null;

// Allocate Adventure Manager with states table and interaction tables
function preload() {
  clickablesManager = new ClickableManager('data/clickableLayout.csv');
  adventureManager = new AdventureManager('data/adventureStates.csv', 'data/interactionTable.csv', 'data/clickableLayout.csv');

  //preload the npcs img
  npcs[0] = loadImage('assets/npc/Mom.png');
  npcs[1] = loadImage('assets/npc/Dad.png');
  npcs[2] = loadImage('assets/npc/Classmate1.png');
  npcs[3] = loadImage('assets/npc/Classmate2.png');
  npcs[4] = loadImage('assets/npc/Classmate3.png');
  npcs[5] = loadImage('assets/npc/Classmate4.png');
  npcs[6] = loadImage('assets/npc/Teacher.png');
  npcs[7] = loadImage('assets/npc/Coworker.png');
  npcs[8] = loadImage('assets/npc/Coworker2.png');
  npcs[9] = loadImage('assets/npc/Boss.png');

  items[0] = loadImage('assets/item/present.png');
  items[1] = loadImage('assets/item/Trash.png');
  items[2] = loadImage('assets/item/Trash2.png');
  items[3] = loadImage('assets/item/Trash3.png');
  items[4] = loadImage('assets/item/Trash4.png');

  Font = loadFont('assets/font/Pixel Emulator.otf');

}
 
// Setup the adventure manager
function setup() {
  createCanvas(906, 720);

  // setup the clickables = this will allocate the array
  clickables = clickablesManager.setup();

  // create a sprite 
  playerSprite = createSprite(width/2, height/2, 80, 80);
  playerSprite.addAnimation('still','assets/sprite/1.png');
  playerSprite.addAnimation('left', 'assets/sprite/Left1.png', 'assets/sprite/Left6.png');
  playerSprite.addAnimation('right', 'assets/sprite/Right1.png', 'assets/sprite/Right6.png');
  playerSprite.addAnimation('up', 'assets/sprite/Up1.png', 'assets/sprite/Up6.png');
  playerSprite.addAnimation('down', 'assets/sprite/Down1.png', 'assets/sprite/Down6.png');

  // use this to track movement from toom to room in adventureManager.draw()
  adventureManager.setPlayerSprite(playerSprite);

  // this is optional but will manage turning visibility of buttons on/off
  // based on the state name in the clickableLayout
  adventureManager.setClickableManager(clickablesManager);

    // This will load the images, go through state and interation tables, etc
  adventureManager.setup();

  adventureManager.setChangedStateCallback(changedState);
  // call OUR function to setup additional information about the p5.clickables
  // that are not in the array 
  setupClickables(); 
  textFont(Font);
  noStroke();
}

// Adventure manager handles it all!
function draw() {
  // draws background rooms and handles movement from one to another
  adventureManager.draw();

  // draw the p5.clickables, in front of the mazes but behind the sprites 
  clickablesManager.draw();

  // No avatar for Splash screen or Instructions screen
  if( adventureManager.getStateName() !== "Splash" && 
      adventureManager.getStateName() !== "Instructions" ) {
      
    // responds to keydowns
    moveSprite();

    // this is a function of p5.js, not of this sketch
    drawSprite(playerSprite);
  } 

  for( let i = 1; i < clickables.length; i++ ) {
    clickables[i].visible = false;
  }

  text("x:"+mouseX+" y:"+mouseY,40,50);
}

// pass to adventure manager, this do the draw / undraw events
function keyPressed() {
  // toggle fullscreen mode
  if( key === 'f') {
    fs = fullscreen();
    fullscreen(!fs);
    return;
  }

  // dispatch key events for adventure manager to move from state to 
  // state or do special actions - this can be disabled for NPC conversations
  // or text entry   

  // dispatch to elsewhere
  adventureManager.keyPressed(key); 
}

function mouseReleased() {
  adventureManager.mouseReleased();
}

//-------------- CALLBACK FUNCTION FOR WHEN STATE HAS CHANGED -------//
function changedState(currentStateStr, newStateStr) {
  print("changed state" + "current state = " + currentStateStr + " new state = " + newStateStr);

}

//-------------- YOUR SPRITE MOVEMENT CODE HERE  ---------------//
function moveSprite() {
    if(keyIsDown(RIGHT_ARROW)){
      playerSprite.changeAnimation("right");
        playerSprite.velocity.x = 8;
    }
    else if(keyIsDown(LEFT_ARROW)){
      playerSprite.changeAnimation("left");
        playerSprite.velocity.x = -8;
    }
    else if(keyIsDown(DOWN_ARROW)){
      playerSprite.changeAnimation("down");
        playerSprite.velocity.y = 8;
    }
    else if(keyIsDown(UP_ARROW)){
      playerSprite.changeAnimation("up");
        playerSprite.velocity.y = -8;
    }
  else{
      playerSprite.changeAnimation("still");
        playerSprite.velocity.x = 0;
        playerSprite.velocity.y = 0;
    }
}

//-------------- CLICKABLE CODE  ---------------//

function setupClickables() {
  // All clickables to have same effects
  for( let i = 0; i < clickables.length; i++ ) {
    clickables[i].onHover = clickableButtonHover;
    clickables[i].onOutside = clickableButtonOnOutside;
    clickables[i].onPress = clickableButtonPressed;
  }
}

// tint when mouse is over
clickableButtonHover = function () {
  this.color = "#dca6eb";
  this.noTint = true;

}

// color a light gray if off
clickableButtonOnOutside = function () {
  // backto our gray color
  this.color = "#f0dcee";
}

clickableButtonPressed = function() {
  // these clickables are ones that change your state
  // so they route to the adventure manager to do this
   adventureManager.clickablePressed(this.name);
}


// code to check if NPC was talked to, if false, sets to true
function talkToWeirdy() {
    if (talkedToWeirdNPC === false) {
        print("turning them on1");
        talkedToWeirdNPC = true;
        print("talked to NPC");
    }
}

// code to check if NPC was talked to, if false, sets to true
function talkToNpc() {
    if (talkedToXNPC === false) {
        print("turning them on2");
        talkedToXNPC = true;
        print("talked to another NPC");
    }
}

//collect Trash
function Trashcollect(){
  if (trashcollecteditem === false){
    trashcollecteditem =true;
    trashnum ++;
  }
}

//-------------- SUBCLASSES / YOUR DRAW CODE CAN GO HERE ---------------//

class LivingRoom extends PNGRoom {
  // preload is where we define OUR variables
  preload() {
  // create npc
    this.MomNpc = createSprite(118 ,242,48,96);
    this.MomNpc.addImage(npcs[0]);
    this.DadNpc = createSprite(560,238,48,96);
    this.DadNpc.addImage(npcs[1]);

    //text functiopn 
    this.textimg = null;
    this.textimg2 = null;
    talkedToWeirdNPC = false;
    talkedToXNPC = false;
  }

  load(){
    super.load()

    this.textimg = loadImage('assets/Textdialogue/livingroomtext1.png');
    this.textimg2 = loadImage('assets/Textdialogue/livingroomtext2.png');
  }
  // call the PNGRoom superclass's draw function to draw the background image
  // and draw our instructions on top of this
  unload() {
    super.unload();

    this.textimg = null;
    this.textimg2 = null;
    talkedToWeirdNPC = false;
    }

  draw() {
    // this calls PNGRoom.draw()
    super.draw();
      
    //draw the sprite
    drawSprite(this.MomNpc);
    drawSprite(this.DadNpc);

    //talke with the npc
    playerSprite.overlap(this.MomNpc,talkToWeirdy);
    playerSprite.overlap(this.DadNpc,talkToNpc);

    if (this.textimg !== null && talkedToWeirdNPC === true){
      image(this.textimg,0,0);
    }
    if (this.textimg2 !== null && talkedToXNPC === true){
      image(this.textimg2,0,0);
    }
    }
  }



class ParentRoom extends PNGRoom {
  // preload() gets called once upon startup
  preload() {
    talkedToWeirdNPC = false;
    talkedToXNPC = false;
    //text functiopn 
    this.textimg = null;
    this.textimg2 = null;
    // load the item
    this.PresentSprite = createSprite(242,350, 89, 137);
    this.PresentSprite.addImage(items[0]);
    this.DadSitNpc = createSprite(849,425,48,96);
    this.DadSitNpc.addImage(loadImage('assets/npc/DadSit.png'));
   }

  load(){
    super.load()

    this.textimg = loadImage('assets/Textdialogue/parentroomtext1.png');
    this.textimg2 = loadImage('assets/Textdialogue/parentroomtext2.png');
  }
  unload() {
    super.unload();

    this.textimg = null;
    this.textimg2 = null;
    talkedToWeirdNPC = false;
    talkedToXNPC = false;
  }

   // pass draw function to superclass, then draw sprites, then check for overlap
  draw() {
    // PNG room draw
    super.draw();

    //this.present.draw();
    drawSprite(this.PresentSprite)
    drawSprite(this.DadSitNpc)

    //overlap with sprite
    // talk() function gets called
    playerSprite.overlap(this.PresentSprite,talkToWeirdy);
    playerSprite.overlap(this.DadSitNpc,talkToNpc);

    if (this.textimg !== null && talkedToWeirdNPC === true){
      image(this.textimg,0,0);
    }
    if (this.textimg2 !== null && talkedToXNPC === true){
      image(this.textimg2,0,0);
      clickables[1].visible = true;
    }
  }
}

class ClassRoom extends PNGRoom {
  // preload() gets called once upon startup
  preload() {
    talkedToWeirdNPC = false;
    //text functiopn 
    this.textimg = null;
    //laod teacher npc
    this.TeacherNpc = createSprite(843,202,48,96);
    this.TeacherNpc.addImage(npcs[6]);
    this.X = 200;
    this.Y = 334;
   }
  load(){
    super.load()
    this.textimg = loadImage('assets/Textdialogue/classroomtext1.png');
  }
  unload() {
    super.unload();

    this.textimg = null;
    talkedToWeirdNPC = false;
  }
   // pass draw function to superclass, then draw sprites, then check for overlap
  draw() {
      // PNG room draw
      super.draw();
      //this.teacher.draw();
      drawSprite(this.TeacherNpc)

      playerSprite.overlap(this.TeacherNpc,talkToWeirdy);

      if (this.textimg !== null && talkedToWeirdNPC === true){
        image(this.textimg,0,0);
        clickables[2].visible = true;
        clickables[3].visible = true;
      }
  }
}
class Gym extends PNGRoom {
  // preload is where we define OUR variables
  preload() {
  // create npc
    this.Mate1Npc = createSprite(706 ,192,48,96);
    this.Mate1Npc.addImage(npcs[2]);
    this.Mate2Npc = createSprite(118,242,48,96);
    this.Mate2Npc.addImage(npcs[3]);

    //text functiopn 
    this.textimg = null;
    this.textimg2 = null;
    talkedToWeirdNPC = false;
    talkedToXNPC = false;
  }

  load(){
    super.load()

    this.textimg = loadImage('assets/Textdialogue/gymtext1.png');
    this.textimg2 = loadImage('assets/Textdialogue/gymtext2.png');
  }
  // call the PNGRoom superclass's draw function to draw the background image
  // and draw our instructions on top of this
  unload() {
    super.unload();

    this.textimg = null;
    this.textimg2 = null;
    talkedToWeirdNPC = false;
    talkedToXNPC = false;
    }

  draw() {
    // this calls PNGRoom.draw()
    super.draw();
      
    //draw the sprite
    drawSprite(this.Mate1Npc);
    drawSprite(this.Mate2Npc);

    //talke with the npc
    playerSprite.overlap(this.Mate1Npc,talkToWeirdy);
    playerSprite.overlap(this.Mate2Npc,talkToNpc);

    if (this.textimg !== null && talkedToWeirdNPC === true){
      image(this.textimg,0,0);
    }
    if (this.textimg2 !== null && talkedToXNPC === true){
      image(this.textimg2,0,0);
    }
    }
}

class ArtRoom extends PNGRoom {
  // preload is where we define OUR variables
  preload() {
  // create npc
    this.BoyMate = createSprite(448 ,222,48,96);
    this.BoyMate.addImage(npcs[4]);
    this.BoyMate2 = createSprite(744,418,48,96);
    this.BoyMate2.addImage(npcs[5]);


    //text functiopn 
    this.textimg = null;
    talkedToWeirdNPC = false
  }

  load(){
    super.load()
    this.textimg = loadImage('assets/Textdialogue/artroomtext1.png');
  }
  // call the PNGRoom superclass's draw function to draw the background image
  // and draw our instructions on top of this
  unload() {
    super.unload();

    this.textimg = null;
    this.textimg2 = null;
    talkedToWeirdNPC = false;
    }

  draw() {
    // this calls PNGRoom.draw()
    super.draw();
      
    //draw the sprite
    drawSprite(this.BoyMate);
    drawSprite(this.BoyMate2);

    //talke with the npc
    playerSprite.overlap(this.BoyMate,talkToWeirdy);

    if (this.textimg !== null && talkedToWeirdNPC === true){
      image(this.textimg,0,0);
      clickables[4].visible = true;
    }
  }
}    
class Office extends PNGRoom {
  // preload() gets called once upon startup
  preload() {
    talkedToWeirdNPC = false;
    talkedToXNPC = false;
    //text functiopn 
    this.textimg = null;
    this.textimg2 = null;
    // load the npc
    this.Femaleworker = createSprite(329 ,185,48,96);
    this.Femaleworker.addImage(npcs[8]);
    this.Maleworker = createSprite(188,238,48,96);
    this.Maleworker.addImage(npcs[7]);
   }

  load(){
    super.load()

    this.textimg = loadImage('assets/Textdialogue/officetext1.png');
    this.textimg2 = loadImage('assets/Textdialogue/officetext2.png');
  }
  unload() {
    super.unload();

    this.textimg = null;
    this.textimg2 = null;
    talkedToWeirdNPC = false;
    talkedToXNPC = false;
  }

   // pass draw function to superclass, then draw sprites, then check for overlap
  draw() {
    // PNG room draw
    super.draw();

    //this.present.draw();
    drawSprite(this.Femaleworker)
    drawSprite(this.Maleworker)

    //overlap with sprite
    // talk() function gets called
    playerSprite.overlap(this.Femaleworker,talkToWeirdy);
    playerSprite.overlap(this.Maleworker,talkToNpc);

    if (this.textimg !== null && talkedToWeirdNPC === true){
      image(this.textimg,0,0);
    }
    if (this.textimg2 !== null && talkedToXNPC === true){
      image(this.textimg2,0,0);
      clickables[5].visible = true;
    }
  }
}
  class BossOffice extends PNGRoom {
  // preload() gets called once upon startup
  preload() {
    talkedToWeirdNPC = false;
    //text functiopn 
    this.textimg = null;
    //laod boss npc
    this.Boss = createSprite(516,184,48,96);
    this.Boss.addImage(npcs[9]);
   }
  load(){
    super.load()
    this.textimg = loadImage('assets/Textdialogue/bosstext1.png');
  }
  unload() {
    super.unload();

    this.textimg = null;
    talkedToWeirdNPC = false;
  }
   // pass draw function to superclass, then draw sprites, then check for overlap
  draw() {
      // PNG room draw
      super.draw();
      //this.teacher.draw();
      drawSprite(this.Boss)

      playerSprite.overlap(this.Boss,talkToWeirdy);

      if (this.textimg !== null && talkedToWeirdNPC === true){
        image(this.textimg,0,0);
      }
   }
  }

class OfficewT extends PNGRoom {
  // preload is where we define OUR variables
  preload() {
    //
    trashcollecteditem = false;
    //load Trashs sprite 
    this.Trash1 = createSprite(132, 362, 43, 39)
    this.Trash1.addImage(items[1]);
    this.Trash2 = createSprite(404, 325, 32, 31)
    this.Trash2.addImage(items[2]);
    this.Trash3 = createSprite(670, 439, 70, 40)
    this.Trash3.addImage(items[3]);
    this.Trash4 = createSprite(703, 206, 42, 38)
    this.Trash4.addImage(items[4]);
  }

  // call the PNGRoom superclass's draw function to draw the background image
  // and draw our instructions on top of this
  draw() {
    // this calls PNGRoom.draw()
    super.draw();
    //draw the sprite
    drawSprite(this.Trash1)
    drawSprite(this.Trash2)
    drawSprite(this.Trash3)
    drawSprite(this.Trash4)

    //talke with the npc
    if (playerSprite.overlap(this.Trash1,Trashcollect)){
      this.Trash1.visible = false;
      trashcollecteditem = false;
    }
    if (playerSprite.overlap(this.Trash2,Trashcollect)){
      this.Trash2.visible = false;
      trashcollecteditem = false;
    }
    if (playerSprite.overlap(this.Trash3,Trashcollect)){
      this.Trash3.visible = false;
      trashcollecteditem = false;
    }
    if (playerSprite.overlap(this.Trash4,Trashcollect)){
      this.Trash4.visible = false;

    }

    if (trashnum >= 4){
      adventureManager.changeState("End");
    }
    // text draw settings
    fill(0);
    textAlign(CENTER);
    textSize(20);

    text("Trash cleaned: "+trashnum,169,584);
    }
  }