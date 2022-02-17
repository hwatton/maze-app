function MazeFromData(props) {
  /** expects, data(object) width(number) height(number) margin(pixels, defaults to 5%)
   * ! eventually rewrite mazeFunction to work on rectangles.
   * just don't get them loops mixed up!
   */
  const mZ = props.data.mazeSize;
  const ht = props.margin
    ? props.height - 2 * props.margin
    : props.height * 0.95;
  const wd = ht;
  const pLen = wd / mZ;
  const lineWidth = Math.floor(Math.max(pLen / 10, 1));
  const pathStyle = {
    stroke: "black",
    strokeWidth: lineWidth + "px",
    strokeLinecap: "round"
  };

  const interiorPaths = props.data.pathData.map((el, i) => {
    const lineData = pointsToLine(el.pathData, pLen, lineWidth);

    return <path key={"mazeLine_" + i} style={pathStyle} d={lineData} />;
  });

  const sides = [
    [
      { x: 0, y: 0 },
      { x: 0, y: mZ }
    ],
    [
      { x: 0, y: mZ },
      { x: mZ - 1, y: mZ }
    ],
    [
      { x: 1, y: 0 },
      { x: mZ, y: 0 }
    ],
    [
      { x: mZ, y: 0 },
      { x: mZ, y: mZ }
    ]
  ].map((el, i) => {
    const lineData = pointsToLine(el, pLen, lineWidth);

    return <path key={"outerLine_" + i} style={pathStyle} d={lineData} />;
  });

  return (
    <div
      style={{ height: props.height, width: props.width, textAlign: "center" }}
    >
      <svg height={ht + lineWidth} width={wd + lineWidth} style={{ backgroundColor: "white"}}>
        <g
          style={{
            transform:
              "translate(" + lineWidth / 2 + "px, " + lineWidth / 2 + "px)"
          }}
        >
          {interiorPaths}
          {sides}
        </g>
      </svg>
    </div>
  );
}

function pointsToLine(arr, size) {
  const pathString =
    "M" +
    arr[0].x * size +
    "," +
    arr[0].y * size +
    "L" +
    arr[1].x * size +
    "," +
    arr[1].y * size;

  return pathString;
}

export default MazeFromData;
