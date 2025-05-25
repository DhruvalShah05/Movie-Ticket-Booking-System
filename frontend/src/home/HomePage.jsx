import { useState, useEffect } from "react";
import Homes from "../components/homes/Homes";
import Trending from "../components/trending/Trending";
import MovieCard from "../components/MovieCard"; // Create this for individual movie display
import { getAllMovies } from "../api/Movie_api/getAllmovie";
import { Grid, Box, Typography, Container } from "@mui/material";

const HomePage = () => {
  const [upcoming, setUpcoming] = useState([]);
  const [latest, setLatest] = useState([]);
  const [recommended, setRecommended] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const movies = await getAllMovies();
        const shuffled = movies.sort(() => 0.5 - Math.random());

        setUpcoming(shuffled.slice(0, 5));
        setLatest(shuffled.slice(5, 10));
        setRecommended(shuffled.slice(10, 15));
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, sm: 4, md: 6 } }}>
      {/* Hero Section */}
      <Box mb={5}>
        <Homes />
      </Box>

      {/* Section Reusable */}
      {[
        { title: "Upcoming Movies", data: upcoming },
        { title: "Latest Movies", data: latest },
        { title: "Recommended For You", data: recommended }
      ].map((section, idx) => (
        <Box key={idx} mb={6}>
          <Typography
            variant="h5"
            fontWeight="bold"
            gutterBottom
            sx={{ textAlign: { xs: "center", sm: "left" } }}
          >
            {section.title}
          </Typography>
          <Grid container spacing={3}>
            {section.data.map((movie, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <MovieCard movie={movie} />
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}

      {/* Trending Section (Full Width) */}
      <Box mb={6}>
        <Typography
          variant="h5"
          fontWeight="bold"
          gutterBottom
          sx={{ textAlign: { xs: "center", sm: "left" } }}
        >
          Trending Now
        </Typography>
        <Trending items={latest} />
      </Box>
    </Container>
  );
};

export default HomePage;
