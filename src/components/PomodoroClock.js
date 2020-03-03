import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStopwatch, 
    faHourglassStart, 
    faHourglassEnd, 
    faArrowCircleDown, 
    faArrowCircleUp,
    faPlayCircle,
    faPauseCircle,
    faRedo } from '@fortawesome/free-solid-svg-icons';

class PomodoroClock extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        sessionLength: 25,
        breakLength: 5,
        currentTime: (new Date()).toLocaleString(),
        minutesLeft: 25,
        secondsLeft: 0,
        toggleType: "Session",
        togglePlay: false,
        firstTime: true
        
      }
      this.launchClock();
      this.launchTimer();
      
      this.handleClickSessionIncrement = this.handleClickSessionIncrement.bind(this);
      this.handleClickSessionDecrement = this.handleClickSessionDecrement.bind(this);
      this.handleClickBreakIncrement = this.handleClickBreakIncrement.bind(this);
      this.handleClickBreakDecrement = this.handleClickBreakDecrement.bind(this);
      this.handleClickPlayPause =
        this.handleClickPlayPause.bind(this);
      this.handleClickReset = this.handleClickReset.bind(this);
      this.launchClock = this.launchClock.bind(this);
      this.launchTimer = this.launchTimer.bind(this);
      this.formatTimer = this.formatTimer.bind(this);
    }
    
    handleClickSessionIncrement() {
      if (!this.state.togglePlay) {
        let newSessionLength = this.state.sessionLength + 1;
        if (newSessionLength > 0 && newSessionLength < 61) {
          this.setState( {
            sessionLength: newSessionLength,
            minutesLeft: newSessionLength,
            secondsLeft: 0
          });
        }
      }
    }
    
    handleClickSessionDecrement() {
      if (!this.state.togglePlay) {
        let newSessionLength = this.state.sessionLength - 1;
        if (newSessionLength > 0 && newSessionLength < 61) {
          this.setState( {
            sessionLength: newSessionLength,
            minutesLeft: newSessionLength,
            secondsLeft: 0
          });
        }
      }
    }
    
    handleClickBreakIncrement() {
      if (!this.state.togglePlay) {
        let newBreakLength = this.state.breakLength + 1;
        if (newBreakLength > 0 && newBreakLength < 61) {
          this.setState( {
            breakLength: newBreakLength
          });
        }
      }
    }
    
    handleClickBreakDecrement() {
      if (!this.state.togglePlay) {
        let newBreakLength = this.state.breakLength - 1;
        if (newBreakLength > 0 && newBreakLength < 61) {
          this.setState( {
            breakLength: newBreakLength
          });
        }
      }
    }
    
    handleClickPlayPause() {
      let buttons = document.getElementsByClassName("control-button");
      for(let i = 0; i < buttons.length; i++) {
        buttons[i].classList.toggle("disabled");
        }
    
      if (this.state.firstTime) {
        let newMinutes = this.state.sessionLength;
          this.setState({
            firstTime: false,
            minutesLeft: newMinutes
          })
        }
      if (this.state.togglePlay) {
        //console.log("timer go!");
        this.setState( {
          togglePlay: false
        });
      } else {
        //console.log("timer pause!");
        this.setState( {
          togglePlay: true
        })
      }
    }
    
    handleClickReset() {
      let buttons = document.getElementsByClassName("control-button");
      for(let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("disabled");
        }
      
      let beep = document.getElementById('beep');
      //Stop the audio HTML5 element.
      //https://stackoverflow.com/questions/14834520/html5-audio-stop-function/14836099 No stop method, so workaround as follows:
      beep.pause();
      beep.currentTime = 0.0;
      
      
      this.setState( {
        minutesLeft: 25,
        secondsLeft: 0,
        sessionLength: 25,
        breakLength: 5,
        toggleType: "Session",
        togglePlay: false
      })
    }
    
    launchClock() {
      setInterval(()=>{
        //console.log('Updating time...')
        this.setState({
          currentTime: (new Date()).toLocaleString() 
        })
      }, 1000)      
    }
    
    launchTimer() {
        setInterval(()=> {
          //console.log("Updating timer...")
          if (this.state.togglePlay) {
            let minutes = this.state.minutesLeft;
            let seconds = this.state.secondsLeft;
            let newMinutes = 0;
            
            if(minutes === 0 && seconds === 1) {
              let audioElement = document.getElementById('beep');
              audioElement.play();
            }
            if (minutes === 0 && seconds === 0 && this.state.toggleType === "Session") {
              newMinutes = this.state.breakLength;
              //console.log("Time to switch to Break with ", newMinutes, " minutes");
              minutes = newMinutes;
              this.setState( {
                minutesLeft: newMinutes,
                secondsLeft: 0,
                toggleType: "Break"
              })
            } else if (minutes === 0 && seconds === 0 && this.state.toggleType === "Break") {
              newMinutes = this.state.sessionLength;
              //console.log("Time to switch to Session with ", newMinutes, " minutes");
              minutes = newMinutes;
              this.setState( {
                minutesLeft: newMinutes,
                secondsLeft: 0,
                toggleType: "Session"
              })
            }
            
            else if (seconds <= 0) {
              minutes--;
              seconds = 59;
            } else {
              seconds--;  
            }
            this.setState({
              minutesLeft: minutes,
              secondsLeft: seconds
            })
          }
        }, 1000)
    }
    
    formatTimer() {
      let minutes = this.state.minutesLeft.toString();
      let seconds = this.state.secondsLeft.toString();
      if (minutes < 10) {minutes = "0"+minutes;}
      if (seconds < 10) {seconds = "0"+seconds;}
      //console.log(minutes+ ':' +seconds);
      return minutes+':'+seconds;
    }
    
    render() {
      return (
      <div id="clock">
          <h1 id="title"> Pomodoro Clock <FontAwesomeIcon icon={faStopwatch} /></h1>
          
          <div id="explanation">
            <div className="transbox">
              <h2>The <span className="fancyFont">Pomodoro Technique</span> allows you to focus on your task on hand for a chunk of time, and then take a break. Repeat. This process helps with <span className="fancyFont">concentration</span>, <span className="fancyFont">retention</span> and <span className="fancyFont">anxiety</span>.</h2>
            </div>
          </div>
          <div id="controlStation">
            <div id="session-box">
              <div id="session-label"><h3>Session Length <FontAwesomeIcon icon={faHourglassStart} /></h3></div>
              <div id="session-decrement-box"><button id="session-decrement" className="control-button" onClick={this.handleClickSessionDecrement}><FontAwesomeIcon icon={faArrowCircleDown} /></button></div>
              <div id="session-length"><h2>{this.state.sessionLength}</h2></div>
              <div id="session-increment-box"><button id="session-increment" className="control-button" onClick={this.handleClickSessionIncrement}><FontAwesomeIcon icon={faArrowCircleUp} /></button> </div>
            </div>
            
            <div id="break-box">
              <div id="break-label"><h3>Break Length <FontAwesomeIcon icon={faHourglassEnd} /></h3></div>
              <div id="break-decrement-box"><button id="break-decrement" className="control-button" onClick={this.handleClickBreakDecrement}><FontAwesomeIcon icon={faArrowCircleDown} /></button></div>
              <div id="break-length"><h2>{this.state.breakLength}</h2></div>
              <div id="break-increment-box"><button id="break-increment" className="control-button" onClick={this.handleClickBreakIncrement}><FontAwesomeIcon icon={faArrowCircleUp} /></button></div>
            </div>
            
          </div>
          
          <div id="timerStation">
            <div id="timer-label"><h2>{this.state.toggleType === "Session" ? "Session" : "Break"}</h2></div>
            <div id="time-left"><h1>{this.formatTimer()}</h1></div>
            <div id="beep-area"><audio id="beep"><source src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/742140/C.mp3' type="audio/mpeg"></source></audio></div>
            <div id="start_stop-box"><button id="start_stop" onClick={this.handleClickPlayPause}><FontAwesomeIcon icon={faPlayCircle} /><FontAwesomeIcon icon={faPauseCircle} /></button></div>
            <div id="reset-box"><button id="reset" onClick={this.handleClickReset}><FontAwesomeIcon icon={faRedo} /></button></div>
          </div> 
          
          <div id="pomodoro-photo">
            <a title="The original uploader was Erato at Italian Wikinews. [CC BY-SA 2.5 (https://creativecommons.org/licenses/by-sa/2.5)], via Wikimedia Commons" href="https://commons.wikimedia.org/wiki/File:Il_pomodoro.jpg"><img alt="Il pomodoro" src="https://upload.wikimedia.org/wikipedia/commons/3/34/Il_pomodoro.jpg"/></a>
            <h3>{this.state.currentTime}</h3>
          </div>
          
          <div id="footer">
            <p id="copyright">&copy; 2020 Heather Nuffer</p>
            <p><a id="photo-copyright" title="Scott Bauer, USDA ARS [Public domain], via Wikimedia Commons" href="https://commons.wikimedia.org/wiki/File:Tomato_slices.jpg" target="_blank" rel="noopener noreferrer">Tomato Slices Photo Info</a></p>
            
          </div>
        </div>)
      
    }
  }
  
  export default PomodoroClock;