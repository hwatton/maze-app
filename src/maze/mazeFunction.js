import * as d3 from "d3";

/**
 * leaving here for posterity! this was my first go at this.
 *
 * several things:
 * 1: this can just return an array of points in the grid,
 * and a set of coordinates of each wall.
 * Orrrrr, just which wall is in or out and what the size is
 * 2: make it work for rectangles.
 * 3: get rid of d3, again.
 * 4:. Lets try and spice up the method. add in longer walls
 * at the start of the process. Maybe the odd double wall,
 * next to eahc other. kruskal, with prebuilt hazards.
 * or, do a backtracker.
 * I think, what would be nice, is a few hazards, like ladders
 * in snakes and ladders. throw in a few runs (make them
 * multi directional and wonky maybe) and then put in
 * kruskal on the top.
 *
 * */

function mazeData(gridSize, pixelSize) {
  const ht = pixelSize;
  const rows = gridSize;
  const cols = rows;

  //this might be in mazegrid too.
  const lineScale = d3
    .scaleLinear()
    .range([10, ht - 10])
    .domain([0, rows]);

  const lineFunc = d3
    .line()
    .x((d) => lineScale(d.x))
    .y((d) => lineScale(d.y));

  //make some circles to cover the joins of paths with width > 1px
  let circlePositions = [];

  for (let i = 0; i < rows + 1; i++) {
    for (let j = 0; j < rows + 1; j++) {
      circlePositions.push({ cx: lineScale(i), cy: lineScale(j) });
    }
  }

  /* the next bit, make the two parts of the outside walls. */

  let outsideLines = [
    { x: 0, y: 0 },
    { x: 0, y: rows },
    { x: rows - 1, y: rows }
  ];
  let outsidePaths = lineFunc(outsideLines);

  let outsideLines2 = [
    { x: 1, y: 0 },
    { x: rows, y: 0 },
    { x: rows, y: rows }
  ];

  let outsidePaths2 = lineFunc(outsideLines2);

  //right- start wrangling...
  //make an array of all maze positions

  let mazePositions = [];
  let z = 0;
  let mazeMap = [];

  for (let i = 0; i < rows; i++) {
    let mapRow = [];
    for (let j = 0; j < cols; j++) {
      mazePositions.push({
        row: i,
        col: j,
        inMaze: false,
        mazeRef: null,
        id_no: z
      });

      mapRow.push({
        row: i,
        col: j,
        inMaze: false,
        mazeRef: null,
        id_no: z
      });
      z++;
    }
    mazeMap.push(mapRow);
  } //for - create mazepositions

  let wallPositions = [];

  //add horizontal walls first

  for (let i = 0; i < rows - 1; i++) {
    for (let j = 0; j < cols; j++) {
      let path = [
        { x: j, y: i + 1 },
        { x: j + 1, y: i + 1 }
      ];

      let thisPath = lineFunc(path);

      wallPositions.push({
        orientation: "horizontal",
        cellAbove: [i, j],
        cellBelow: [i + 1, j],
        gone: false,
        lineData: thisPath
      });
    } //j
  } // i

  //add vertical walls next

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols - 1; j++) {
      let path = [
        { x: j + 1, y: i },
        { x: j + 1, y: i + 1 }
      ];

      let thisPath = lineFunc(path);

      wallPositions.push({
        orientation: "vertical",
        cellLeft: [i, j],
        cellRight: [i, j + 1],
        gone: false,
        lineData: thisPath
      });
    } //j
  } // i

  //////////////// VARIABLES /////
  let wP = shuffle(wallPositions);
  let mazeRefNumber = 0;

  //////////// MASHWALLS IS THE MAIN LOOP TO ASCERTAIN MAIN STRUCTURE
  function mashWalls(arrayIn) {
    let array = arrayIn;
    let aL = array.length;

    for (let i = 0; i < aL; i++) {
      //BIG LOOP

      let obj = array[i];

      if (obj.orientation !== "vertical") {
        //horizontal wall

        let cellOne = mazeMap[obj.cellAbove[0]][obj.cellAbove[1]];
        let cellTwo = mazeMap[obj.cellBelow[0]][obj.cellBelow[1]];

        if (cellOne.inMaze) {
          //c1 in maze
          if (cellTwo.inMaze) {
            //c2 also in maze
            //do nothing
          } else {
            //c1 in maze, c2 not in maze
            mazeMap[obj.cellBelow[0]][obj.cellBelow[1]].inMaze = true;
            mazeMap[obj.cellBelow[0]][obj.cellBelow[1]].mazeRef =
              cellOne.mazeRef;
            array[i].gone = true;
          }
        } else {
          //c1 not in maze
          if (cellTwo.inMaze) {
            //c1 not in maze,  c2 in maze

            mazeMap[obj.cellAbove[0]][obj.cellAbove[1]].inMaze = true;
            mazeMap[obj.cellAbove[0]][obj.cellAbove[1]].mazeRef =
              cellTwo.mazeRef;
            array[i].gone = true;
          } else {
            //neither in maze

            mazeMap[obj.cellAbove[0]][obj.cellAbove[1]].inMaze = true;
            mazeMap[obj.cellBelow[0]][obj.cellBelow[1]].inMaze = true;

            mazeMap[obj.cellAbove[0]][obj.cellAbove[1]].mazeRef = mazeRefNumber;
            mazeMap[obj.cellBelow[0]][obj.cellBelow[1]].mazeRef = mazeRefNumber;

            array[i].gone = true;

            mazeRefNumber++;
          }
        }
      } else {
        //vertical wall

        let cellOne = mazeMap[obj.cellLeft[0]][obj.cellLeft[1]];
        let cellTwo = mazeMap[obj.cellRight[0]][obj.cellRight[1]];

        if (cellOne.inMaze) {
          //c1 in maze
          if (cellTwo.inMaze) {
            //c2 also in maze
            //do nothing
          } else {
            //c1 in maze, c2 not in maze

            mazeMap[obj.cellRight[0]][obj.cellRight[1]].inMaze = true;
            mazeMap[obj.cellRight[0]][obj.cellRight[1]].mazeRef =
              cellOne.mazeRef;
            array[i].gone = true;
          }
        } else {
          //c1 not in maze

          if (cellTwo.inMaze) {
            //c1 not in maze,  c2 in maze
            mazeMap[obj.cellLeft[0]][obj.cellLeft[1]].inMaze = true;
            mazeMap[obj.cellLeft[0]][obj.cellLeft[1]].mazeRef = cellTwo.mazeRef;
            array[i].gone = true;
          } else {
            //neither in maze
            mazeMap[obj.cellLeft[0]][obj.cellLeft[1]].inMaze = true;
            mazeMap[obj.cellRight[0]][obj.cellRight[1]].inMaze = true;

            mazeMap[obj.cellLeft[0]][obj.cellLeft[1]].mazeRef = mazeRefNumber;
            mazeMap[obj.cellRight[0]][obj.cellRight[1]].mazeRef = mazeRefNumber;

            array[i].gone = true;

            mazeRefNumber++;
          }
        }
      }
    } //bigLoop

    return array;
  }

  /////// CALL MASHWALLS  ///////
  let test = mashWalls(wP);

  const tL = test.length;

  /********* CYCLE THROUGH SECTIONS AND JOIN TO FORM THE MAZE*************/

  for (let i = 0; i < tL; i++) {
    if (test[i].gone !== true) {
      let obj = test[i];

      if (obj.orientation !== "vertical") {
        //horizontal
        let cellOne = mazeMap[obj.cellAbove[0]][obj.cellAbove[1]];
        let cellTwo = mazeMap[obj.cellBelow[0]][obj.cellBelow[1]];
        if (cellOne.mazeRef !== cellTwo.mazeRef) {
          let ext = d3.extent([cellOne.mazeRef, cellTwo.mazeRef]);
          let lo = ext[0];
          let hi = ext[1];

          for (let a = 0; a < rows; a++) {
            for (let b = 0; b < cols; b++) {
              if (mazeMap[a][b].mazeRef === hi) {
                mazeMap[a][b].mazeRef = lo;
              }
            }
          }

          test[i].gone = true;
        }
      } else {
        //vertical
        let cellOne = mazeMap[obj.cellLeft[0]][obj.cellLeft[1]];
        let cellTwo = mazeMap[obj.cellRight[0]][obj.cellRight[1]];

        if (cellOne.mazeRef !== cellTwo.mazeRef) {
          let ext = d3.extent([cellOne.mazeRef, cellTwo.mazeRef]);
          let lo = ext[0];
          let hi = ext[1];

          for (let a = 0; a < rows; a++) {
            for (let b = 0; b < cols; b++) {
              if (mazeMap[a][b].mazeRef === hi) {
                mazeMap[a][b].mazeRef = lo;
              }
            }
          }
          test[i].gone = true;
        }
      }
    }
  }
  //}

  //**************cycle ends **********************/

  let whatsLeft = test.filter(function (d) {
    return d.gone !== true;
  });

  return {
    interiorWalls: whatsLeft,
    wallOne: outsidePaths,
    wallTwo: outsidePaths2,
    circleData: circlePositions
  };
}

//helper function, shuffle
function shuffle(arrayIn) {
  let returnArray = [];
  let k = arrayIn.length;

  for (let i = 0; i < k; i++) {
    let index = Math.floor(Math.random() * arrayIn.length);
    let element = arrayIn.splice(index, 1);
    returnArray.push(element[0]);
  }

  return returnArray;
}

export default mazeData;
