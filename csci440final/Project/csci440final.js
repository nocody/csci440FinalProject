"use strict";
//
var theta2 = 0.0;
var theta2Loc;
//Camera variables
//----------------------
var eye = vec3(-30.0, 5.0, 15.0);
var at  = vec3(0.0, 0.0, 0.0);
var up  = vec3(0.0, 1.0, 0.0);

var near = 5;
var far = 100.0;
var fovy = 50.0;  // Field-of-view in Y direction angle (in degrees)
var aspect = 1.0; // Viewport aspect ratio
//-----------------
var canvas;
var gl;
var program;

var projectionMatrix;
var modelViewMatrix;
var instanceMatrix;//

var modelViewMatrixLoc;

var vertices = [

    vec4( -0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5, -0.5, -0.5, 1.0 ),
    vec4( -0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5, -0.5, -0.5, 1.0 )
];


// ___________________________
var normalsArray = [];

var lightPosition = vec4( -25.0, 10.0, 24.0, 0.0 );

var lightAmbient = vec4( 1.0, 1.0, 1.0, 1.0 );

var lightDiffuse = vec4( 1,1,1, 1.0 );
var lightSpecular = vec4( 0.75, 0.75, 0.75, 1.0);


var materialAmbient = vec4( 1.0, 0.25, .25, 1.0 );
var materialDiffuse = vec4( 1.0, 0.8, 0.5, 1.0);
var materialSpecular = vec4( 0.5, 1.0, 0.9, 1.0 );

var materialShininess = 10.0;

var normalMatrix, normalMatrixLoc;

var ambientProduct, ambientProductLoc;
var diffuseProduct, diffuseProductLoc;
var specularProduct, specularProductLoc;
var lightPositionLoc;
var shininessLoc;

//----------------------
//Octopus node dimensions

var torsoHeight = 1;
var torsoWidth = 2.5;

var headHeight = 2.25;
var headWidth = 3;

var upperArmHeight = 2.0;
var upperArmWidth = 0.5;

var midUpperArmHeight = 2;
var midUpperArmWidth = 0.4;

var midLowerArmHeight = 1.5;
var midLowerArmWidth = 0.3;

var lowerArmHeight = 1;
var lowerArmWidth = 0.2;


//----------------------
//Crab node dimensions
var torsoHeightC = 0.5;
var torsoWidthC = 2;

var headHeightC = 0.75;
var headWidthC = 2.5;

var upperArmHeightC = 1;
var upperArmWidthC = 0.3;

var middleArmHeightC = 0.5;
var middleArmWidthC = 0.25;

var clawHeight = 1.0;
var clawWidth = 0.35;

var upperLegHeight = 1.5;
var upperLegWidth = 0.2;

var middleLegHeight = 1.0;
var middleLegWidth = 0.15;

var lowerLegHeight = 0.75;
var lowerLegWidth = 0.1;

//params for scale4 in renderNode function
var nodeDimensions = [
[//Octopus
  [torsoWidth,torsoHeight,torsoWidth],//Torso
  [3,2.25,2],//Head

  //Arm 1
  [upperArmWidth,upperArmHeight,upperArmWidth],//Upper Upper Arm 1
  [midUpperArmWidth,midUpperArmHeight,midUpperArmWidth],//Middle Upper Arm 1
  [midLowerArmWidth,midLowerArmHeight,midLowerArmWidth],//Middle Lower Arm 1
  [lowerArmWidth,lowerArmHeight,lowerArmWidth],//Lower Lower Arm 1
  //Arm 2
  [upperArmWidth,upperArmHeight,upperArmWidth],//Upper Upper Arm 1
  [midUpperArmWidth,midUpperArmHeight,midUpperArmWidth],//Middle Upper Arm 1
  [midLowerArmWidth,midLowerArmHeight,midLowerArmWidth],//Middle Lower Arm 1
  [lowerArmWidth,lowerArmHeight,lowerArmWidth],//Lower Lower Arm 1

  //Arm 3
  [upperArmWidth,upperArmHeight,upperArmWidth],//Upper Upper Arm 1
  [midUpperArmWidth,midUpperArmHeight,midUpperArmWidth],//Middle Upper Arm 1
  [midLowerArmWidth,midLowerArmHeight,midLowerArmWidth],//Middle Lower Arm 1
  [lowerArmWidth,lowerArmHeight,lowerArmWidth],//Lower Lower Arm 1

  //Arm 4
  [upperArmWidth,upperArmHeight,upperArmWidth],//Upper Upper Arm 1
  [midUpperArmWidth,midUpperArmHeight,midUpperArmWidth],//Middle Upper Arm 1
  [midLowerArmWidth,midLowerArmHeight,midLowerArmWidth],//Middle Lower Arm 1
  [lowerArmWidth,lowerArmHeight,lowerArmWidth],//Lower Lower Arm 1

  //Arm 5
  [upperArmWidth,upperArmHeight,upperArmWidth],//Upper Upper Arm 1
  [midUpperArmWidth,midUpperArmHeight,midUpperArmWidth],//Middle Upper Arm 1
  [midLowerArmWidth,midLowerArmHeight,midLowerArmWidth],//Middle Lower Arm 1
  [lowerArmWidth,lowerArmHeight,lowerArmWidth],//Lower Lower Arm 1

  //Arm 6
  [upperArmWidth,upperArmHeight,upperArmWidth],//Upper Upper Arm 1
  [midUpperArmWidth,midUpperArmHeight,midUpperArmWidth],//Middle Upper Arm 1
  [midLowerArmWidth,midLowerArmHeight,midLowerArmWidth],//Middle Lower Arm 1
  [lowerArmWidth,lowerArmHeight,lowerArmWidth],//Lower Lower Arm 1

  //Arm 7
  [upperArmWidth,upperArmHeight,upperArmWidth],//Upper Upper Arm 1
  [midUpperArmWidth,midUpperArmHeight,midUpperArmWidth],//Middle Upper Arm 1
  [midLowerArmWidth,midLowerArmHeight,midLowerArmWidth],//Middle Lower Arm 1
  [lowerArmWidth,lowerArmHeight,lowerArmWidth],//Lower Lower Arm 1

  //Arm 8
  [upperArmWidth,upperArmHeight,upperArmWidth],//Upper Upper Arm 1
  [midUpperArmWidth,midUpperArmHeight,midUpperArmWidth],//Middle Upper Arm 1
  [midLowerArmWidth,midLowerArmHeight,midLowerArmWidth],//Middle Lower Arm 1
  [lowerArmWidth,lowerArmHeight,lowerArmWidth],//Lower Lower Arm 1
],
[//Crab
  [torsoWidthC,torsoHeightC,torsoWidthC],//Torso
  [headWidthC, headHeightC,headWidthC],//Head
  //Left Arm 1
  [upperArmWidthC,upperArmHeightC,upperArmWidthC],//Upper Upper Arm 1
  [middleArmWidthC,middleArmHeightC,middleArmWidthC],//Middle Upper Arm 1
  [clawWidth,clawHeight,clawWidth],//Middle Lower Arm 1
  [clawWidth,clawHeight,clawWidth],//Lower Lower Arm 1
  //Right Arm 2
  [upperArmWidthC,upperArmHeightC,upperArmWidthC],//Upper Upper Arm 1
  [middleArmWidthC,middleArmHeightC,middleArmWidthC],//Middle Upper Arm 1
  [clawWidth,clawHeight,clawWidth],//Middle Lower Arm 1
  [clawWidth,clawHeight,clawWidth],//Lower Lower Arm 1

  //Left Leg 1
  [upperLegWidth ,upperLegHeight,upperLegWidth ],//Upper Upper Arm 1
  [middleLegWidth,middleLegHeight,middleLegWidth],//Middle Upper Arm 1
  [lowerLegWidth,lowerLegHeight,lowerLegWidth],//Middle Lower Arm 1
  //Right Leg 1
  [upperLegWidth ,upperLegHeight,upperLegWidth ],//Upper Upper Arm 1
  [middleLegWidth,middleLegHeight,middleLegWidth],//Middle Upper Arm 1
  [lowerLegWidth,lowerLegHeight,lowerLegWidth],//Middle Lower Arm 1
  //Left Leg 2
  [upperLegWidth ,upperLegHeight,upperLegWidth ],//Upper Upper Arm 1
  [middleLegWidth,middleLegHeight,middleLegWidth],//Middle Upper Arm 1
  [lowerLegWidth,lowerLegHeight,lowerLegWidth],//Middle Lower Arm 1
  //Right Leg 2
  [upperLegWidth ,upperLegHeight,upperLegWidth ],//Upper Upper Arm 1
  [middleLegWidth,middleLegHeight,middleLegWidth],//Middle Upper Arm 1
  [lowerLegWidth,lowerLegHeight,lowerLegWidth],//Middle Lower Arm 1

  //Arm 6
  [upperLegWidth ,upperLegHeight,upperLegWidth ],//Upper Upper Arm 1
  [middleLegWidth,middleLegHeight,middleLegWidth],//Middle Upper Arm 1
  [lowerLegWidth,lowerLegHeight,lowerLegWidth],//Middle Lower Arm 1

  [upperLegWidth ,upperLegHeight,upperLegWidth ],//Upper Upper Arm 1
  [middleLegWidth,middleLegHeight,middleLegWidth],//Middle Upper Arm 1
  [lowerLegWidth,lowerLegHeight,lowerLegWidth],//Middle Lower Arm 1

  [upperLegWidth ,upperLegHeight,upperLegWidth ],//Upper Upper Arm 1
  [middleLegWidth,middleLegHeight,middleLegWidth],//Middle Upper Arm 1
  [lowerLegWidth,lowerLegHeight,lowerLegWidth],//Middle Lower Arm 1

  [upperLegWidth ,upperLegHeight,upperLegWidth ],//Upper Upper Arm 1
  [middleLegWidth,middleLegHeight,middleLegWidth],//Middle Upper Arm 1
  [lowerLegWidth,lowerLegHeight,lowerLegWidth],//Middle Lower Arm 1
]
];
//params for m = translate() in initNode function

