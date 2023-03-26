import { useEffect } from "react";
import "./App.css";

const CLIENT_ID = "464c7f6d8a69062dbe07";

function App() {
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
  }, []);

  function loginWithGithub() {
    window.location.assign(
      "https://github.com/login/oauth/authorize?client_id=" + CLIENT_ID
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={loginWithGithub}>Login with github</button>
      </header>
    </div>
  );
}

export default App;
