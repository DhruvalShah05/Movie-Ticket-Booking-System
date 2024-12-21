import { useState, useEffect } from "react";
import Home from "./Home";
import { getAllMovies } from "../../api/Movie_api/getAllmovie";

const Homes = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const movies = await getAllMovies();
        setItems(movies);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, []);

  return (
    <>
      <section
        className="home"
        style={{
          margin: "0 20px", // Apply margin on both sides
        }}
      >
        <Home items={items} />
      </section>
      <div className="margin" style={{ height: "20px" }}></div> {/* Space below */}
    </>
  );
};

export default Homes;
