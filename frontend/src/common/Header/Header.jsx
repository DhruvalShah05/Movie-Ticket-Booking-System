import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { useEffect } from 'react';
import { useMediaQuery } from '@mui/material';

function Header() {
  const [value, setValue] = useState(0);
  const [openTheaterDialog, setOpenTheaterDialog] = useState(false);
  const [openMovieDialog, setOpenMovieDialog] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false); // Drawer state
  const [theater, setTheater] = useState({
    name: '',
    city: '',
    ticketPrice: '',
    seats: '',
    image: '',
  });
  const [movie, setMovie] = useState({
    title: '',
    image: '',
    language: '',
    genre: '',
    director: '',
    trailer: '',
    description: '',
    duration: '',
    startDate: '',
    endDate: '',
    timeSlots: [],
  });
  const [newTimeSlot, setNewTimeSlot] = useState('');

  const userEmail = localStorage.getItem("userEmail") || "";
  const userInitial = userEmail ? userEmail.charAt(0).toUpperCase() : "";
  const userType = localStorage.getItem("userType") || "";

  const navigate = useNavigate();
  
  const isMobile = useMediaQuery('(max-width: 768px)'); // Check if the screen size is mobile

  useEffect(() => {
    document.body.style.inert = openTheaterDialog || openMovieDialog ? 'true' : 'false';
    return () => {
      document.body.style.inert = 'false';
    };
  }, [openTheaterDialog, openMovieDialog]);

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    navigate("/");
    window.location.reload();
  };

  const handleOpenDrawer = () => setOpenDrawer(true);
  const handleCloseDrawer = () => setOpenDrawer(false);

  const handleOpenTheaterDialog = () => {
    setOpenTheaterDialog(true);
  };

  const handleCloseTheaterDialog = () => {
    setOpenTheaterDialog(false);
  };

  const handleOpenMovieDialog = () => {
    setOpenMovieDialog(true);
  };

  const handleCloseMovieDialog = () => {
    setOpenMovieDialog(false);
  };

  const handleTheaterChange = (e) => {
    const { name, value } = e.target;
    setTheater({
      ...theater,
      [name]: value,
    });
  };

  const handleMovieChange = (e) => {
    const { name, value } = e.target;
    setMovie({
      ...movie,
      [name]: value,
    });
  };

  const handleAddTimeSlot = () => {
    if (newTimeSlot) {
      setMovie({ ...movie, timeSlots: [...movie.timeSlots, newTimeSlot] });
      setNewTimeSlot('');
    }
  };

  const handleSaveTheater = async () => {
    if (!theater.name || !theater.city || !theater.ticketPrice || !theater.seats || !theater.image) {
      alert("Please fill all the fields and provide an image URL.");
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert("You are not authenticated. Please log in.");
      return;
    }

    const theaterData = {
      name: theater.name,
      city: theater.city,
      ticketPrice: parseFloat(theater.ticketPrice),
      seats: theater.seats.split(',').map(Number),
      image: theater.image,
    };

    try {
      const response = await fetch('http://localhost:5000/api/theatres/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(theaterData),
      });

      if (!response.ok) {
        throw new Error('Admin can create only one theater');
      }

      const result = await response.json();
      console.log('Theater added:', result);

      setTheater({
        name: '',
        city: '',
        ticketPrice: '',
        seats: '',
        image: '',
      });
      handleCloseTheaterDialog();
    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
    }
  };

  const handleSaveMovie = async () => {
    if (!movie.title || !movie.description || !movie.language || !movie.genre || !movie.director || !movie.duration || !movie.startDate || !movie.endDate || !movie.image || !movie.trailer) {
      alert("Please fill all the fields and provide necessary details.");
      return;
    }

    const token = localStorage.getItem('token');
    const adminId = localStorage.getItem('adminId');

    if (!token) {
      alert("You are not authenticated or admin ID is missing. Please log in again.");
      return;
    }

    const movieData = {
      title: movie.title,
      description: movie.description,
      language: movie.language,
      genre: movie.genre,
      director: movie.director,
      duration: parseInt(movie.duration),
      startDate: movie.startDate,
      endDate: movie.endDate,
      image: movie.image,
      trailer: movie.trailer,
      adminId: adminId,
      timeSlots: movie.timeSlots,
    };

    try {
      const response = await fetch('http://localhost:5000/api/movies/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(movieData),
      });

      if (!response.ok) {
        throw new Error('Failed to add movie. Please check your inputs.');
      }

      const result = await response.json();
      console.log('Movie added:', result);

      setMovie({
        title: '',
        description: '',
        language: '',
        genre: '',
        director: '',
        duration: '',
        startDate: '',
        endDate: '',
        image: '',
        trailer: '',
        timeSlots: [],
      });
      handleCloseMovieDialog();
    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
    }
  };

  return (
    <>
      <AppBar position='sticky' sx={{background: "black"}}>
        <Toolbar>
          <Box width={"20%"}>
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" height='40'>
              <path d="M20 3H4c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zm.001 6c-.001 0-.001 0 0 0h-.465l-2.667-4H20l.001 4zM15.5 15 10 18v-6l5.5 3zm-.964-6-2.667-4h2.596l2.667 4h-2.596zm-2.404 0H9.536L6.869 5h2.596l2.667 4zM4 5h.465l2.667 4H4V5z" fill="#ffffff"></path>
            </svg>
          </Box>
          
          {/* Hamburger Menu for Mobile */}
          {isMobile && (
            <IconButton color="inherit" onClick={handleOpenDrawer}>
              <MenuIcon />
            </IconButton>
          )}

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box display={'flex'} marginLeft={'auto'} sx={{cursor:'pointer'}}>
              <Tabs textColor='inherit' indicatorColor='secondary' onChange={(e,val) => setValue(val)}>
                <Tab label="Home" component={Link} to="/" sx={{color:"white"}} />
                <Tab label="Theater" component={Link} to="/theater" sx={{color:"white"}} />
                <Tab label="Movies" component={Link} to="/movie" sx={{color:"white"}} />
                {userType === 'Admin' && (
                  <Box>
                    <Tab label="Add Your Theater" onClick={handleOpenTheaterDialog} sx={{ color: "white" }} />
                    <Tab label="Add Movie" onClick={handleOpenMovieDialog} sx={{ color: "white" }} />
                  </Box>
                )}
                {userInitial ? (
                  <Box display="flex" alignItems="center">
                    <Box sx={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: '#1b1b1b', color: 'white', fontWeight: 'bold', textTransform: 'uppercase', marginRight: 2, cursor: 'pointer' }} onClick={() => { userType === 'Admin' ? navigate('/admin') : navigate('/user'); }}>
                      {userInitial}
                    </Box>
                    <Button variant="outlined" sx={{ color: "white", borderColor: "white" }} onClick={handleLogout}>Logout</Button>
                  </Box>
                ) : (
                  <Tab label="Sign Up" component={Link} to="/register" sx={{ color: "white" }} />
                )}
              </Tabs>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Drawer for Mobile */}
      <Drawer anchor="left" open={openDrawer} onClose={handleCloseDrawer}>
        <List>
          <ListItem button component={Link} to="/" onClick={handleCloseDrawer}>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button component={Link} to="/theater" onClick={handleCloseDrawer}>
            <ListItemText primary="Theater" />
          </ListItem>
          <ListItem button component={Link} to="/movie" onClick={handleCloseDrawer}>
            <ListItemText primary="Movies" />
          </ListItem>
          {userType === 'Admin' && (
            <>
              <ListItem button onClick={handleOpenTheaterDialog}>
                <ListItemText primary="Add Theater" />
              </ListItem>
              <ListItem button onClick={handleOpenMovieDialog}>
                <ListItemText primary="Add Movie" />
              </ListItem>
            </>
          )}
          {userInitial ? (
            <>
              <ListItem button onClick={handleLogout}>
                <ListItemText primary="Logout" />
              </ListItem>
            </>
          ) : (
            <ListItem button component={Link} to="/register" onClick={handleCloseDrawer}>
              <ListItemText primary="Sign Up" />
            </ListItem>
          )}
        </List>
      </Drawer>

      {/* Dialog for adding theater and movie remain the same */}
      {/* Theater Dialog and Movie Dialog components */}
    </>
  );
}

export default Header;
