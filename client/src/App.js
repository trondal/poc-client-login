import { useEffect, useState } from "react";
import "./App.css";

const CLIENT_ID = "464c7f6d8a69062dbe07";

function App() {
  // force rerender (as logged in/out) when access_token is set in localStorage
  const [rerender, setRerender] = useState(false);

  const [userData, setUserData] = useState({});
  // forward the user to the login screen (pass in the client ID)
  // User is in the github sidfe and logs in
  // When user decides to login.. they get forwarded back to localhost:3000
  // like localhost:3000/?code=ADSEFGDRGDFGedg
  // Use the code to get the access token (code can only be used once)

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const codeParam = urlParams.get("code");
    console.log(codeParam);

    // leave our web page for a while
    // come back and still be logged in with Github

    if (codeParam && localStorage.getItem("accessToken") === null) {
      async function getAccessToken() {
        await fetch("http://localhost:4000/getAccessToken?code=" + codeParam, {
          method: "GET",
        })
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            console.log(data);
            if (data.access_token) {
              localStorage.setItem("accessToken", data.access_token);
              // localStorage does not force rerender, so do it explicitly
              setRerender(!rerender);
            }
          });
      }
      getAccessToken();
    }
  }, [rerender]);

  async function getGithubUserData() {
    await fetch("http://localhost:4000/getUserData", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"), // Bearer ACCESSTOKEN
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setUserData(data);
      });
  }

  function loginWithGithub() {
    window.location.assign(
      "https://github.com/login/oauth/authorize?client_id=" + CLIENT_ID
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        {localStorage.getItem("accessToken") ? (
          <>
            <h1>We have the access token</h1>
            <button
              onClick={() => {
                localStorage.removeItem("accessToken");
                setRerender(!rerender); // force rerender
              }}
            >
              Log out
            </button>
            <h3>Get Data from Github API</h3>
            <button onClick={getGithubUserData}>Get UserData</button>
            {Object.keys(userData).length !== 0 ? (
              <>
                <h4>Hey there {userData.login}</h4>
                <img
                  alt="User Avatar"
                  width="100px"
                  height="100px"
                  src={userData.avatar_url}
                ></img>
                <a href={userData.html_url} style={{ color: "white" }}>
                  Link to Github Profile
                </a>
              </>
            ) : (
              <h4>No user data</h4>
            )}
          </>
        ) : (
          <>
            <h3>User is not logged in</h3>
            <button onClick={loginWithGithub}>Login with github</button>
          </>
        )}
      </header>
    </div>
  );
}

export default App;
