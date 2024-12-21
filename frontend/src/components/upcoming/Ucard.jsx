import { Link } from "react-router-dom";
import { Box, Button, Typography } from '@mui/material';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';

const Ucard = ({
  item: {
    _id: movieId, 
    image,
    title,
    duration,
  },
}) => {
  return (
    <Box
      sx={{
        border: '1px solid #444',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: 3,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#000',
      }}
    >
      {/* Image Section */}
      <Box sx={{ position: 'relative' }}>
        <img 
          src={image} 
          alt={title} 
          style={{ width: '100%', height: 'auto', display: 'block' }} 
        />
      </Box>

      {/* Text Section */}
      <Box sx={{ padding: 2 }}>
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'grey.400' }}>
          {duration}
        </Typography>
        <Link to={`/movie/${movieId}`} style={{ textDecoration: 'none' }}>
          <Button
            variant="contained"
            color="success"
            sx={{
              marginTop: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px 16px',
            }}
          >
            <PlayCircleFilledWhiteIcon sx={{ marginRight: 1 }} />
            PLAY NOW
          </Button>
        </Link>
      </Box>
    </Box>
  );
};

export default Ucard;
