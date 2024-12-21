import { useState, useEffect } from "react";
import Homes from "../components/homes/Homes";
import Trending from "../components/trending/Trending";
import Upcomming from "../components/upcoming/Upcomming";
import { getAllMovies } from "../api/Movie_api/getAllmovie";
import { Grid, Box } from "@mui/material"; // Import Grid for responsive layout

const HomePage = () => {
  const [items, setItems] = useState([]);
  const [item, setItem] = useState([]);
  const [rec, setRec] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const movies = await getAllMovies();
        const shuffledMovies = movies.sort(() => 0.5 - Math.random());

        setItems(shuffledMovies.slice(0, 5)); // Upcoming Movies
        setItem(shuffledMovies.slice(5, 10)); // Latest Movies
        setRec(shuffledMovies.slice(10, 15)); // Recommended Movies
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, []);

  return (
    <Box sx={{ padding: { xs: "10px", sm: "20px", md: "40px" } }}>
      {/* Homes Section */}
      <Homes />

      {/* Upcoming Movies Section */}
      <Grid container spacing={2} direction="column" mb={4}>
        <Grid item xs={12}>
          <Upcomming items={items} title="Upcoming Movies" />
        </Grid>
      </Grid>

      {/* Latest Movies Section */}
      <Grid container spacing={2} direction="column" mb={4}>
        <Grid item xs={12}>
          <Upcomming items={item} title="Latest Movies" />
        </Grid>
      </Grid>

      {/* Trending Movies Section */}
      <Grid container spacing={2} direction="column" mb={4}>
        <Grid item xs={12}>
          <Trending items={item} />
        </Grid>
      </Grid>

      {/* Recommended Movies Section */}
      <Grid container spacing={2} direction="column" mb={4}>
        <Grid item xs={12}>
          <Upcomming items={rec} title="Recommended Movies" />
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomePage;
