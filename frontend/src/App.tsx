import './App.css'

function App() {

  type Star = {
    x: number;
    y: number;
    size: number;
  };

  const count = 10;
  const stars: Star[] = [];

  for (let i = 0; i < count; i++)
  {
    let newStar: Star = {x: 0, y: 0, size: 0};

    newStar.x = (Math.random() * 1000);
    newStar.y = (Math.random() * 1000);

    newStar.size = (Math.random() * 15 + 2);

    stars.push(newStar);
  }

  return (
    <>
      <section id="center">
          {
            stars.map((starssss, index) => (
              <div key={index} className="star"
                style={{
                width: starssss.size + "px",
                height: starssss.size + "px",
                left: starssss.x + "px",
                top: starssss.y + "px"
              }}></div>
              )
            )

          }
      </section>
    </>
  )
}

export default App
