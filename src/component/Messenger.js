import React, { useState } from "react";
// import Cookies from "js-cookie";
import axios from "axios";
import profile from "./img/hero.png";
import image from "./img/avatar.jpg";
import capture from "./img/new.jpeg";
import "./message.css";
// import { json } from "react-router";

import "@fortawesome/fontawesome-free/css/all.min.css";
// Correct path to Font Awesome CSS file
import "remixicon/fonts/remixicon.css"; // Correct path to Remixicon CSS file

function Messenger() {
  // const [profilePictureUrl, setProfilePictureUrl] = useState("");
  const [page, setPage] = useState(null);
  const [updatedPage, setUpdatedPage] = useState(null);
  const [convodata, setConvoData] = useState(null);
  const [convo, setConvo] = useState(null);
  const [message, setMessage] = useState(null);
  const [updatedConvoData, setUpdatedConvoData] = useState(null);
  const [newMessage, setNewMessage] = useState(null);
  const [currentconvo, setcurrentConvo] = useState(null);
  const [updatedConvo, setUpdatedConvo] = useState(null);
  const [selectedChatParticipant, setSelectedChatParticipant] = useState("");
  const [updatedMessage, setUpdatedMessage] = useState(null);
  const [reverse, setreverse] = useState(false);
  // const token=Cookies.get('token')
  const token =
    "EAALLMw3jRaYBO3WwAZAa3GVZCQ3VZCDKpVDB3ZAkk8Ezhn9eb50RyQCMgoCKKIypPZBxcnloUghOKcZCZBbmVJNDQte91f1a5LZAi0gTeW3fQuTvDvp3ZCdr88eOSumLtSMoN5YEFum5AZBQQXqY2FipH2hK6pTZCEfwSqxo884Ntx7VRZCMft7K2N9ZCXIZBPZBwZDZD";
  async function getFacebookPages() {
    try {
      // Make a GET request to the Facebook Graph API to retrieve the user's pages
      const response = await axios.get(
        `https://graph.facebook.com/v13.0/me/accounts?access_token=${token}`
      );

      // Extract the data containing the user's pages
      setUpdatedPage(response.data.data[0]);

      // Map the pages data to extract relevant information

      console.log(response.data.data);
      // Return the array of Facebook pages
    } catch (error) {
      // If an error occurs, throw it so it can be caught by the caller
      // throw new Error('Error fetching Facebook pages: ' + error.response.data.error.message);
      console.error("Error fetching Facebook pages:", error);
    }
  }
  function loadMessages(data, index) {
    let temp = data;
    for (let i = 0; i < convodata.length; i++) {
      const doc = document.getElementById("id" + i);
      doc.style.backgroundColor = "white";
    }
    const doc = document.getElementById("id" + index);
    doc.style.backgroundColor = "rgb(203, 203, 203)";
    if (reverse === false) {
      console.log("hi");
      console.log(temp);
      setcurrentConvo(temp.reverse());
      setreverse(true);
    } else {
      setcurrentConvo(temp);
    }
    setSelectedChatParticipant(data[0]["from"]["name"]);
  }

  async function getFacebookPageMessages() {
    try {
      // Make a GET request to the Facebook Graph API to retrieve messages
      const response = await axios.get(
        `https://graph.facebook.com/v13.0/${page.id}/conversations?access_token=${page['access_token']}`
      );

      // Extract the data containing the messages
      const conversations = response.data.data;

      // Map the conversations data to extract relevant information
      const messag = conversations.map((conversation) => ({
        id: conversation.id,
        messageCount: conversation.message_count,
        // Add more fields as needed
      }));
      console.log(messag);
      setUpdatedConvo(messag);
    } catch (error) {
      console.error("Error fetching Facebook page messages:", error);
      // If an error occurs, throw it so it can be caught by the caller
      // throw new Error('Error fetching Facebook page messages: ' + error.response.data.error.message);
    }
  }
  

  async function getSenderName(convoId) {
    // try {
    //     // Step 1: Fetch messages from the conversation
    //     const res = await axios.get(`https://graph.facebook.com/v12.0/${convoId}/messages?fields=id,message,created_time,from&access_token=${page['access_token']}`)
    //     console.log(res.data.data[0]['from']['name'])

    //     return res.data.data
    // } catch (error) {
    //     console.error('Error:', error.response.data.error);
    // }
    try {
      let allMessages = [];

      let url = `https://graph.facebook.com/v12.0/${convoId}/messages?fields=id,message,created_time,from&access_token=${page.access_token}`;

      // Fetch messages from the first page
      let response = await axios.get(url);

      // Extract messages from the first page
      let messages = response.data.data;

      // Add messages from the first page to the array
      allMessages = allMessages.concat(messages);

      // Check if there are more pages of data
      while (response.data.paging && response.data.paging.next) {
        // Update URL with the next page URL
        url = response.data.paging.next;

        // Fetch messages from the next page
        response = await axios.get(url);

        // Extract messages from the next page
        messages = response.data.data;

        // Add messages from the next page to the array
        allMessages = allMessages.concat(messages);
      }

      // Return all messages
      return allMessages;
    } catch (error) {
      console.error("Error fetching messages:", error.response.data.error);
      return []; // Return an empty array in case of an error
    }
  }
  async function getMessagesForConversation() {
    try {
      console.log("convoid " + convo[0]["id"]);
      // Make a GET request to the Facebook Graph API to retrieve messages for the conversation
      const response = await axios.get(
        `https://graph.facebook.com/v19.0/${convo[0]["id"]}/messages?access_token=${page['access_token']}`
      );
      // Extract the data containing the messages
      const messag = response.data;
      setUpdatedMessage(messag);
      console.log(messag);
    } catch (error) {
      console.log("Error fetching messages for conversation:", error);
    }
  }

  if (page === null && updatedPage !== null) {
    setPage(updatedPage);
  }
  if (convo === null && updatedConvo !== null) {
    setConvo(updatedConvo);
  }
  if (message === null && updatedMessage !== null) {
    setMessage(updatedMessage);
  }
  if (convodata === null && updatedConvoData !== null) {
    setConvoData(updatedConvoData);
  }
  if (updatedPage === null) {
    getFacebookPages();
  }
  if (updatedConvo === null && updatedPage !== null) {
    getFacebookPageMessages();
  }
  if (updatedMessage === null && updatedConvo !== null) {
    getMessagesForConversation();
  }
  if (updatedConvo !== null && updatedConvoData === null) {
    var data = [];
    for (let index = 0; index < updatedConvo.length; index++) {
      getSenderName(updatedConvo[index]["id"]).then((res) => {
        data.push(res);
      });
    }
    setUpdatedConvoData(data);
  }
  
  function refresh(){
        
  }
 

  function getData(timeDifferenceInSeconds) {
    let displayTime;
    if (timeDifferenceInSeconds < 60) {
      displayTime = `${parseInt(timeDifferenceInSeconds)} s`;
    } else {
      const timeDifferenceInMinutes = timeDifferenceInSeconds / 60;
      if (timeDifferenceInMinutes < 60) {
        displayTime = `${parseInt(timeDifferenceInMinutes)} m`;
      } else {
        const timeDifferenceInHours = timeDifferenceInMinutes / 60;
        displayTime = `${parseInt(timeDifferenceInHours)} h`;
      }
    }
    return displayTime;
  }

  function convertToIndianTime12HourFormat(timestampString) {
    // Convert the string to a Date object
    const date = new Date(timestampString);

    // Convert to Indian time zone
    const indianDate = new Date(
      date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );

    // Get hours, minutes, and AM/PM in 12-hour format
    const hours = indianDate.getHours() % 12 || 12; // Convert 0 to 12
    const minutes = indianDate.getMinutes();
    const ampm = indianDate.getHours() >= 12 ? "PM" : "AM";

    // Format the time in 12-hour format with AM/PM
    const formattedTime = `${hours}:${
      minutes < 10 ? "0" : ""
    }${minutes} ${ampm}`;

    return formattedTime;
  }
  const handlechange = (e) => {
    setNewMessage(e.target.value);
  };
  async function sendMessage() {
    try {
      let recipientId = "";
      for (const data of currentconvo) {
        if (data["from"]["name"] !== "TaskCreativity") {
          recipientId = data["from"]["id"];
          break;
        }
      }

      const response = await axios.post(
        `https://graph.facebook.com/v13.0/me/messages?access_token=${page['access_token']}`,
        {
          recipient: {
            id: recipientId,
          },
          message: {
            text: newMessage,
          },
        }
      );

      let temp = currentconvo;
      temp.push({
        created_time: Date.now(),
        message: newMessage,
        from: {
          name: "TaskCreativity",
        },
      });
      setcurrentConvo(temp);
      setNewMessage("");
      console.log("Message sent successfully:", response.data);
    } catch (error) {
      console.error("Error sending message:", error.response.data.error);
    }
  }
  const sayHello = (event) => {
    event.preventDefault();
    console.log("hi");
    sendMessage();
  };

  return (
    <>
      <div className="navbar">
        <nav className="navigation">
          <button onClick={() => (window.location.href = "#first")}>
            <img src={profile } alt="Profile logo" className="title-image" />
          </button>
          <button
            onClick={() => (window.location.href = "#second")}
            className="inbox-link"
          >
            <i className="fas fa-inbox"></i>
          </button>
          <button onClick={() => (window.location.href = "#third")}>
            <i className="fa fa-user-group" style={{ backgroundColor: "#52359c" }}></i>
          </button>
          <button onClick={() => (window.location.href = "#fourth")}>
            <i className="fas fa-chart-line" style={{ backgroundColor: "#52359c" }}></i>
          </button>
          <button
            onClick={() => (window.location.href = "#fifth")}
            className="profile-link"
          >
            <img src={image} alt="Profile logo" className="profile-image" />
          </button>
        </nav>
      </div>
      <div className="conversation-sidebar">
        <div
          className="row"
          style={{
            backgroundColor: "transparent",
            display: "flex",
            alignItems: "center",
          }}
        >
          <i className="ri-bar-chart-horizontal-line"></i>
          <span
            style={{
              backgroundColor: "transparent",
              fontWeight: "bolder",
              marginLeft: "0",
            }}
          >
            Conversations
          </span>
          <i
            className="fas fa-sync"
            onClick={refresh}
            style={{ backgroundColor: "transparent", cursor: "pointer" }}
          ></i>
        </div>
        <hr />
        <>
          {" "}
          {convodata !== null &&
            convodata.map((data, index) => {
              return (
                <>
                  <div
                    id={"id" + index}
                    onClick={() => loadMessages(convodata[index], index)}
                    className="chat-info"
                  >
                    <input type="checkbox"></input>
                    <div
                      style={{
                        lineHeight: "0",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "14px", padding: "5px"
                        }}
                      >
                        {data[0]["from"]["name"]}
                      </span>
                      <p style={{ fontSize: "10px", margin:"10px" }}>Facebook DM</p>
                    </div>

                    <p>
                      {getData(
                        (Date.now() -
                          new Date(data[0]["created_time"]).getTime()) /
                          1000
                      )}
                    </p>
                  </div>
                  <hr></hr>
                </>
              );
            })}
        </>
      </div>
      <div className="chat-box">
        <div className="name-box">
          {/* Display the selected participant's name */}
          <h2>{selectedChatParticipant}</h2>
        </div>
        <div className="=message-box">
          <div className="chat-container">
            {currentconvo === null && null}
            {currentconvo !== null &&
              currentconvo
                .slice(0)
                .reverse()
                .map((data, index) => {
                  if (data["from"]["name"] === "TaskCreativity") {
                    if (data["message"] !== "") {
                      return (
                        <>
                          <div className="right">{data["message"]}</div>
                          <span className="timestamp-right">
                            you&nbsp;
                            {convertToIndianTime12HourFormat(data.created_time)}
                          </span>
                        </>
                      );
                    }
                  } else {
                    if (data["message"] !== "") {
                      return (
                        <>
                          <div className="left">{data["message"]}</div>
                          <span className="timestamp-left">
                            {data["from"]["name"]}{" "}
                            {convertToIndianTime12HourFormat(data.created_time)}
                          </span>
                        </>
                      );
                    }
                  }
                  return null;
                })}
          </div>
        </div>
      </div>
      <form onSubmit={sayHello}>
        <div class="input-container">
          <div className="searchbar">
            <input
              type="text"
              value={newMessage}
              onChange={handlechange}
              required
              placeholder="Enter message here..."
            ></input>

            <button class="send-button">
              {/* <i class="fas fa-paper-plane"></i> */}
            </button>
          </div>
        </div>
      </form>
      <div class="card">
        <div class="profile-info">
          <img src={capture} alt="Profile logo" />
          <h2>Task Creativity</h2>
          <p class="status">
            <span
              style={{
                color: "green",
                marginRight: "5px",
                fontSize: "2em",
                verticalAlign: "middle",
              }}
            >
              &#8226;
            </span>
            Online
          </p>
        </div>
        <div className="actions">
          <button className="action-button" onClick={() => {}}>
            <i
              className="fas fa-phone"
              style={{ color: "#2da764", outlineColor: "black" }}
            ></i>
            <span style={{ paddingLeft: "5px", color: "#2da764" }}>Call</span>
          </button>
          <button className="action-button" onClick={() => {}}>
            <i className="fas fa-user" style={{ color: "#2da764" }}></i>
            <span style={{ paddingLeft: "5px", color: "#2da764" }}>
              Profile
            </span>
          </button>
        </div>
      </div>

      <div className="sidebar-right">
        <div className="card_1">
          <div className="customer-details">
            <h3>Customer details</h3>
            <p>
              Email
              <span style={{ marginLeft: "53px", fontWeight: "bold" }}> atul.richpanel.com</span>
            </p>
            <p>
              First Name
              <span style={{ marginLeft: "98px", fontWeight: "bold"}}> Atul</span>
            </p>
            <p>
              Last Name
              <span style={{ marginLeft: "91px", fontWeight: "bold" }}> Singh</span>
            </p>
            <br />
            <p
              className="view-details-text"
              onClick={() => {}}
            >
              View more details
              </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Messenger;
