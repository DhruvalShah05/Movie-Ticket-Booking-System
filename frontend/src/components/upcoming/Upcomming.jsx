import { Link } from "react-router-dom";
import Ucard from "./Ucard";
import Slider from "react-slick";
import { Container, Row, Col, Button } from 'react-bootstrap'; // Bootstrap components
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';

const SampleNextArrow = (props) => {
  const { onClick } = props;
  return (
    <div className="control-btn" onClick={onClick}>
      <Button variant="success" className="next nextup">
        <ArrowCircleRightIcon />
      </Button>
    </div>
  );
};

const SamplePrevArrow = (props) => {
  const { onClick } = props;
  return (
    <div className="control-btn" onClick={onClick}>
      <Button variant="success" className="prev prevup">
        <ArrowCircleLeftIcon />
      </Button>
    </div>
  );
};

const Upcomming = ({ items, title }) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <section className="upcome" style={{ marginBottom: '40px' }}>
      <Container>
        <div className="heading d-flex justify-content-between" style={{ marginTop: title === "Upcoming Movies" ? "800px" : "0" }}>
          <h1>{title}</h1>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Button variant="outline-success">View All</Button>
          </Link>
        </div>
        <div className="content">
          <Slider {...settings}>
            {items.map((item) => (
              <div key={item._id}>
                <Ucard item={item} />
              </div>
            ))}
          </Slider>
        </div>
      </Container>
    </section>
  );
};

export default Upcomming;
