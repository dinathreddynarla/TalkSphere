import React from 'react';
import { Carousel, Card } from 'antd';
import 'antd/dist/reset.css';
import meetnew from "../assets/meetnew.jpg";
import meetnew2 from "../assets/meetnew2.jpg";
import meetnew3 from "../assets/meetnew3.jpg";
import "../Styles/Carousal.css"
const { Meta } = Card;

const Carousal = () => {
    const imageStyle = {
        borderRadius: '50%', // Makes the image rounded
      };
  return (
    <div className="carousel-container">
      <Carousel autoplay dots={true} infinite={true}>
        <div>
          <Card
            hoverable
            className="carousel-card"
            cover={<img alt="card1" src={meetnew} className="carousel-image" style={imageStyle} />}
          >
            <h2 className="carousel-heading">Connect with People from Anywhere</h2>
          </Card>
        </div>
        <div>
          <Card
            hoverable
            className="carousel-card"
            cover={<img alt="card2" src={meetnew2} className="carousel-image" style={imageStyle} />}
          >
            <h2 className="carousel-heading">Schedule your meetings</h2>
          </Card>
        </div>
        <div>
          <Card
            hoverable
            className="carousel-card"
            cover={<img alt="card3" src={meetnew3} className="carousel-image" style={imageStyle}/>}
          >
            <h2 className="carousel-heading">Get a new link for a meeting</h2>
          </Card>
        </div>
      </Carousel>
    </div>
  );
};

export default Carousal;
