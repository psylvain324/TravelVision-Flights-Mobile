import React, { Component } from 'react';
import {
  Card,
  Button,
  CardImg,
  CardTitle,
  Input,
  CardSubtitle,
  CardBody,
  Row,
  Col,
} from 'reactstrap';

export default class FlightCards extends Component {
  constructor(props) {
    super(props);

    this.handleOnchange = (event) => {
      this.setState({ [event.target.id]: event.target.value });
    };

    this.saveFlight = (data) => {
      data.Details = JSON.stringify(data.Details);
      fetch('/api/FlightAndHotels', {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((data) => console.log(data))
        .catch((err) => console.log(err));
    };

    this.choseFlight = (e, flightobj) => {
      e.preventDefault();
      console.log(flightobj);
      this.setState({ Details: flightobj }, () => {
        this.saveFlight(this.state);
      });
    };

    this.state = {
      FName: null,
      LName: null,
      Email: null,
      Details: null,
    };
  }

  render() {
    return (
      <Row>
        {this.props.concstate.flights.map((x) => (
          <Col sm="6">
            <Card key={x.QuoteId}>
              <CardImg
                top
                width="100%"
                src="https://placeholdit.imgix.net/~text?txtsize=33&txt=256%C3%97180&w=256&h=180"
                alt="Card image cap"
              />
              <CardBody>
                <CardTitle>From ${x.MinPrice}</CardTitle>
                <CardSubtitle>
                  {this.props.concstate.fromcity}(
                  {this.props.concstate.fromairport}) -{' '}
                  {this.props.concstate.tocity}({this.props.concstate.toairport}
                  )
                </CardSubtitle>
                <Input
                  type="text"
                  name="FName"
                  id="FName"
                  placeholder="First Name"
                  onChange={this.handleOnchange}
                />
                <Input
                  type="text"
                  name="LName"
                  id="LName"
                  placeholder="Last Name"
                  onChange={this.handleOnchange}
                />
                <Input
                  type="email"
                  name="Email"
                  id="Email"
                  placeholder="Email"
                  onChange={this.handleOnchange}
                />
                <Button value={x} onClick={(e) => this.choseFlight(e, x)}>
                  Chose
                </Button>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    );
  }
}
