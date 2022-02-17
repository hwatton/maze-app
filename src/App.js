import "./styles.css";
import Maze from "./maze/maze.jsx";
import SvgBackground from "./maze/svgBackground.jsx";

export default function App() {
  return (
    <div className="App">
      <div
        className="wholeThing"
        style={{
          margin: "0px",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <SvgBackground width={2000} />
        <Maze />
      </div>
    </div>
  );
}