var nodePosition = [
  [//Octopus
    [0,0,0],//Torso
    [0.75,0.75,0],//Head

    //Arm1
    // uap,
    [0,-2,0.5],
    [0,-2,0],
    [0,-1.5,0],
    [0,-1,0],

    //Arm 2
     [0,-2,-0.5],
    // uap,
    [0,-2,0],
    [0,-1.5,0],
    [0,-1,0],
    //Arm3
    [-0.5,-2,0],
    // uap,
    [0,-2,0],
    [0,-1.5,0],
    [0,-1,0],

    //Arm4
    [0.5,-2,0],
    //uap,
    [0,-2,0],
    [0,-1.5,0],
    [0,-1,0],

    //Arm5
     [0,-2,-0.5],
    //uap,
    [0,-2,0],
    [0,-1.5,0],
    [0,-1,0],

    //Arm6
     [0,-2,0.5],
    //uap,
    [0,-2,0],
    [0,-1.5,0],
    [0,-1,0],

    //Arm7
    [-0.5,-2,0],
    // uap,
    [0,-2,0],
    [0,-1.5,0],
    [0,-1,0],

    //Arm8
    [0.5,-2,0],
    //uap,
    [0,-2,0],
    [0,-1.5,0],
    [0,-1,0]

    ],
    [//Crab
      [0,0,0],//Torso
      [0,0.25,0],//Head

      //Arm1
      [0,-1.7,0],
      [0,-.5,0],
      [0,-1.0,0],
      [0,-1.0,0],

      //Arm 2
      [0,-1.7,0],
      [0,-.5,0],
      [0,-1.0,0],
      [0,-1.0,0],

      //Left Leg 1
      [0,-1.7,0],
      [0,-1,0],
      [0,-.75,0],

      //Right Leg 1
      [0,-1.7,0],
      [0,-1,0],
      [0,-.75,0],

      //Left Leg 2
      [0,-1.7,-0.5],
      [0,-1,0],
      [0,-.75,0],
      //Right Leg 2
      [-0.5,-1.7,0],
      [0,-1,0],
      [0,-.75,0],

      //Left Leg 3
      [0,-1.7,0],
      [0,-1,0],
      [0,-.75,0],
//Right Leg 3
  [0,-1.7,0],
  [0,-1,0],
  [0,-.75,0],
//Left Leg 4
[-0.5,-1.7,0],
[0,-1,0],
[0,-.75,0],
//Right Leg 4
[0,-1.7,-0.5],
[0,-1,0],
[0,-.75,0]
    ]];

