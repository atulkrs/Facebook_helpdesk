import React, { useState, useEffect, useCallback } from 'react';
import "./facebook.css"; // Import the CSS file
import axios from 'axios';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';

function ConnectPage() {

  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [loggedin, setLoggedin] = useState(false);
  const [token, setToken] = useState(null);
  const [pageName, setPageName] = useState('');

  const getFacebookPages = useCallback(async () => {
    try {
      // Make a GET request to the Facebook Graph API to retrieve the user's pages
      const response = await axios.get(`https://graph.facebook.com/v13.0/me/accounts?access_token=${token}`);
       console.log(`https://graph.facebook.com/v13.0/me/accounts?access_token=${token}`)
      // Extract the data containing the user's pages
      const pagesData = response.data.data;
      console.log(response.data)
      setPageName(pagesData[0]['name'])
      // Map the pages data to extract relevant information
      const pages = pagesData.map(page => ({
        name: page.name,
        id: page.id,
        accessToken: page.access_token
      }));

      // Return the array of Facebook pages
      return pages;
    } catch (error) {
      // If an error occurs, throw it so it can be caught by the caller
      throw new Error('Error fetching Facebook pages: ' + error.response.data.error.message);
    }
  }, [token]);

  useEffect(() => {
    function loadFacebookSDK() {
      const script = document.createElement('script');
      script.src = 'https://connect.facebook.net/en_US/sdk.js';
      script.async = true;
      script.defer = true;
      script.crossorigin = 'anonymous';
      document.head.appendChild(script);
    }

    // Call the function to load the Facebook SDK
    loadFacebookSDK();

    // Load Facebook SDK asynchronously
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: '786370090190246',
        cookie: true,
        xfbml: true,
        version: 'v19.0'
      });
      setSdkLoaded(true);
    };

    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

  }, []);

  const handleFacebookLogin = () => {
    if (sdkLoaded) {
      window.FB.login(response => {
        if (response.authResponse) {
          console.log('User logged in:', response.authResponse['accessToken']);
          setToken(response.authResponse['accessToken'])
          Cookies.set('token', response.authResponse['accessToken'])
          setLoggedin(true)
        } else {
          console.log('User cancelled login or did not fully authorize.');
          // Handle login cancellation or failure
        }
      }, { scope: 'email,public_profile,pages_messaging,pages_show_list' });
    } else {
      console.error("Facebook SDK not yet loaded.");
    }
  };
  const fblogout = () => {
    if (window.FB) {
      // Call the logout method provided by the Facebook SDK
      window.FB.logout(function (response) {
        console.log('Logged out from Facebook');
        setLoggedin(false)
        // You can perform additional actions after logout if needed
      });
    } else {
      console.error("Facebook SDK not yet loaded.");
    }
  }

  useEffect(() => {
    if (loggedin) {
      async function fetchData() {
        try {
          await getFacebookPages();
        } catch (error) {
          console.error(error);
        }
      }
      fetchData();
    }
  }, [loggedin, getFacebookPages]);

  if (loggedin) {
    return (
      <div style={{ backgroundColor: '#033366', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="container_1">
        <h1><span className="medium-bold">Facebook Page Integration</span></h1>
        <h1><span className="not-bold">Integrated Page:</span><strong className="bold-text">{pageName}</strong></h1>
        <div className="buttons">
          <button onClick={fblogout} className="delete-button">Delete Integration</button>
        </div>
        <div className="buttons">
          <Link to='/messenger' className="message-button">Reply To Messages</Link>
        </div>
      </div>
      </div>
    );
  } else {
    return (
      <div className="container_2">
        <h1>Facebook Page Integration</h1>
        {!sdkLoaded ? (
          <p>Loading Facebook SDK...</p>
        ) : (
          <div className="buttons">
            <button className="facebook-button" onClick={handleFacebookLogin}>Connect Page</button>
          </div>
        )}
      </div>

    );
  }
}

export default ConnectPage;
