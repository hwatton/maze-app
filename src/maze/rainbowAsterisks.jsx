

function RainbowAsterisks(props) {
  const colours = [
    "rgb(120,0,210)",
    "rgb(50,170,250)",
    "rgb(100,250,175)",
    "rgb(125,255,0)",
    "rgb(255,255,0)",
    "rgb(255,125,0)",
    "rgb(255,0,0)",
    "rgb(255,0,205)"
  ];

  const someCols = colours.slice(0, props.num);

  const colsToUse = props.reverse ? someCols : someCols.reverse();

  const risks = [...Array(props.num)].map((el, i) => {
    return (
      <span key={"risk" + i} style={{ color: colsToUse[i] }}>
        *
      </span>
    );
  });

  return risks;
}

export default RainbowAsterisks;