//params for m = mult(...rotatate()) in renderNode function
var nodeAxis = [
[//Octopus
  [0,1,0],//Torso
  [0,0,1],//Head

  [0,0,1],//Upper Upper Arm 1
  [0,0,1],//Middle Upper Arm 1
  [0,0,1],//Middle Lower Arm 1
  [0,1,1],//Lower Lower Arm 1

  [0,0,1],//Upper Upper Arm 2
  [0,0,1],//Middle Upper Arm 2
  [0,0,1],//Middle Lower Arm 2
  [0,0,1],//Lower Lower Arm 2

  [1,0,0],//Upper Upper Arm 3
  [1,0,0],//Middle Upper Arm 3
  [1,0,0],//Middle Lower Arm 3
  [1,0,0],//Lower Lower Arm 3

  [1,0,0],//Upper Upper Arm 4
  [1,0,0],//Middle Upper Arm 4
  [1,0,0],//Middle Lower Arm 4
  [1,0,0],//Lower Lower Arm 4

  [0,0,1],//Upper Upper Arm 5
  [0,0,1],//Middle Upper Arm 5
  [0,0,1],//Middle Lower Arm 5
  [0,0,1],//Lower Lower Arm 5

  [0,0,1],//Upper Upper Arm 6
  [0,0,1],//Middle Upper Arm 6
  [0,0,1],//Middle Lower Arm 6
  [0,0,1],//Lower Lower Arm 6

  [1,0,0],//Upper Upper Arm 7
  [1,0,0],//Middle Upper Arm 7
  [1,0,0],//Middle Lower Arm 7
  [1,0,0],//Lower Lower Arm 7

  [1,0,0],//Upper Upper Arm 8
  [1,0,0],//Middle Upper Arm 8
  [1,0,0],//Middle Lower Arm 8
  [1,0,0]//Lower Lower Arm 8
  ],
  [//Crab
    [0,1,0],//Torso
    [0,0,1],//Head

    [0,0,1],//Upper Upper Arm 1
    [1,0,0],//Middle Upper Arm 1
    [0,0,1],//Middle Lower Arm 1
    [0,0,1],//Lower Lower Arm 1

    [1,0,0],//Upper Upper Arm 2
    [0,0,1],//Middle Upper Arm 2
    [1,0,0],//Middle Lower Arm 2
    [1,0,0],//Lower Lower Arm 2
//Left leg 1
    [0,0,1],//Upper Upper Arm 3
    [0,0,1],//Middle Upper Arm 3
    [0,0,1],//Middle Lower Arm 3
//Right leg 1
    [1,0,0],//Lower Lower Arm 3
    [1,0,0],//Upper Upper Arm 4
    [1,0,0],//Middle Upper Arm 4
//Left leg 2
  [0,0,1],//Upper Upper Arm 3
  [0,0,1],//Middle Upper Arm 3
  [0,0,1],//Middle Lower Arm 3
//Right leg 2
  [1,0,0],//Lower Lower Arm 3
  [1,0,0],//Upper Upper Arm 4
  [1,0,0],//Middle Upper Arm 4
//Left leg 3
    [1,0,0],//Upper Upper Arm 6
    [1,0,0],//Middle Upper Arm 6
    [1,0,0],//Middle Lower Arm 6
//Right leg 3
    [0,0,1],//Lower Lower Arm 6
    [0,0,1],//Upper Upper Arm 7
    [0,0,1],//Middle Upper Arm 7
//Left leg 4
    [1,0,0],//Middle Lower Arm 7
    [1,0,0],//Lower Lower Arm 7
    [1,0,0],//Upper Upper Arm 8
//Right leg 4
    [0,0,1],//Middle Upper Arm 8
    [0,0,1],//Middle Lower Arm 8
    [0,0,1]//Lower Lower Arm 8
  ]
];
var theta = [
  [//Octopus
  0,//Torso
  -10,//Head
//Arm1
  65,//Upper Upper Arm 1
  0,//Middle Upper Arm 1
  0,//Middle Lower Arm 1
  0,//Lower Lower Arm 1
//Arm2
  65,//Upper Upper Arm 2
  0,//Middle Upper Arm 2
  0,//Middle Lower Arm 2
  0,//Lower Lower Arm 2
//Arm3
  -65,//Upper Upper Arm 3
  0,//Middle Upper Arm 3
  0,//Middle Lower Arm 3
  0,//Lower Lower Arm 3
//Arm4
  -65,//Upper Upper Arm 4
  0,//Middle Upper Arm 4
  0,//Middle Lower Arm 4
  0,//Lower Lower Arm 4
//Arm5
  -65,//Upper Upper Arm 5
  0,//Middle Upper Arm 5
  0,//Middle Lower Arm 5
  0,//Lower Lower Arm 5
//Arm6
  -65,//Upper Upper Arm 6
  0,//Middle Upper Arm 6
  0,//Middle Lower Arm 6
  0,//Lower Lower Arm 6
//Arm7
  65,//Upper Upper Arm 7
  0,//Middle Upper Arm 7
  0,//Middle Lower Arm 7
  0,//Lower Lower Arm 7
//Arm8
  65,//Upper Upper Arm 8
  0,//Middle Upper Arm 8
  0,//Middle Lower Arm 8
  0//Lower Lower Arm 8;
],
[//Crab
  -120,//Torso
  0,//Head
//Arm1
  90,//Upper Upper Arm 1
  -35,//Middle Upper Arm 1
  -45,//Middle Lower Arm 1
  45,//Lower Lower Arm 1
//Arm2
-90,//Upper Upper Arm 1
35,//Middle Upper Arm 1
-45,//Middle Lower Arm 1
45,//Lower Lower Arm 1

//Left leg 1
  70,//Upper Upper Arm 3
  -45,//Middle Upper Arm 3
  -15,//Middle Lower Arm 3
//Right leg 1
-70,//Upper Upper Arm 3
45,//Middle Upper Arm 3
15,//Middle Lower Arm 3
//Left leg 2
70,//Upper Upper Arm 3
-45,//Middle Upper Arm 3
-15,//Middle Lower Arm 3
//Right leg 2
-70,//Upper Upper Arm 3
45,//Middle Upper Arm 3
15,//Middle Lower Arm 3
//Left leg 3
70,//Upper Upper Arm 3
-45,//Middle Upper Arm 3
-15,//Middle Lower Arm 3
//Right leg 3
-70,//Upper Upper Arm 3
45,//Middle Upper Arm 3
15,//Middle Lower Arm 3
//Left leg 4
70,//Upper Upper Arm 3
-45,//Middle Upper Arm 3
-15,//Middle Lower Arm 3
//Right leg 4
-70,//Upper Upper Arm 3
45,//Middle Upper Arm 3
15,//Middle Lower Arm 3
]];
//params for createNode in renderNode function
var nodeSibling = [
  [
  null,//Torso
  2,//Head

  6,//Upper Upper Arm 1
  null,//Middle Upper Arm 1
  null,//Middle Lower Arm 1
  null,//Lower Lower Arm 1

  10,//Upper Upper Arm 2
  null,//Middle Upper Arm 2
  null,//Middle Lower Arm 2
  null,//Lower Lower Arm 2

  14,//Upper Upper Arm 3
  null,//Middle Upper Arm 3
  null,//Middle Lower Arm 3
  null,//Lower Lower Arm 3

  18,//Upper Upper Arm 4
  null,//Middle Upper Arm 4
  null,//Middle Lower Arm 4
  null,//Lower Lower Arm 4

  22,//Upper Upper Arm 5
  null,//Middle Upper Arm 5
  null,//Middle Lower Arm 5
  null,//Lower Lower Arm 5

  26,//Upper Upper Arm 6
  null,//Middle Upper Arm 6
  null,//Middle Lower Arm 6
  null,//Lower Lower Arm 6

  30,//Upper Upper Arm 7
  null,//Middle Upper Arm 7
  null,//Middle Lower Arm 7
  null,//Lower Lower Arm 7

  null,//Upper Upper Arm 8
  null,//Middle Upper Arm 8
  null,//Middle Lower Arm 8
  null,//Lower Lower Arm 8
  ],[
    null, //torso
    2,//Head

    6,//Left Upper Arm
    null,//Middle Upper Arm 1
    5,//Middle Lower Arm 1
    null,//Lower Lower Arm 1

    10,//Right Upper Arm
    null,//Middle Upper Arm 1
    9,//Middle Lower Arm 1
    null,//Lower Lower Arm 1

    13,//Left Leg 1
    null,//Middle Lower Arm 1
    null,//Lower Lower Arm 1

    16,//Right Leg 1
    null,//Middle Lower Arm 1
    null,//Lower Lower Arm 1

    19,//Left Leg 2
    null,//Middle Lower Arm 1
    null,//Lower Lower Arm 1

    22,//Right Leg 2
    null,//Middle Lower Arm 1
    null,//Lower Lower Arm 1

    25,//Left Leg 3
    null,//Middle Lower Arm 1
    null,//Lower Lower Arm 1

    28,//Right Leg 3
    null,//Middle Lower Arm 1
    null,//Lower Lower Arm 1

    31,//Left Leg 4
    null,//Middle Lower Arm 1
    null,//Lower Lower Arm 1

    null,//Right Leg 4
    null,//Middle Lower Arm 1
    null,//Lower Lower Arm 1

  ]];
var nodeChild = [
  [
    1,//Torso
    null,//Head
    //Arm 1
    3,//Upper Upper Arm 1
    4,//Middle Upper Arm 1
    5,//Middle Lower Arm 1
    null,//Lower Lower Arm 1
    //Arm 2
    7,//Upper Upper Arm 1
    8,//Middle Upper Arm 1
    9,//Middle Lower Arm 1
    null,//Lower Lower Arm 1
    //Arm 3
    11,//Upper Upper Arm 2
    12,//Middle Upper Arm 2
    13,//Middle Lower Arm 2
    null,//Lower Lower Arm 2
    //Arm 4
    15,//Upper Upper Arm 3
    16,//Middle Upper Arm 3
    17,//Middle Lower Arm 3
    null,//Lower Lower Arm 3
    //Arm 5
    19,//Upper Upper Arm 4
    20,//Middle Upper Arm 4
    21,//Middle Lower Arm 4
    null,//Lower Lower Arm 4
    //Arm 6
    23,//Upper Upper Arm 5
    24,//Middle Upper Arm 5
    25,//Middle Lower Arm 5
    null,//Lower Lower Arm 5
    //Arm 7
    27,//Upper Upper Arm 6
    28,//Middle Upper Arm 6
    29,//Middle Lower Arm 6
    null,//Lower Lower Arm 6
    //Arm 8
    31,//Upper Upper Arm 7
    32,//Middle Upper Arm 7
    33,//Middle Lower Arm 7
    null//Lower Lower Arm 8
  ],
  [
    1, //torso
    null,//Head

    3,//Left Upper Arm
    4,//Middle Upper Arm 1
    null,//Middle Lower Arm 1
    null,//Lower Lower Arm 1

    7,//Right Upper Arm
    8,//Middle Upper Arm 1
    null,//Middle Lower Arm 1
    null,//Lower Lower Arm 1

    11,//Left Leg 1
    12,//Middle Lower Arm 1
    null,//Lower Lower Arm 1

    14,//Right Leg 1
    15,//Middle Lower Arm 1
    null,//Lower Lower Arm 1

    17,//Left Leg 2
    18,//Middle Lower Arm 1
    null,//Lower Lower Arm 1

    20,//Right Leg 2
    21,//Middle Lower Arm 1
    null,//Lower Lower Arm 1

    23,//Left Leg 3
    24,//Middle Lower Arm 1
    null,//Lower Lower Arm 1

    26,//Right Leg 3
    27,//Middle Lower Arm 1
    null,//Lower Lower Arm 1

    29,//Left Leg 4
    30,//Middle Lower Arm 1
    null,//Lower Lower Arm 1

    32,//Right Leg 4
    33,//Middle Lower Arm 1
    null//Lower Lower Arm 1
  ]
];



