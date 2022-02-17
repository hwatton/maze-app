

function SvgBackground(props) {
  /**
   * first things first. this is better if it's a pattern,
   * or a simple svg file.
   * please rewrite this/ do some basic stuff.
   * no need for it to be calculating on each resize!
   * make a large svg, (it will still be small size-wise) and just
   * centre it to give the effect of it being all-over
   */

  const colours = [
    "rgb(120,0,210)",
    "rgb(50,170,250)",
    "rgb(100,250,175)",
    "rgb(125,255,0)",
    "rgb(255,255,0)",
    "rgb(255,125,0)",
    "rgb(255,0,0)",
    "rgb(255,0,205)",
    "rgb(120,0,210)"
  ];

  const wd = props.width * 2; //make sure it fits ANYTHING
  const spc = 15; // how big each square is in pixels
  let gSz = 200; //how many rows /columns
  const pWid = 8; // strokeWidth
  const revisedTotalWidth = Math.min(spc * gSz, wd);

  gSz = 2 + Math.floor(revisedTotalWidth / spc);
  // +2 so it covers any cheeky translates.

  let pathArrays = [];

  for (let i = 0; i < gSz; i++) {
    for (let j = 0; j < gSz; j++) {
      let lineData;

      if (Math.random() > 0.5) {
        lineData =
          "M" +
          i * spc +
          "," +
          (j * spc - pWid / 2) +
          "L" +
          i * spc +
          "," +
          (pWid / 2 + (j + 1) * spc);

        pathArrays.push(lineData);
      }

      if (Math.random() > 0.5) {
        lineData =
          "M" +
          ((i - 1) * spc - pWid / 2) +
          "," +
          j * spc +
          "L" +
          (i * spc + pWid / 2) +
          "," +
          j * spc;

        pathArrays.push(lineData);
      }
    }
  }

  /*

leaving this to remind myself of improvements!

  const pathsV = [...Array(gSz)].map((el, i) => {
    return [...Array(gSz)].map((element, index) => {
      const lineData =
        "M" +
        i * spc +
        "," +
        (index * spc - pWid / 2) +
        "L" +
        i * spc +
        "," +
        (pWid / 2 + (index + 1) * spc);

      if (Math.random() > 0.5) {
        return null;
      } else {
        pathArrays.push(lineData);
        return (
          <motion.path
            key={"gridV" + i + "_" + index}
            d={lineData}
            animate={{
              stroke: colours,
              transition: {
                duration: 10,
                repeat: "Infinity"
              }
            }}
            style={{
              strokeWidth: pWid + "px"
            }}
          />
        );
      }
    });
  });

  const pathsH = [...Array(gSz)].map((el, i) => {
    return [...Array(gSz)].map((element, index) => {
      const lineData =
        "M" +
        ((i - 1) * spc - pWid / 2) +
        "," +
        index * spc +
        "L" +
        (i * spc + pWid / 2) +
        "," +
        index * spc;

      if (Math.random() > 0.5) {
        return null;
      } else {
        pathArrays.push(lineData);
        return (
          <motion.path
            key={"gridH" + i + "_" + index}
            d={lineData}
            animate={{
              stroke: colours,
              transition: {
                duration: 10,
                repeat: "Infinity"
              }
            }}
            style={{
              strokeWidth: pWid + "px"
            }}
          />
        );
      }
    });
  });

  */

  const longPath = (
    <path
      d={pathArrays.join()}
      style={{
        stroke: colours[Math.floor(Math.random() * colours.length)],
        strokeWidth: pWid + "px"
      }}
    />
  );
  return (
    <div style={{ position: "absolute", margin: 0, padding: 0, zIndex: "-1" }}>
      <svg height={5000} width={revisedTotalWidth}>
        <g
          style={{
            transform: "translate(-13.1px, -8.1px)"
          }}
        >
          {longPath}
        </g>
      </svg>
    </div>
  );
}

export default SvgBackground;

/**
 * <rect
          x="0"
          y="0"
          width="5000"
          height="5000"
          style={{ stroke: "none", fill: "url(#pattern1)" }}
        />
 */
