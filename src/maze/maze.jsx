import { useState, useRef, useEffect } from "react";
import "./mazeStyle.css";
import useWindowDimensions from "../windowSizeHook.js";
import { useReactToPrint } from "react-to-print";
import { printerPath } from "./pathSvg";
import { ReactComponent as Redo} from "./Ei-redo.svg"
import RainbowAsterisks from "./rainbowAsterisks";
import mazeFunction from "./mazeFunctionPathless.js";
import MazeFromData from "./mazeFromData.jsx";

function Maze() {
  /**
   * problem:
   * the print button renders a new instance of the maze, so it lays out differntly.
   * to fix: call mazedata() in a useEffect here and pass the data to
   * two instances of mazegrid, whihc will render the same maze, but with
   * slightly different styling/scaling.
   * BUT, first re write the Maze grid component to accept this
   * and resize/scale with CSS and viewbox, instead of fixed withd/height
   * (the problem is that i'd have to give different values to mazedata
   * as it currently stands. Mazedata should just return some coordinates,
   * with all the strokewidths and other style attributes being supplied as props,
   * depending on the size of the main app, given by useWindowDimensions)
   *
   *
   *
   * aaaaalso. the background (although faster now) rerenders
   * every time. it's all in the wrong place.
   * sort it aaaaaaaaaht.
   * since no browserRouter, just put it all together,
   * bit by bit in app.js, or relocate someof the below into it's
   * own components. split it up baby.
   *
   *
   * basically, this component needs to get all the data
   * and the ask everythign else to just do it's thing
   * when their props change.
   */

  const [thisMaze, setThisMaze] = useState(mazeFunction(5));

  /*right ^ this works lovely. simpler. get rid of old components
  and put the data / inputs into a state object.

  then, turn svgbackground into a wrapper, so it doesn't rerender the whole
  god damn time.
  */

  const handleVersionUpdate = () => {
    let obj = { ...mazeObject };
    obj.version++;

    setMazeObject(obj);
  };

  function handleNumber(val) {
    let obj = { ...mazeObject };
    obj.size = val;

    setMazeObject(obj);
  }

  const [mazeObject, setMazeObject] = useState({ size: 8, version: 0 });

  const [svgSize, setSvgSize] = useState(500);

  useEffect(() => {
    setThisMaze(mazeFunction(mazeObject.size));
  }, [mazeObject]);

  let winWid = useWindowDimensions();

  if (winWid < 499) {
    setTimeout(() => {
      setSvgSize(320 + (winWid-320)*0.9);
    }, 1000);
  } else {
    if (winWid > 750) {
      setTimeout(() => {
        setSvgSize(600);
      }, 1000);
    } else {
      setTimeout(() => {
        setSvgSize(500);
      }, 1000);
    }
  }

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current
  });

  return (
    <div
      className="mazeTopContainer"
      style={{
        margin: "0 auto",
        textAlign: "center",
        backgroundColor: "rgba(255,255,255,0.8)",
        boxShadow: "inset 0 0 2000px rgba(255, 255, 255, .5)"
      }}
    >
      <div
        style={{
          padding: "0px",
          borderRadius: "10px",
          borderTopLeftRadius: winWid < 400 ? "0px" : "10px",
          borderTopRightRadius: winWid < 400 ? "0px" : "10px",
          borderBottomLeftRadius: winWid < 400 ? "0px" : "10px",
          borderBottomRightRadius: winWid < 400 ? "0px" : "10px",
          backgroundColor: "rgba(255,255,255,0.8)",
          textAlign: "center",
          margin: "5px 0px 0px 0px",
          marginBottom: winWid < 400 ? "0px" : "20px",
          width: svgSize + 20
        }}
      >
        <div className={"titles"}>
          {winWid > 460 ? (
            <h2 style={{ margin: "10px 0px 20px 0px" }}>
              <RainbowAsterisks num={winWid > 600 ? 8 : 5} />
              &nbsp;Maze Generator&nbsp;
              <RainbowAsterisks reverse num={winWid > 600 ? 8 : 5} />
            </h2>
          ) : (
            <>
              <h2 style={{ margin: "10px 0px 20px 0px" }}>
                &nbsp;Maze Generator&nbsp;
              </h2>
              <div>
                <h2 style={{ margin: "0px" }}>
                  <RainbowAsterisks num={8} />
                  &nbsp;
                  <RainbowAsterisks reverse num={8} />
                </h2>
              </div>
            </>
          )}
        </div>
        <div className="mazeControl">
          <div style={{ 
            marginRight: "10px", 
            fontSize: Math.max(svgSize/22, 12) +"px", 
            display: "flex",
            lineHeight: "2px"}}>
            <p>Maze size:</p>
            
            <input
              className="numberInput"
              type="number"
              step="1"
              value={mazeObject.size}
              min="2"
              max="50"
              onChange={(e) => {
                handleNumber(e.target.value);
              }}
            />
          </div>
          <button
            className="enterButton"
            onClick={() => {
              handleVersionUpdate();
            }}
          >
            <Redo/>
          </button>
          <button onClick={handlePrint} className="printButton">
            <svg
              viewBox={"0 0 180 180"}
              preserveAspectRatio={"xMinYMin meet"}
              width={30}
            >
              <path
                style={{
                  fill: "white",
                  transform: "translate(0px, 25px)",
                  stroke: "white",
                  strokeWidth: "2px"
                }}
                d={printerPath}
              />
            </svg>
          </button>
        </div>

        <div className="Maze">
          <MazeFromData
            data={thisMaze}
            width={svgSize}
            height={svgSize}
            margin={30}
          />

          
        </div>
        <div style={{ display: "none", textAlign: "center", width: "540px" }}>
          <div className="mazeHidden" ref={componentRef}>
            <MazeFromData
              data={thisMaze}
              width={600}
              height={600}
              margin={30}
            />
            <br />

            <div className="creditBitHidden">
              <p>
                maze created at <a href="/maze">harrywatton.com</a>
              </p>
            </div>
          </div>
        </div>
        <br />
        <div style={{ padding: "0px 30px 0px 30px" }}>
          <h3>More info:</h3>

          <p>
            The maze is limited to 50 x 50 cells as it's exponentially slower to
            render in a browser at larger sizes, and it doesn't read very well
            either with too many cells.
          </p>

          <p>
            It is created programmatically each time using a Kruskal's Algorithm
            based method. Read more{" "}
            <a
              href="https://en.wikipedia.org/wiki/Maze_generation_algorithm"
              target="_blank"
              rel="noreferrer"
            >
              here.
            </a>
          </p>

          <p>
            One of the positives of this method is the randomised nature of the
            paths layout, which makes it look quite hectic at first glance. A
            potential drawback however, is that it tends to create lots of
            little dead-ends which can be easy to navigate around when solving.
          </p>

          <p>
            The mazes created on this page are generated each time and are free
            to use. If you'd like to borrow/improve/adapt my algorithm for your
            own project, please get in touch via my contact page. Thanks!
          </p>
        </div>
      </div>
    </div>
  );
}

export default Maze;
