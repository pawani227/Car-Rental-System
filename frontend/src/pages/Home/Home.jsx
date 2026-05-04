import "./Home.css";
import homeBg from "../../assets/homebg.jpg";

function HomePage() {
  return (
    <div className="home-page" style={{ backgroundImage: `url(${homeBg})` }}>
      <h1>Home</h1>
    </div>
  );
}

export default HomePage;