var numNodes = 34;
var numAngles = 34;



//Used for traversal method

var stack = [];

//Octopus
var figure1 = [];
//Crab
var figure2 = [];

for( var i=0; i<numNodes; i++){

  figure1[i] = createNode(null, null, null);
  figure2[i] = createNode(null, null, null);
}

var figure = [figure1, figure2];

var vBuffer;

var pointsArray = [];

//Action Flags
//----------------------------------------




var legDirection =[true, true];

var crawl=[false, false];

var crawlDirection = [true,true];

var sHunt = false;
var fHunt = false;
var swim = [false, false];
var swimDirection = [true,true];
var dance = false;
var danceDirection = [true,true];

var translation = [vec3(10.0, 0.0, 0.0), vec3(-10.0, 0.0, 0.0)];

var threshold= [[15, 0], [-3, -15]];

//-------------------------------------
function resetFigures(){
  theta2=0.0;
  sHunt = false;
  fHunt = false;
  crawl = [false, false];
  swim = [false, false];
  dance = false;
  legDirection =[true, true];


  translation = [vec3(10.0, 0.0, 0.0), vec3(-10.0, 0.0, 0.0)];
  theta = [
    [//Octopus
    0,//Torso
    -10,//Head
  //Arm1
    65,//Upper Upper Arm 1
    0,//Middle Upper Arm 1
    0,//Middle Lower Arm 1
    0,//Lower Lower Arm 1
  //Arm2
    65,//Upper Upper Arm 2
    0,//Middle Upper Arm 2
    0,//Middle Lower Arm 2
    0,//Lower Lower Arm 2
  //Arm3
    -65,//Upper Upper Arm 3
    0,//Middle Upper Arm 3
    0,//Middle Lower Arm 3
    0,//Lower Lower Arm 3
  //Arm4
    -65,//Upper Upper Arm 4
    0,//Middle Upper Arm 4
    0,//Middle Lower Arm 4
    0,//Lower Lower Arm 4
  //Arm5
    -65,//Upper Upper Arm 5
    0,//Middle Upper Arm 5
    0,//Middle Lower Arm 5
    0,//Lower Lower Arm 5
  //Arm6
    -65,//Upper Upper Arm 6
    0,//Middle Upper Arm 6
    0,//Middle Lower Arm 6
    0,//Lower Lower Arm 6
  //Arm7
    65,//Upper Upper Arm 7
    0,//Middle Upper Arm 7
    0,//Middle Lower Arm 7
    0,//Lower Lower Arm 7
  //Arm8
    65,//Upper Upper Arm 8
    0,//Middle Upper Arm 8
    0,//Middle Lower Arm 8
    0//Lower Lower Arm 8;
  ],[//Crab
    -120,//Torso
    0,//Head
  //Arm1
    90,//Upper Upper Arm 1
    -35,//Middle Upper Arm 1
    -45,//Middle Lower Arm 1
    45,//Lower Lower Arm 1
  //Arm2
  -90,//Upper Upper Arm 1
  35,//Middle Upper Arm 1
  -45,//Middle Lower Arm 1
  45,//Lower Lower Arm 1

  //Left leg 1
    70,//Upper Upper Arm 3
    -45,//Middle Upper Arm 3
    -15,//Middle Lower Arm 3
  //Right leg 1
  -70,//Upper Upper Arm 3
  45,//Middle Upper Arm 3
  15,//Middle Lower Arm 3
  //Left leg 2
  70,//Upper Upper Arm 3
  -45,//Middle Upper Arm 3
  -15,//Middle Lower Arm 3
  //Right leg 2
  -70,//Upper Upper Arm 3
  45,//Middle Upper Arm 3
  15,//Middle Lower Arm 3
  //Left leg 3
  70,//Upper Upper Arm 3
  -45,//Middle Upper Arm 3
  -15,//Middle Lower Arm 3
  //Right leg 3
  -70,//Upper Upper Arm 3
  45,//Middle Upper Arm 3
  15,//Middle Lower Arm 3
  //Left leg 4
  70,//Upper Upper Arm 3
  -45,//Middle Upper Arm 3
  -15,//Middle Lower Arm 3
  //Right leg 4
  -70,//Upper Upper Arm 3
  45,//Middle Upper Arm 3
  15,//Middle Lower Arm 3
  ]
  ];

  for(i=0; i<numNodes; i++) {
    initNodes(i, 0);
    initNodes(i, 1);
  };

}
//-------------------------------------------
//Used in the body part functions to
function scale4(a, b, c) {
  // console.log("scale4");
   var result = mat4();
   result[0][0] = a;
   result[1][1] = b;
   result[2][2] = c;
   return result;
}

//--------------------------------------------

function createNode(transform, sibling, child){

    var node = {
    transform: transform,
    sibling: sibling,
    child: child
    }
    return node;
}


function initNodes(Id, fig) {


    var m = mat4();

    if(Id==0){
      m = mult(m, translate(translation[fig]));
    }
    m = mult(m, rotate(theta[fig][Id], nodeAxis[fig][Id][0], nodeAxis[fig][Id][1], nodeAxis[fig][Id][2]));

    m = mult( m, translate(nodePosition[fig][Id][0], nodePosition[fig][Id][1], nodePosition[fig][Id][2]));


    figure[fig][Id] = createNode( m, nodeSibling[fig][Id], nodeChild[fig][Id]);
    if(Id==1 && fig == 1){

    }

    }


function traverse(Id, fig) {

  if(Id == null) return;
  stack.push(modelViewMatrix);

  modelViewMatrix = mult(modelViewMatrix, figure[fig][Id].transform);

  renderNode(fig, Id);

  if(figure[fig][Id].child != null) traverse(figure[fig][Id].child, fig);

   modelViewMatrix = stack.pop();
  if(figure[fig][Id].sibling != null) traverse(figure[fig][Id].sibling, fig);
}
//Create a more general function for render functions?
function renderNode(figure, Id){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*nodeDimensions[figure][Id][1], 0.0) );

    instanceMatrix = mult(instanceMatrix, scale4( nodeDimensions[figure][Id][0],nodeDimensions[figure][Id][1], nodeDimensions[figure][Id][2]));

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
//------------------------------------

function quad(a, b, c, d) {
    //console.log("quad");
     var t1 = subtract(vertices[b], vertices[a]);
     var t2 = subtract(vertices[c], vertices[b]);
     var normal = cross(t1, t2);
     var normal = vec3(normal);

     pointsArray.push(vertices[a]);
     normalsArray.push(normal);
     pointsArray.push(vertices[b]);
     normalsArray.push(normal);
     pointsArray.push(vertices[c]);
     normalsArray.push(normal);

     pointsArray.push(vertices[d]);
     normalsArray.push(normal);
}

function cube(){

    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}

