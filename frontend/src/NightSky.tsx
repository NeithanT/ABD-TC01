import './App.css'

function NightSky() {
  const count = 10;

  const stars = [];

  for (let i = 0; i < count; i++)
  {
    let star = document.createElement("div");
    star.style.top = (Math.random() % 1024 + 100) + "px";
    star.style.left = (Math.random() % 1024 + 100) + "px";

    star.style.width = (Math.random() % 50) + "px";
    star.classList.add("star");

    stars.push(star);
  }

  return (
    <>
      <div>
        {stars}
      </div>
    </>
  )
}

export default NightSky
