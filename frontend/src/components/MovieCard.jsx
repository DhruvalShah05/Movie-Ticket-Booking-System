// src/components/MovieCard.js
import { Card, CardMedia, CardContent, Typography } from "@mui/material";

const MovieCard = ({ movie }) => {
  return (
    <Card sx={{ height: "100%", borderRadius: 2, boxShadow: 3 }}>
      <CardMedia
        component="img"
        height="250"
        image={movie.poster || "https://via.placeholder.com/250x350"}
        alt={movie.title}
        sx={{ objectFit: "cover" }}
      />
      <CardContent>
        <Typography variant="subtitle1" fontWeight="bold" noWrap>
          {movie.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {movie.genre}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default MovieCard;
