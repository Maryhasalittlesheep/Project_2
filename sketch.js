/***********************************************************************************
  Simple
  by Scott Kildall

  Uses the p5.2DAdventure.js class 

  To do:
  ** cleanup p5.2DAdventure.js class + document it
  ** add mouse events, other interactions
  ** finish MazeMapper
  
------------------------------------------------------------------------------------
	To use:
	Add this line to the index.html

  <script src="p5.2DAdventure.js"></script>
***********************************************************************************/

// adventure manager global  
var adventureManager;

// p5.plau
var playerSprite;
var playerAnimation;

// Allocate Adventure Manager with states table and interaction tables
function preload() {
    adventureManager = new AdventureManager("data/adventureStates.csv", "data/interactionTable.csv");

}

// Setup the adventure manager
function setup() {
    createCanvas(1280, 720);

    // This will load the images, go through state and interation tables, etc
    adventureManager.setup();

    // create a sprite 
    playerSprite = createSprite(width/2, height/2, 80, 80);
    playerSprite.addAnimation('still','assets/1.png');
    playerSprite.addAnimation('left', 'assets/sprite/4.png', 'assets/sprite/6.png');
    playerSprite.addAnimation('right', 'assets/sprite/7.png', 'assets/sprite/9.png');
    playerSprite.addAnimation('up', 'assets/sprite/10.png', 'assets/sprite/12.png');
    playerSprite.addAnimation('down', 'assets/sprite/1.png', 'assets/sprite/3.png');

  	// use this to track movement from toom to room in adventureManager.draw()
	adventureManager.setPlayerSprite(playerSprite);
}

// Adventure manager handles it all!
function draw() {
    // draws background rooms and handles movement from one to another
    adventureManager.draw();

    // responds to keydowns
    moveSprite();

    // this is a function of p5.js, not of this sketch
    drawSprites();
}

// pass to adventure manager, this do the draw / undraw events
function keyPressed() {
    // toggle fullscreen mode
    if( key === 'f') {
      fs = fullscreen();
      fullscreen(!fs);
    }

    // dispatch key events for adventure manager to move from state to 
    // state or do special actions - this can be disabled for NPC conversations
    // or text entry
    adventureManager.keyPressed(key);  
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


//-------------- SUBCLASSES / YOUR DRAW CODE CAN GO HERE ---------------//
