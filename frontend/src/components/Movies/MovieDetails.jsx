import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieById } from '../../api/Movie_api/getAllmovie';
import { fetchBookedSeats, saveReservation, sendOTP, verifyOTP } from '../../api/Reservation_api/Reservation';
import { v4 as uuidv4 } from 'uuid';
import { useMediaQuery } from '@mui/material';  // Import for responsive design

const MovieDetails = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [openBookingDialog, setOpenBookingDialog] = useState(false);
  const [openUserInfoDialog, setOpenUserInfoDialog] = useState(false);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [Seats, setSeats] = useState([]);
  const [Date, setDate] = useState('');
  const [Time, setTime] = useState('');
  const [userInfo, setUserInfo] = useState({ name: '', phone: '', email: '' });
  const [ticketPrice, setTicketPrice] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [otp, setOtp] = useState('');

  const dateOptions = ['2024-09-01', '2024-09-02', '2024-09-03', '2024-09-04', '2024-09-05'];

  const isMobile = useMediaQuery('(max-width:600px)');  // Media query for responsiveness

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const data = await getMovieById(movieId);
        setMovie(data);
        setTicketPrice(data.theater.ticketPrice); 
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  useEffect(() => {
    if (Date && Time) {  // Fetching Booked Seats
      const fetchBookedSeatsData = async () => {  
        const bookedSeats = await fetchBookedSeats(movieId, Date, Time);
        setBookedSeats(bookedSeats);
      };
      fetchBookedSeatsData();
    }
  }, [Date, Time, movieId]);

  if (!movie) {
    return <Typography variant="h5" color="white">Loading...</Typography>;
  }

  const handleBookingDialogOpen = () => setOpenBookingDialog(true);
  const handleBookingDialogClose = () => setOpenBookingDialog(false);
  const handleUserInfoDialogClose = () => setOpenUserInfoDialog(false);
  const handleOpenPaymentDialog = () => setOpenPaymentDialog(true);
  const handleClosePaymentDialog = () => setOpenPaymentDialog(false);

  const handleSeatClick = (seat) => {
    if (!bookedSeats.includes(seat)) {
      setSeats((prev) => prev.includes(seat) ? prev.filter(s => s !== seat) : [...prev, seat]);
    }
  };

  const handleDateClick = (date) => setDate(date);
  const handleTimeClick = (time) => setTime(time);

  const handleUserChange = (event) => {
    const { name, value } = event.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const updateTotalAmount = () => {
    const totalSeats = Seats.length;
    const amount = totalSeats * ticketPrice; 
    setTotalAmount(amount);
  };

  const handleBookingConfirm = () => {
    if (!Date || !Time) {
      alert('Please select both date and time');
      return;
    }
    updateTotalAmount(); 
    setOpenBookingDialog(false);
    setOpenUserInfoDialog(true);
  };

  const handleOtpChange = (event) => setOtp(event.target.value);

  const handleUserInfoConfirm = async () => {
    if (!Date || !Time || Seats.length === 0) {
      alert('Please select date, time, and seats');
      return;
    }

    if (!userInfo.name || !userInfo.phone) {
      alert("Please enter valid name and phone number");
      return;
    }

    try {
      await sendOTP(userInfo.email);
      console.log('OTP sent successfully');
    } catch (error) {
      console.error('Error sending OTP:', error);
      alert('Error sending OTP. Please try again.');
      return;
    }

    handleUserInfoDialogClose();
    handleOpenPaymentDialog(); 
  };

  const handleConfirmPayment = async () => {
    try {
      const response = await verifyOTP(userInfo.email, otp);
      if (response.data.message !== 'OTP verified successfully') {
        alert('Invalid OTP. Please try again.');
        return;
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      alert('Error verifying OTP. Please try again.');
      return;
    }

    const reservationData = {
      date: Date,
      startAt: Time,
      seats: Seats,
      isBooked: true, 
      orderID: uuidv4(),
      ticketPrice: ticketPrice,
      movie: movie._id,
      theatre: movie.theater._id, 
      name: userInfo.name,
      phone: userInfo.phone,
      email: userInfo.email,
    };

    try {
      const response = await saveReservation(reservationData);
      console.log('Reservation successfully saved:', response.data);
    } catch (error) {
      console.error('Error saving reservation:', error);
      alert('There was an error saving your reservation. Please try again.');
    }

    alert('Your Tickets Are Booked!'); 
    setSeats([]);
    setDate('');
    setTime('');
    setUserInfo({ name: '', phone: '' });
    setTotalAmount(0);
    handleClosePaymentDialog();
  };

  const renderSeats = () => {
    const rows = 10;
    const columns = 20;
    const seats = [];

    for (let i = 0; i < rows; i++) {
      const rowLabel = String.fromCharCode(65 + i);
      for (let j = 1; j <= columns; j++) {
        const seat = `${rowLabel}${j}`;
        seats.push(
          <Button
            key={seat}
            variant={Seats.includes(seat) ? "contained" : "outlined"}
            onClick={() => handleSeatClick(seat)}
            disabled={bookedSeats.includes(seat)}
            sx={{ margin: '2px', width: '40px', height: '40px' }}
          >
            {seat}
          </Button>
        );
      }
    }

    return seats;
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Grid container spacing={2}>
        {/* Movie Details */}
        <Grid item xs={12} md={6}>
          <img
            src={movie.image}
            alt="Movie"
            style={{ width: '100%', borderRadius: 8 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h4">{movie.title}</Typography>
          <Typography variant="body1" sx={{ marginBottom: 1 }}><b>Genre:</b> {movie.genre}</Typography>
          <Typography variant="body1" sx={{ marginBottom: 1 }}><b>Language:</b> {movie.language}</Typography>
          <Typography variant="body1" sx={{ marginBottom: 1 }}><b>Duration:</b> {movie.duration}</Typography>
          <Typography variant="body1" sx={{ marginBottom: 1 }}><b>Director:</b> {movie.director}</Typography>
          <Typography variant="body1" sx={{ marginBottom: 2 }}>{movie.description}</Typography>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={handleBookingDialogOpen}
          >
            Book Movie
          </Button>
        </Grid>
      </Grid>

      {/* Booking Dialog */}
      <Dialog open={openBookingDialog} onClose={handleBookingDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>Book Movie</DialogTitle>
        <DialogContent>
          <Typography>Select Date:</Typography>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {dateOptions.map((date) => (
              <Grid item xs={4} key={date}>
                <Button
                  variant={Date === date ? "contained" : "outlined"}
                  onClick={() => handleDateClick(date)}
                  sx={{ width: '100%' }}
                >
                  {date}
                </Button>
              </Grid>
            ))}
          </Grid>

          <Typography sx={{ mt: 3 }}>Select Time:</Typography>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {movie.timeSlots.map((slot, index) => (
              <Grid item xs={4} key={index}>
                <Button
                  variant={Time === slot ? "contained" : "outlined"}
                  onClick={() => handleTimeClick(slot)}
                  sx={{ width: '100%' }}
                >
                  {slot}
                </Button>
              </Grid>
            ))}
          </Grid>

          <Typography variant="h6" sx={{ mt: 3 }}>Select Seats:</Typography>
          <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {renderSeats()}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleBookingDialogClose}>Cancel</Button>
          <Button onClick={handleBookingConfirm}>Confirm Booking</Button>
        </DialogActions>
      </Dialog>

      {/* User Info Dialog */}
      <Dialog open={openUserInfoDialog} onClose={handleUserInfoDialogClose}>
        <DialogTitle>User Information</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            variant="outlined"
            name="name"
            value={userInfo.name}
            onChange={handleUserChange}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            name="email"
            value={userInfo.email}
            onChange={handleUserChange}
          />
          <TextField
            margin="dense"
            label="Phone"
            type="text"
            fullWidth
            variant="outlined"
            name="phone"
            value={userInfo.phone}
            onChange={handleUserChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUserInfoDialogClose}>Cancel</Button>
          <Button onClick={handleUserInfoConfirm}>Confirm</Button>
        </DialogActions>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={openPaymentDialog} onClose={handleClosePaymentDialog}>
        <DialogTitle>Payment</DialogTitle>
        <DialogContent>
          <Typography variant="h6">Total Amount: ${totalAmount}</Typography>
          <TextField
            margin="dense"
            label="Enter OTP"
            type="text"
            fullWidth
            variant="outlined"
            value={otp}
            onChange={handleOtpChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePaymentDialog}>Cancel</Button>
          <Button onClick={handleConfirmPayment}>Pay Now</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MovieDetails;
