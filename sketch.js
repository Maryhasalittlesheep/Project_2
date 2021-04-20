/***********************************************************************************
  MoodyMaze
  by Scott Kildall

  Uses the p5.2DAdventure.js class 
  
------------------------------------------------------------------------------------
	To use:
	Add this line to the index.html

  <script src="p5.2DAdventure.js"></script>
***********************************************************************************/

// adventure manager global  
var adventureManager;

// p5.play
var playerSprite;
var playerAnimation;

// Clickables: the manager class
var clickablesManager;    // the manager class
var clickables;           // an array of clickable objects

var npc = []

// indexes into the clickable array (constants)
const playGameIndex = 0;
const restartGameIndex = 1;
const answer1Index = 2;
const answer2Index = 3;
const answer3Index = 4;
const answer4Index = 5;
const answer5Index = 6;
const answer6Index = 7;


var talkedToWeirdNPC = false;


// Allocate Adventure Manager with states table and interaction tables
function preload() {
  clickablesManager = new ClickableManager('data/clickableLayout.csv');
  adventureManager = new AdventureManager('data/adventureStates.csv', 'data/interactionTable.csv', 'data/clickableLayout.csv');

  npc[0] = loadImage('assets/npc/mom.png');
}
 
// Setup the adventure manager
function setup() {
  createCanvas(906, 720);

  // setup the clickables = this will allocate the array
  clickables = clickablesManager.setup();

  // create a sprite 
  playerSprite = createSprite(width/2, height/2, 80, 80);
  playerSprite.addAnimation('still','assets/sprite/2.png');
  playerSprite.addAnimation('left', 'assets/sprite/4.png', 'assets/sprite/6.png');
  playerSprite.addAnimation('right', 'assets/sprite/7.png', 'assets/sprite/9.png');
  playerSprite.addAnimation('up', 'assets/sprite/10.png', 'assets/sprite/12.png');
  playerSprite.addAnimation('down', 'assets/sprite/1.png', 'assets/sprite/3.png');

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

  //adventureManager.changeState("Aha");
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
  this.color = "#AA33AA";
  this.noTint = false;
  this.tint = "#FF0000";
}

// color a light gray if off
clickableButtonOnOutside = function () {
  // backto our gray color
  this.color = "#AAAAAA";
}

clickableButtonPressed = function() {
  // these clickables are ones that change your state
  // so they route to the adventure manager to do this
   
  if( !checkWeirdNPCButtons(this.id) ) {
    // route to adventure manager unless you are on weird NPC screne
    adventureManager.clickablePressed(this.name);
  }

}

// this goes through and checks to see if we pressed one of the wierd NPC buttons, if so, we
// see if it is the corrent one or not
function checkWeirdNPCButtons(idNum) {
  if( idNum >= 2 && idNum <= 7 ) {
    if( idNum === 6) {
      adventureManager.changeState("AhaOpened");
    }
    else {
      die();
    }

    return true;
  }

  return false;
}


function talkToWeirdy() {
  if( talkedToWeirdNPC === false ) {
    print( "turning them on");

    // turn on visibility for buttons
    for( let i = answer1Index; i <= answer6Index; i++ ) {
      clickables[i].visible = true;
    }

    talkedToWeirdNPC = true;
    print("talked to weidy");
  }
}
  

//-------------- SUBCLASSES / YOUR DRAW CODE CAN GO HERE ---------------//

class livingroom extends PNGRoom {
  // preload is where we define OUR variables
  preload() {

    // NPC position
    this.drawX = width/4;
    this.drawY = height/2 + 100;

    //load the sprite 
    this.momNPC = createSprite(this.drawX, this.drawY, 190, 212)
    this.momNPC.addImage(npc[0]);
  }

  // call the PNGRoom superclass's draw function to draw the background image
  // and draw our instructions on top of this
  draw() {
    // tint down background image so text is more readable
    tint(128);
      
    // this calls PNGRoom.draw()
    super.draw();
      
    drawSprite(this.momNPC)
    // text draw settings
    fill(255);
    textAlign(CENTER);
    textSize(30);

    }
  }



class AhaRoom extends PNGRoom {
  // preload() gets called once upon startup
  // We load ONE animation and create 20 NPCs
  // 
  preload() {
      // this is our image, we will load when we enter the room
      this.talkBubble = null;
      this.talkedToNPC = false;  // only draw when we run into it
      talkedToWeirdNPC = false;

      // NPC position
      this.drawX = width/4;
      this.drawY = height/2 + 100;

      // load the animation just one time
      this.weirdNPCSprite = createSprite( this.drawX, this.drawY, 100, 100);
      this.weirdNPCSprite.addAnimation('regular',  loadAnimation('assets/NPCs/wierdy_01.png', 'assets/NPCs/wierdy_04.png'));
   }

   load() {
      // pass to superclass
      super.load();

      this.talkBubble = loadImage('assets/talkBubble.png');
      
      // turn off buttons
      for( let i = answer1Index; i <= answer6Index; i++ ) {
       clickables[i].visible = false;
      }
    }

    // clears up memory
    unload() {
      super.unload();

      this.talkBubble = null;
      talkedToWeirdNPC = false;
      print("unloading AHA room");
    }

   // pass draw function to superclass, then draw sprites, then check for overlap
  draw() {
    // PNG room draw
    super.draw();

    // draws all the sprites in the group
    //this.weirdNPCSprite.draw();
    drawSprite(this.weirdNPCSprite)
    // draws all the sprites in the group - 
    //drawSprites(this.weirdNPCgroup);//.draw();

    // checks for overlap with ANY sprite in the group, if this happens
    // talk() function gets called
    playerSprite.overlap(this.weirdNPCSprite, talkToWeirdy );

     
    if( this.talkBubble !== null && talkedToWeirdNPC === true ) {
      image(this.talkBubble, this.drawX + 60, this.drawY - 350);
    }
  }
}

