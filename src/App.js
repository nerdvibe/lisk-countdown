import React, { Component } from "react";
import axios from "axios";
import moment from "moment-timezone";
import Countdown from "react-countdown-now";

import "./App.css";

const NODE_URL = "https://mainnet.lisk.io/api/node/status";
const targetBlockheight = 16270292;
const secondaryTarget = 16332092;
const visualTargetBlockheight = "16,270,292";
const estimatedDate = "Sat Aug 21 2021"; // showed while calculating
const teasingMessage = "🔨 Mainnet Core 3.0 fork";
const successMessage = "Oh Yeah! Mainnet Core 3.0 should be live!";
const whatFor = "Lisk Mainnet 3.0 fork!";
const secondaryMessage = "delegation migration";

class App extends Component {
  constructor() {
    super();
    this.state = {
      blockHeight: "parsing",
      blocksRemaining: "parsing",
      calculatedDate: estimatedDate,
      calculatedDate8red: estimatedDate,
      targetBlockheight,
      calculated: false
    };
  }

  calculate = async () => {
    await this.getBlockHeight();
    const currentHeight = this.state.blockHeight;
    const finalHeight = this.state.targetBlockheight;

    if (typeof currentHeight !== "number") return;

    const currentTime = moment.tz(moment.tz.guess());
    const blocksRemaining = finalHeight - currentHeight;
    const secondsRemaining = blocksRemaining * 10;
    const secondsRemaining8red = blocksRemaining * 10.86021505376344;
    const currentTimestamp = currentTime.unix();
    const resultTimestamp = currentTimestamp + secondsRemaining;
    const resultTimestamp8red = currentTimestamp + secondsRemaining8red;

    document.title = `${blocksRemaining} blocks remaining for ${whatFor}`;
    this.setState({
      calculatedDate: new Date(resultTimestamp * 1000),
      calculatedDate8red: new Date(resultTimestamp8red * 1000),
      blocksRemaining,
      blockHeight: currentHeight,
      calculated: true
    });
  };

  getBlockHeight = async () => {
    const response = await axios.get(NODE_URL);
    this.setState({ blockHeight: response.data.data.height });
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
      if (completed && this.state.calculated) {
        return <h2>🎉 {successMessage} 🎉</h2>;
      } else if(this.state.calculated) {
        return (
          <h2>
            {days && !isNaN(days)
              ? <span>
                  <span id="countdown">{days}</span> Days
                </span>
              : null}{" "}
            {hours && !isNaN(days)
              ? <span>
                  <span id="countdown">{hours}</span> Hours
                </span>
              : null}{" "}
            {minutes && !isNaN(days)
              ? <span>
                  <span id="countdown">{minutes}</span> Minutes and
                </span>
              : null}{" "}
            {" "}
            {seconds && !isNaN(seconds)
              ? <span>
                  <span id="countdown">{seconds}</span> Seconds!
                </span>
              : null}{" "}
          </h2>
        );
      } else {
        return <h2>🐒 counting the blocks...</h2>
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
        <div className="container" style={{marginBottom: "-90px"}}>
          <div className="content-text">
            <div className="text">
              <h1>We are almost there!</h1>
              <h2>{teasingMessage}</h2>
              <h3>
                The fork will happen on height {visualTargetBlockheight}. Which means in more or
                less:
              </h3>

              <Countdown
                date={new Date(moment(this.state.calculatedDate))}
                renderer={countDownRender}
              />
              {+this.state.blockHeight ? <h3>
                blocks remaining <strong>{targetBlockheight - this.state.blockHeight}</strong>
                <br/> 
                      ({secondaryTarget - this.state.blockHeight} blocks to {secondaryMessage})
                    
                
              </h3> : null}
            </div>
          </div>
        </div>

        <footer className="footer-blockheight" style={{zIndex:1}}>
          <p>
            Current Block Height <strong>{this.state.blockHeight}</strong> | <br/>
            Est. fork:{" "}
            <strong>{new Date(this.state.calculatedDate).toString()}</strong>
            <br/>
            {/* Est. fork with 8 delegates offline: <strong> {new Date(this.state.calculatedDate8red).toString()})</strong> */}
            {!isNaN(this.state.blockHeight) && <span> </span>}
          </p>
          <p>
            The countdown auto adjusts itself according to the number of missed
            blocks
          </p>
          <p>
            {/* Trade Lisk on <a href="https://www.binance.com/en/register?ref=22668150" style={{color: "white", fontWeight: "bold"}}>Binance</a>.  */}
            Made with {"<3"} by Carbonara
          </p>
        </footer>
        {/* <footer className="credits">Vote for Carbonara!</footer> */}
      </div>
    );
  }
}

export default App;