window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );

      gl.clearColor( 0.0, 0.2, 0.5, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader");

    gl.useProgram( program );

    instanceMatrix = mat4();

    projectionMatrix = perspective(fovy, aspect, near, far);

    modelViewMatrix = mat4();

    gl.uniformMatrix4fv(gl.getUniformLocation( program, "modelViewMatrix"), false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( gl.getUniformLocation( program, "projectionMatrix"), false, flatten(projectionMatrix) );


    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix")

    theta2Loc = gl.getUniformLocation(program, "theta2");

    cube();

    vBuffer = gl.createBuffer();

    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );


    // ----------
    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );

    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );

    ambientProductLoc = gl.getUniformLocation(program,"ambientProduct");
    diffuseProductLoc = gl.getUniformLocation(program,"diffuseProduct");
    specularProductLoc = gl.getUniformLocation(program,"specularProduct");
    lightPositionLoc = gl.getUniformLocation(program,"lightPosition");
    shininessLoc = gl.getUniformLocation(program, "shininess");

    gl.uniformMatrix3fv(gl.getUniformLocation( program, "normalMatrix" ), false, flatten(normalMatrix) );
    // ----------

  document.getElementById("crawlC").onclick = function(){
    swim[1]=false;
    if(sHunt || fHunt){
      resetFigures();
    }
    crawl[1]=!crawl[1];
    theta[1] = [//Crab
      -120,//Torso
      0,//Head
    //Arm1
      90,//Upper Upper Arm 1
      -35,//Middle Upper Arm 1
      -45,//Middle Lower Arm 1
      45,//Lower Lower Arm 1
    //Arm2
    -90,//Upper Upper Arm 1
    35,//Middle Upper Arm 1
    -45,//Middle Lower Arm 1
    45,//Lower Lower Arm 1

    //Left leg 1
      70,//Upper Upper Arm 3
      -45,//Middle Upper Arm 3
      -15,//Middle Lower Arm 3
    //Right leg 1
    -70,//Upper Upper Arm 3
    45,//Middle Upper Arm 3
    15,//Middle Lower Arm 3
    //Left leg 2
    70,//Upper Upper Arm 3
    -45,//Middle Upper Arm 3
    -15,//Middle Lower Arm 3
    //Right leg 2
    -70,//Upper Upper Arm 3
    45,//Middle Upper Arm 3
    15,//Middle Lower Arm 3
    //Left leg 3
    70,//Upper Upper Arm 3
    -45,//Middle Upper Arm 3
    -15,//Middle Lower Arm 3
    //Right leg 3
    -70,//Upper Upper Arm 3
    45,//Middle Upper Arm 3
    15,//Middle Lower Arm 3
    //Left leg 4
    70,//Upper Upper Arm 3
    -45,//Middle Upper Arm 3
    -15,//Middle Lower Arm 3
    //Right leg 4
    -70,//Upper Upper Arm 3
    45,//Middle Upper Arm 3
    15,//Middle Lower Arm 3
    ];
    for(i=0; i<numNodes; i++) {
      //initNodes(i, 0);
      initNodes(i, 1);
    };

};

  document.getElementById("crawlO").onclick = function(){
      if(sHunt || fHunt){
        resetFigures();
      }
      swim[0]=false;



    theta[0] = [//Octopus
      0,//Torso
      -10,//Head
    //Arm1
      65,//Upper Upper Arm 1
      0,//Middle Upper Arm 1
      0,//Middle Lower Arm 1
      0,//Lower Lower Arm 1
    //Arm2
      65,//Upper Upper Arm 2
      0,//Middle Upper Arm 2
      0,//Middle Lower Arm 2
      0,//Lower Lower Arm 2
    //Arm3
      -65,//Upper Upper Arm 3
      0,//Middle Upper Arm 3
      0,//Middle Lower Arm 3
      0,//Lower Lower Arm 3
    //Arm4
      -65,//Upper Upper Arm 4
      0,//Middle Upper Arm 4
      0,//Middle Lower Arm 4
      0,//Lower Lower Arm 4
    //Arm5
      -65,//Upper Upper Arm 5
      0,//Middle Upper Arm 5
      0,//Middle Lower Arm 5
      0,//Lower Lower Arm 5
    //Arm6
      -65,//Upper Upper Arm 6
      0,//Middle Upper Arm 6
      0,//Middle Lower Arm 6
      0,//Lower Lower Arm 6
    //Arm7
      65,//Upper Upper Arm 7
      0,//Middle Upper Arm 7
      0,//Middle Lower Arm 7
      0,//Lower Lower Arm 7
    //Arm8
      65,//Upper Upper Arm 8
      0,//Middle Upper Arm 8
      0,//Middle Lower Arm 8
      0//Lower Lower Arm 8;
    ];
      crawl[0]=!crawl[0];
      for(i=0; i<numNodes; i++) {
        //initNodes(i, 0);
        initNodes(i, 0);
      };



  };

  document.getElementById("swimC").onclick = function(){
    if(sHunt || fHunt){
      resetFigures();
    }
    crawl[1]=false;
    theta[1] = [//Crab
      -120,//Torso
      0,//Head
    //Arm1
      90,//Upper Upper Arm 1
      -35,//Middle Upper Arm 1
      -45,//Middle Lower Arm 1
      45,//Lower Lower Arm 1
    //Arm2
    -90,//Upper Upper Arm 1
    35,//Middle Upper Arm 1
    -45,//Middle Lower Arm 1
    45,//Lower Lower Arm 1

    //Left leg 1
      70,//Upper Upper Arm 3
      -45,//Middle Upper Arm 3
      -15,//Middle Lower Arm 3
    //Right leg 1
    -70,//Upper Upper Arm 3
    45,//Middle Upper Arm 3
    15,//Middle Lower Arm 3
    //Left leg 2
    70,//Upper Upper Arm 3
    -45,//Middle Upper Arm 3
    -15,//Middle Lower Arm 3
    //Right leg 2
    -70,//Upper Upper Arm 3
    45,//Middle Upper Arm 3
    15,//Middle Lower Arm 3
    //Left leg 3
    70,//Upper Upper Arm 3
    -45,//Middle Upper Arm 3
    -15,//Middle Lower Arm 3
    //Right leg 3
    -70,//Upper Upper Arm 3
    45,//Middle Upper Arm 3
    15,//Middle Lower Arm 3
    //Left leg 4
    70,//Upper Upper Arm 3
    -45,//Middle Upper Arm 3
    -15,//Middle Lower Arm 3
    //Right leg 4
    -70,//Upper Upper Arm 3
    45,//Middle Upper Arm 3
    15,//Middle Lower Arm 3
    ];
    swim[1]=!swim[1];
    for(i=0; i<numNodes; i++) {
      initNodes(i, 1);
    };
    //if(!swim[1]){crawl[1]=false;}
    // if(swim[1]){
    //   //translation[1][1] = 0;
    //   theta[1] = [//Crab
    //     -90,//Torso
    //     0,//Head
    //   //Arm1
    //     90,//Upper Upper Arm 1
    //     -35,//Middle Upper Arm 1
    //     -45,//Middle Lower Arm 1
    //     45,//Lower Lower Arm 1
    //   //Arm2
    //   -90,//Upper Upper Arm 1
    //   35,//Middle Upper Arm 1
    //   -45,//Middle Lower Arm 1
    //   45,//Lower Lower Arm 1
    //
    //   //Left leg 1
    //     70,//Upper Upper Arm 3
    //     -45,//Middle Upper Arm 3
    //     -15,//Middle Lower Arm 3
    //   //Right leg 1
    //   -70,//Upper Upper Arm 3
    //   45,//Middle Upper Arm 3
    //   15,//Middle Lower Arm 3
    //   //Left leg 2
    //   70,//Upper Upper Arm 3
    //   -45,//Middle Upper Arm 3
    //   -15,//Middle Lower Arm 3
    //   //Right leg 2
    //   -70,//Upper Upper Arm 3
    //   45,//Middle Upper Arm 3
    //   15,//Middle Lower Arm 3
    //   //Left leg 3
    //   70,//Upper Upper Arm 3
    //   -45,//Middle Upper Arm 3
    //   -15,//Middle Lower Arm 3
    //   //Right leg 3
    //   -70,//Upper Upper Arm 3
    //   45,//Middle Upper Arm 3
    //   15,//Middle Lower Arm 3
    //   //Left leg 4
    //   70,//Upper Upper Arm 3
    //   -45,//Middle Upper Arm 3
    //   -15,//Middle Lower Arm 3
    //   //Right leg 4
    //   -70,//Upper Upper Arm 3
    //   45,//Middle Upper Arm 3
    //   15,//Middle Lower Arm 3
    //   ];
    //   for(i=0; i<numNodes; i++) {
    //     initNodes(i, 1);
    //   };
    // }else{crawl[1]=false;}
    // swim[1]=!swim[1];
  };

  document.getElementById("swimO").onclick = function(){
    if(sHunt || fHunt){
      resetFigures();
    }
      crawl[0]=false;

      theta[0] = [//Octopus
      0,//Torso
      -10,//Head
    //Arm1
      65,//Upper Upper Arm 1
      0,//Middle Upper Arm 1
      0,//Middle Lower Arm 1
      0,//Lower Lower Arm 1
    //Arm2
      65,//Upper Upper Arm 2
      0,//Middle Upper Arm 2
      0,//Middle Lower Arm 2
      0,//Lower Lower Arm 2
    //Arm3
      -65,//Upper Upper Arm 3
      0,//Middle Upper Arm 3
      0,//Middle Lower Arm 3
      0,//Lower Lower Arm 3
    //Arm4
      -65,//Upper Upper Arm 4
      0,//Middle Upper Arm 4
      0,//Middle Lower Arm 4
      0,//Lower Lower Arm 4
    //Arm5
      -65,//Upper Upper Arm 5
      0,//Middle Upper Arm 5
      0,//Middle Lower Arm 5
      0,//Lower Lower Arm 5
    //Arm6
      -65,//Upper Upper Arm 6
      0,//Middle Upper Arm 6
      0,//Middle Lower Arm 6
      0,//Lower Lower Arm 6
    //Arm7
      65,//Upper Upper Arm 7
      0,//Middle Upper Arm 7
      0,//Middle Lower Arm 7
      0,//Lower Lower Arm 7
    //Arm8
      65,//Upper Upper Arm 8
      0,//Middle Upper Arm 8
      0,//Middle Lower Arm 8
      0//Lower Lower Arm 8;
    ];
      swim[0]=!swim[0];
      for(i=0; i<numNodes; i++) {
        initNodes(i, 0);
      };
    }

  document.getElementById("shunt").onclick = function() {
    console.log("S Hunt");
    resetFigures();
    sHunt = true;
  };
  document.getElementById("fhunt").onclick = function() {
    console.log("F Hunt");
    resetFigures();
    fHunt = true;
  };
  document.getElementById("dance").onclick = function() {
    //resetFigures();
    if(dance){
      resetFigures();
      dance = true;
    }else{
      resetFigures();
    }

    dance = !dance;
    if(!dance){resetFigures();}
  };
  document.getElementById("reset").onclick = function() {
    resetFigures();
  };
