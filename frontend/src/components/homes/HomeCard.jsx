import { Link } from "react-router-dom";
import { useState } from "react";
import { Card, Button, Row, Col } from 'react-bootstrap';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import { Box, Typography } from '@mui/material';

const HomeCard = ({
  item: {
    _id: movieId,
    image,
    title,
    description,
    duration,
    language,
    genre,
  },
}) => {
  const [isTrailerPlaying, setIsTrailerPlaying] = useState(false);

  const handlePlayTrailer = () => {
    setIsTrailerPlaying(true);
  };

  const formatDuration = (duration) => {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours}hr : ${minutes}mins`;
  };

  return (
    <Card className="mb-4" style={{ border: "none", position: "relative" }}>
      {/* Banner image */}
      <Card.Img
        variant="top"
        src={image}
        alt={title}
        style={{
          width: '100%',
          height: '400px', // Adjust to your desired banner height
          objectFit: 'cover', // Makes the image cover the area
        }}
      />

      {/* Overlay Content */}
      <Box
        sx={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          zIndex: 1,
          color: 'white',
          width: '100%',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Title and details */}
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          {title}
        </Typography>
        <Typography variant="body1" sx={{ marginTop: '8px' }}>
          {language} | {genre} | {formatDuration(duration)}
        </Typography>
        <Typography variant="body2" sx={{ marginTop: '10px', maxWidth: '500px' }}>
          {description}
        </Typography>

        {/* Play Now Button */}
        <Link to={`/movie/${movieId}`}>
          <Button
            variant="primary"
            sx={{
              marginTop: '20px',
              textTransform: 'none',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <PlayCircleFilledIcon sx={{ marginRight: 1 }} />
            Play Now
          </Button>
        </Link>
      </Box>
    </Card>
  );
};

export default HomeCard;
