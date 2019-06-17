import React, { Component } from "react";
import axios from "axios";
import moment from "moment-timezone";
import Countdown from "react-countdown-now";

import "./App.css";

const NODE_URL = "https://node01.lisk.io/api/loader/status/sync";
const targetBlockheight = 6901027;
const visualTargetBlockheight = "6,901,027";
const estimatedDate = "Wed Aug 29 2018 11:13:44 GMT+0200 (Central European Summer Time)"; // showed while calculating
const teasingMessage = "Lisk Core 1.0 is about to be launched on Mainnet!";
const successMessage = "Oh Yeah! Core 1.0 is live on Mainnet!";

class App extends Component {
  constructor() {
    super();
    this.state = {
      blockHeight: "parsing",
      blocksRemaining: "parsing",
      calculatedDate: estimatedDate,
      targetBlockheight
    };
  }

  calculate = async () => {
    this.getBlockHeight();
    const currentHeight = this.state.blockHeight;
    const finalHeight = this.state.targetBlockheight;

    if (typeof currentHeight !== "number") return;

    const currentTime = moment.tz(moment.tz.guess());
    const blocksRemaining = finalHeight - currentHeight;
    const secondsRemaining = blocksRemaining * 10;
    const currentTimestamp = currentTime.unix();
    const resultTimestamp = currentTimestamp + secondsRemaining;

    this.setState({
      calculatedDate: new Date(resultTimestamp * 1000),
      blocksRemaining,
      blockHeight: currentHeight
    });
  };

  getBlockHeight = async () => {
    const response = await axios.get(NODE_URL);
    this.setState({ blockHeight: response.data.height });
  };

  componentDidMount() {
    setTimeout(() => {
      this.calculate();
    }, 2000);
    this.interval = setInterval(() => {
      this.calculate();
    }, 10000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    clearInterval(this.intervalHeight);
  }

  render() {
    const countDownRender = ({ days, hours, minutes, seconds, completed }) => {
      if (completed) {
        return <h2>🎉 {successMessage} 🎉</h2>;
      } else {
        return (
          <h2>
            {days
              ? <span>
                  <span id="countdown">{days}</span> Days
                </span>
              : null}{" "}
            {hours
              ? <span>
                  <span id="countdown">{hours}</span> Hours
                </span>
              : null}{" "}
            {minutes
              ? <span>
                  <span id="countdown">{minutes}</span> Minutes and
                </span>
              : null}{" "}
            {" "}
            <span>
              <span id="countdown">{seconds}</span> Seconds!
            </span>
          </h2>
        );
      }
    };

    return (
      <div className="App">
        <div className="top-image">
          <section className="content">
            <div className="planet" />
            <div className="astronaut" />
          </section>
        </div>
        <div className="container">
          <div className="content-text">
            <div className="text">
              <h1>We are almost there!</h1>
              <h2>{teasingMessage}</h2>
              <h3>
                The fork will happen at block {visualTargetBlockheight}. Which means in more or
                less:
              </h3>

              <Countdown
                date={new Date(moment(this.state.calculatedDate))}
                renderer={countDownRender}
              />
            </div>
          </div>
        </div>

        <footer className="footer-blockheight">
          <p>
            Current Block Height <strong>{this.state.blockHeight}</strong> |
            Est. fork:{" "}
            <strong>{new Date(this.state.calculatedDate).toString()}</strong>
          </p>
          <p>
            The countdown auto adjusts itself according to the number of missed
            blocks
          </p>
          <p>
            Made with {"<3"} by Carbonara
          </p>
        </footer>
        <footer className="credits">Vote for Carbonara!</footer>
      </div>
    );
  }
}

export default App;