//----------------------------
    //----------
    for(i=0; i<numNodes; i++) {
      initNodes(i, 0);
      initNodes(i, 1);
    };


    render();
}

var render = function() {

        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        //-----------------
        ambientProduct = mult(lightAmbient, materialAmbient);
        diffuseProduct = mult(lightDiffuse, materialDiffuse);
        specularProduct = mult(lightSpecular, materialSpecular);

    	  gl.uniform4fv( ambientProductLoc, flatten(ambientProduct) );
        gl.uniform4fv( diffuseProductLoc, flatten(diffuseProduct) );
        gl.uniform4fv( specularProductLoc, flatten(specularProduct) );
        gl.uniform4fv( lightPositionLoc, flatten(lightPosition) );
        gl.uniform1f( shininessLoc, materialShininess );
        //-----------------
        theta2 +=(dance? 2.0 : 0.0);
        gl.uniform1f(theta2Loc, theta2);

        modelViewMatrix = lookAt( eye, at, up );

        drawFigure(0);
        drawFigure(1);

        requestAnimFrame(render);
}


function drawFigure(n){


  if(sHunt){
    var incrm1 = 0.275;

    //Octopus leaps ontop of crab
    if(!((translation[0][0]==-10 ) && (translation[0][1] == 2))) {
    translation[0][0] += ((translation[0][0]>-10 )? -incrm1 : 0.0);
    translation[0][1] += ((translation[0][0]>-2)? incrm1 : ((translation[0][1]>3)? -incrm1 : 0.0));
    }
  if(n==0){
    var incrm =((translation[0][0]>-10 )? 2.25 : 0.0)
  //if(translation[0][0]<-10){translation[0][2]=0.0};
    //1
    theta[n][2] +=(legDirection[n]? incrm : -incrm);
    theta[n][3] +=2*(legDirection[n]? incrm : -incrm);
    theta[n][4] +=-2*(legDirection[n]? -incrm : incrm);
    theta[n][5] +=2*(legDirection[n]? incrm : -incrm);
//2
    theta[n][6] +=(legDirection[n]? incrm : -incrm);
    theta[n][7] +=2*(legDirection[n]? incrm : -incrm);
    theta[n][8] +=-2*(legDirection[n]? -incrm : incrm);
    theta[n][9] +=2*(legDirection[n]? incrm : -incrm);
//3
    theta[n][10] +=(legDirection[n]? -incrm : incrm);
    theta[n][11] +=2*(legDirection[n]? -incrm : incrm);
    theta[n][12] +=-2*(legDirection[n]? incrm : -incrm);
    theta[n][13] +=2*(legDirection[n]? -incrm : incrm);
//4
    theta[n][14] +=(legDirection[n]? -incrm : incrm);
    theta[n][15] +=2*(legDirection[n]? -incrm : incrm);
    theta[n][16] +=-2*(legDirection[n]? incrm : -incrm);
    theta[n][17] +=2*(legDirection[n]? -incrm : incrm);
//5
    theta[n][18] +=(legDirection[n]? -incrm : incrm);
    theta[n][19] +=2*(legDirection[n]? -incrm : incrm);
    theta[n][20] +=-2*(legDirection[n]? incrm : -incrm);
    theta[n][21] +=2*(legDirection[n]? -incrm : incrm);
//6
    theta[n][22] +=(legDirection[n]? -incrm : incrm);
    theta[n][23] +=2*(legDirection[n]? -incrm : incrm);
    theta[n][24] +=-2*(legDirection[n]? incrm : -incrm);
    theta[n][25] +=2*(legDirection[n]? -incrm : incrm);
//7
    theta[n][26] +=(legDirection[n]? incrm : -incrm);
    theta[n][27] +=2*(legDirection[n]? incrm : -incrm);
    theta[n][28] +=-2*(legDirection[n]? -incrm : incrm);
    theta[n][29] +=2*(legDirection[n]? incrm : -incrm);
//8
    theta[n][30] +=(legDirection[n]? incrm : -incrm);
    theta[n][31] +=2*(legDirection[n]? incrm : -incrm);
    theta[n][32] +=-2*(legDirection[n]? -incrm : incrm);
    theta[n][33] +=2*(legDirection[n]? incrm : -incrm);

    if(theta[n][6] >= 95 || theta[n][6] <= 35){legDirection[n] =! legDirection[n];}


    for(var i = 2; i<numAngles;i++){
      initNodes(i,0);
    }
  initNodes(0,0);
  }
}
  if(fHunt){

    var incrm1 = 0.275;

    //Octopus leaps ontop of crab
    if(!((translation[0][0]==-10 ) && (translation[0][1] == 2))) {
    translation[0][0] += ((translation[0][0]>-10 )? -incrm1 : 0.0);
    translation[0][1] += ((translation[0][0]>0)? incrm1 : ((translation[0][1]>3)? -incrm1 : 0.0));
    }
  if(n==0){
    var incrm =((translation[0][0]>-10 )? 2.25 : 0.0)
    //if(translation[0][0]<-10){translation[0][2]=0.0};
    theta[n][2] +=(legDirection[n]? incrm : -incrm);
    theta[n][3] +=2*(legDirection[n]? incrm : -incrm);
    theta[n][4] +=-2*(legDirection[n]? -incrm : incrm);
    theta[n][5] +=2*(legDirection[n]? incrm : -incrm);
//2
    theta[n][6] +=(legDirection[n]? incrm : -incrm);
    theta[n][7] +=2*(legDirection[n]? incrm : -incrm);
    theta[n][8] +=-2*(legDirection[n]? -incrm : incrm);
    theta[n][9] +=2*(legDirection[n]? incrm : -incrm);
//3
    theta[n][10] +=(legDirection[n]? -incrm : incrm);
    theta[n][11] +=2*(legDirection[n]? -incrm : incrm);
    theta[n][12] +=-2*(legDirection[n]? incrm : -incrm);
    theta[n][13] +=2*(legDirection[n]? -incrm : incrm);
//4
    theta[n][14] +=(legDirection[n]? -incrm : incrm);
    theta[n][15] +=2*(legDirection[n]? -incrm : incrm);
    theta[n][16] +=-2*(legDirection[n]? incrm : -incrm);
    theta[n][17] +=2*(legDirection[n]? -incrm : incrm);
//5
    theta[n][18] +=(legDirection[n]? -incrm : incrm);
    theta[n][19] +=2*(legDirection[n]? -incrm : incrm);
    theta[n][20] +=-2*(legDirection[n]? incrm : -incrm);
    theta[n][21] +=2*(legDirection[n]? -incrm : incrm);
//6
    theta[n][22] +=(legDirection[n]? -incrm : incrm);
    theta[n][23] +=2*(legDirection[n]? -incrm : incrm);
    theta[n][24] +=-2*(legDirection[n]? incrm : -incrm);
    theta[n][25] +=2*(legDirection[n]? -incrm : incrm);
//7
    theta[n][26] +=(legDirection[n]? incrm : -incrm);
    theta[n][27] +=2*(legDirection[n]? incrm : -incrm);
    theta[n][28] +=-2*(legDirection[n]? -incrm : incrm);
    theta[n][29] +=2*(legDirection[n]? incrm : -incrm);
//8
    theta[n][30] +=(legDirection[n]? incrm : -incrm);
    theta[n][31] +=2*(legDirection[n]? incrm : -incrm);
    theta[n][32] +=-2*(legDirection[n]? -incrm : incrm);
    theta[n][33] +=2*(legDirection[n]? incrm : -incrm);

    if(theta[n][6] >= 95 || theta[n][6] <= 35){legDirection[n] =! legDirection[n];}



    for(var i = 2; i<numAngles;i++){
      initNodes(i,0);
    }
  initNodes(0,0);
  }
  else if(n==1){
    if(translation[0][0]>-10) {

    translation[1][0] += 0.6;
    theta[n][10] +=(legDirection[n]? -3 : 3);
    theta[n][13] +=(legDirection[n]? 3 : -3);

    theta[n][16] +=(legDirection[n]? 3 : -3);
    theta[n][19] +=(legDirection[n]? -3 : 3);

    theta[n][22] +=(legDirection[n]? -3 : 3);
    theta[n][25] +=(legDirection[n]? -3 : 3);

    theta[n][28] +=(legDirection[n]? 3 : -3);
    theta[n][31] +=(legDirection[n]? 3 : -3);

      if(theta[n][10] >= 90|| theta[n][10] <= 50){legDirection[n] =! legDirection[n];}
      initNodes(0, n);
      initNodes(10, n);
      initNodes(13, n);
      initNodes(16, n);
      initNodes(19, n);
      initNodes(22, n);
      initNodes(25, n);
      initNodes(28, n);
      initNodes(31, n);
    }
  }
}


  if(crawl[n]){
    //Figure crawls back and forth horizontally
    translation[n][0] += (crawlDirection[n]? 0.1 : -0.1);
    if(translation[n][0] >= threshold[n][0] || translation[n][0] <= threshold[n][1]){crawlDirection[n] = !crawlDirection[n];}

    if( n == 1){
    theta[n][10] +=(legDirection[n]? -3 : 3);
    theta[n][13] +=(legDirection[n]? 3 : -3);

    theta[n][16] +=(legDirection[n]? 3 : -3);
    theta[n][19] +=(legDirection[n]? -3 : 3);

    theta[n][22] +=(legDirection[n]? -3 : 3);
    theta[n][25] +=(legDirection[n]? -3 : 3);

    theta[n][28] +=(legDirection[n]? 3 : -3);
    theta[n][31] +=(legDirection[n]? 3 : -3);

      if(theta[n][10] >= 90|| theta[n][10] <= 50){legDirection[n] =! legDirection[n];}
      initNodes(0, n);
      initNodes(10, n);
      initNodes(13, n);
      initNodes(16, n);
      initNodes(19, n);
      initNodes(22, n);
      initNodes(25, n);
      initNodes(28, n);
      initNodes(31, n);
    }
    else if(n==0){
      var incrm =1.5;
      theta[n][2] +=(legDirection[n]? incrm : -incrm);
      theta[n][3] +=2*(legDirection[n]? incrm : -incrm);
      theta[n][4] +=-2*(legDirection[n]? incrm : -incrm);
      theta[n][4] +=2*(legDirection[n]? -incrm : incrm);

      theta[n][6] +=(legDirection[n]? -incrm : incrm);
      theta[n][7] +=2*(legDirection[n]? -incrm : incrm);
      theta[n][8] +=-2*(legDirection[n]? -incrm : incrm);
      theta[n][9] +=2*(legDirection[n]? incrm : -incrm);

      theta[n][10] +=(legDirection[n]? incrm : -incrm);
      theta[n][11] +=2*(legDirection[n]? incrm : -incrm);
      theta[n][12] +=-2*(legDirection[n]? incrm : -incrm);
      theta[n][13] +=2*(legDirection[n]? -incrm : incrm);

      theta[n][14] +=(legDirection[n]? -incrm : incrm);
      theta[n][15] +=2*(legDirection[n]? -incrm : incrm);
      theta[n][16] +=-2*(legDirection[n]? -incrm : incrm);
      theta[n][17] +=2*(legDirection[n]? incrm : -incrm);

      theta[n][18] +=(legDirection[n]? incrm : -incrm);
      theta[n][19] +=2*(legDirection[n]? incrm : -incrm);
      theta[n][20] +=-2*(legDirection[n]? incrm : -incrm);
      theta[n][21] +=2*(legDirection[n]? -incrm : incrm);

      theta[n][22] +=(legDirection[n]? -incrm : incrm);
      theta[n][23] +=2*(legDirection[n]? -incrm : incrm);
      theta[n][24] +=-2*(legDirection[n]? -incrm : incrm);
      theta[n][25] +=2*(legDirection[n]? incrm : -incrm);

      theta[n][26] +=(legDirection[n]? -incrm : incrm);
      theta[n][27] +=2*(legDirection[n]? -incrm : incrm);
      theta[n][28] +=-2*(legDirection[n]? -incrm : incrm);
      theta[n][29] +=2*(legDirection[n]? incrm : -incrm);

      theta[n][30] +=(legDirection[n]? incrm : -incrm);
      theta[n][31] +=2*(legDirection[n]? incrm : -incrm);
      theta[n][32] +=-2*(legDirection[n]? incrm : -incrm);
      theta[n][33] +=2*(legDirection[n]? -incrm : incrm);

      if(theta[n][2] >= 80 || theta[n][2] <= 40){legDirection[n] =! legDirection[n];}

      initNodes(0, n);

      for(var i = 2; i<numAngles;i++){
        initNodes(i,n);
      }

    }

 }
  if((swim[n]==false && translation[n][1] > 0) && !(sHunt || fHunt)) {
    translation[n][1]-= 0.075;
    initNodes(0, n);
  }

  if(swim[n]){
    //Figure swims up and down vertically
    translation[n][1] += (translation[n][1]<10 ? 0.1 : 0.0);
    if(n==0){
      var incrm =1;
      theta[n][2] +=(legDirection[n]? incrm : -incrm);
      theta[n][3] +=2*(legDirection[n]? incrm : -incrm);

      theta[n][6] +=(legDirection[n]? incrm : -incrm);
      theta[n][7] +=2*(legDirection[n]? incrm : -incrm);

      theta[n][10] +=(legDirection[n]? -incrm : incrm);
      theta[n][11] +=2*(legDirection[n]? -incrm : incrm);

      theta[n][14] +=(legDirection[n]? -incrm : incrm);
      theta[n][15] +=2*(legDirection[n]? -incrm : incrm);

      theta[n][18] +=(legDirection[n]? -incrm : incrm);
      theta[n][19] +=2*(legDirection[n]? -incrm : incrm);

      theta[n][22] +=(legDirection[n]? -incrm : incrm);
      theta[n][23] +=2*(legDirection[n]? -incrm : incrm);

      theta[n][26] +=(legDirection[n]? incrm : -incrm);
      theta[n][27] +=2*(legDirection[n]? incrm : -incrm);

      theta[n][30] +=(legDirection[n]? incrm : -incrm);
      theta[n][31] +=2*(legDirection[n]? incrm : -incrm);


      if(theta[n][6] >= 95 || theta[n][6] <= 35){legDirection[n] =! legDirection[n];}

      for(var i = 2; i<numAngles;i++){
        initNodes(i,n);
      }
    }
    else if( n == 1){

    theta[n][10] +=(legDirection[n]? 10 : -10);
    theta[n][13] +=(legDirection[n]? -10 : 10);

    theta[n][16] +=(legDirection[n]? 10 : -10);
    theta[n][19] +=(legDirection[n]? -10 : 10);

    theta[n][22] +=(legDirection[n]? 10 : -10);
    theta[n][25] +=(legDirection[n]? -10 : 10);

    theta[n][28] +=(legDirection[n]? 10 : -10);

    theta[n][31] +=(legDirection[n]? 10 : -10);

      if(theta[n][28] >= 100|| theta[n][28] <= 50){legDirection[n] =! legDirection[n];}
      initNodes(0, n);
      initNodes(10, n);
      initNodes(13, n);
      initNodes(16, n);
      initNodes(19, n);
      initNodes(22, n);
      initNodes(25, n);
      initNodes(28, n);
      initNodes(29, n);
      initNodes(30, n);
      initNodes(31, n);
      initNodes(32, n);
      initNodes(33, n);
    }



    initNodes(0, n);

    }

  if(dance){
    //Figure flail limbs and rotate
    //also may change colors
    var incrm =1.25;
    var incrm1 = 3;
    theta[n][0] +=(danceDirection[n]? incrm1 : -incrm1);

     if(n==0){
       if(theta[n][0] > 160 || theta[n][0] < -70){danceDirection[n] =! danceDirection[n];}

      theta[n][2] +=(legDirection[n]? incrm : -incrm);
      theta[n][3] +=2*(legDirection[n]? incrm : -incrm);
      theta[n][4] +=-2*(legDirection[n]? incrm : -incrm);
      theta[n][4] +=2*(legDirection[n]? -incrm : incrm);

      theta[n][6] +=(legDirection[n]? -incrm : incrm);
      theta[n][7] +=2*(legDirection[n]? -incrm : incrm);
      theta[n][8] +=-2*(legDirection[n]? -incrm : incrm);
      theta[n][9] +=2*(legDirection[n]? incrm : -incrm);

      theta[n][10] +=(legDirection[n]? incrm : -incrm);
      theta[n][11] +=2*(legDirection[n]? incrm : -incrm);
      theta[n][12] +=-2*(legDirection[n]? incrm : -incrm);
      theta[n][13] +=2*(legDirection[n]? -incrm : incrm);

      theta[n][14] +=(legDirection[n]? -incrm : incrm);
      theta[n][15] +=2*(legDirection[n]? -incrm : incrm);
      theta[n][16] +=-2*(legDirection[n]? -incrm : incrm);
      theta[n][17] +=2*(legDirection[n]? incrm : -incrm);

      theta[n][18] +=(legDirection[n]? incrm : -incrm);
      theta[n][19] +=2*(legDirection[n]? incrm : -incrm);
      theta[n][20] +=-2*(legDirection[n]? incrm : -incrm);
      theta[n][21] +=2*(legDirection[n]? -incrm : incrm);

      theta[n][22] +=(legDirection[n]? -incrm : incrm);
      theta[n][23] +=2*(legDirection[n]? -incrm : incrm);
      theta[n][24] +=-2*(legDirection[n]? -incrm : incrm);
      theta[n][25] +=2*(legDirection[n]? incrm : -incrm);

      theta[n][26] +=(legDirection[n]? -incrm : incrm);
      theta[n][27] +=2*(legDirection[n]? -incrm : incrm);
      theta[n][28] +=-2*(legDirection[n]? -incrm : incrm);
      theta[n][29] +=2*(legDirection[n]? incrm : -incrm);

      theta[n][30] +=(legDirection[n]? incrm : -incrm);
      theta[n][31] +=2*(legDirection[n]? incrm : -incrm);
      theta[n][32] +=-2*(legDirection[n]? incrm : -incrm);
      theta[n][33] +=2*(legDirection[n]? -incrm : incrm);

      if(theta[n][2] > 100 || theta[n][2] < 30){legDirection[n] =! legDirection[n];}

      initNodes(0, n);

      for(var i = 2; i<numAngles;i++){
        initNodes(i,n);
      }

    }
    else if( n == 1){

      theta[n][2] +=(legDirection[n]? -3 : 3);
      theta[n][4] +=2*(legDirection[n]? 3 : -3);
      theta[n][5] +=2*(legDirection[n]? -3 : 3);

      theta[n][6] +=(legDirection[n]? -3 : 3);
      theta[n][8] +=2*(legDirection[n]? 3 : -3);
      theta[n][9] +=2*(legDirection[n]? -3 : 3);

      theta[n][10] +=(legDirection[n]? -3 : 3);
      theta[n][13] +=(legDirection[n]? 3 : -3);

      theta[n][16] +=(legDirection[n]? 3 : -3);
      theta[n][19] +=(legDirection[n]? -3 : 3);

      theta[n][22] +=(legDirection[n]? -3 : 3);
      theta[n][25] +=(legDirection[n]? -3 : 3);

      theta[n][28] +=(legDirection[n]? 3 : -3);
      theta[n][31] +=(legDirection[n]? 3 : -3);

      if(theta[n][10] > 100|| theta[n][10] <= 30){legDirection[n] =! legDirection[n];}
      if(theta[n][0] > -10 || theta[n][0] < -160){danceDirection[n] =! danceDirection[n];}
      initNodes(0, n);
      initNodes(2, n);
      initNodes(4, n);
      initNodes(5, n);
      initNodes(6, n);
      initNodes(9, n);
      initNodes(10, n);
      initNodes(13, n);
      initNodes(16, n);
      initNodes(19, n);
      initNodes(22, n);
      initNodes(25, n);
      initNodes(28, n);
      initNodes(31, n);
    }
  }
  traverse(0, n);
}
