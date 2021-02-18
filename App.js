import React from "react";
import "./App.css";
import axios from "axios";
import logo from "./images/logo.png";
import { green } from "@material-ui/core/colors";
import { Grid, FormControlLabel, Switch } from "@material-ui/core";
import SearchBar from "material-ui-search-bar";
import { withStyles } from "@material-ui/core/styles";
import FormGroup from "@material-ui/core/FormGroup";

const GreenSwitch = withStyles({
  switchBase: {
    color: green[50],
    "&$checked": {
      color: green[50],
    },
    "&$checked + $track": {
      backgroundColor: green[50],
    },
  },
  checked: {},
  track: {},
})(Switch);

const App = () => {
  // -----------input field---------------
  const [movie, setMovie] = React.useState("");

  // -----------URL-------------------------------

  const result_url = "http://www.omdbapi.com/?s=" + movie + "&apikey=931beee3";

  // -----------Submit button------------

  const [result, setResult] = React.useState([]);
  const [error, setError] = React.useState(false);

  const getSubmit = async () => {
    try {
      const response = await axios.get(result_url);
      setResult(response.data);
    } catch (err) {
      console.log(err);
    }
  };
  // -----------Movie Details----------------
  const [imdbID, setImdbID] = React.useState("");

  const handleDetails = (ev) => {
    const movieID = ev.target.alt;
    console.log("movie ID:" + movieID);
    setImdbID(movieID);
    //ev.currentTarget.value
  };
  const detail_url = "http://www.omdbapi.com/?i=" + imdbID + "&apikey=931beee3";
  const [movieDetails, setMovieDetails] = React.useState([]);
  const [movieRating, setMovieRating] = React.useState([]);
  const getDetails = async () => {
    try {
      const response = await axios.get(detail_url);
      setMovieDetails(response.data);
      setMovieRating(response.data.Ratings[0]);
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ---------------------------------------
  const val = String(movieRating.Value);
  const rating = val.slice(0, 3);
  console.log(rating);
  const [showResults, setShowResults] = React.useState(false);
  const [showBody, setShowBody] = React.useState(true);
  const onClick1 = () => {
    setShowResults(true);
    setShowBody(false);
  };
  const onClick2 = () => {
    setShowResults(false);
    setShowBody(true);
  };
  const [isEnabled, setIsEnabled] = React.useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  const [theme, setTheme] = React.useState({
    checkedA: true,
  });
  const [themeInstance, setThemeInstance] = React.useState("");

  const handleChange_theme = (event) => {
    setTheme({ ...theme, [event.target.name]: event.target.checked });
    console.log("Toggle switch");
    console.log({ ...theme, [event.target.name]: event.target.checked });
  };

  return (
    <Grid
      container
      className={theme.checkedA ? "nav_buttonTrue" : "nav_buttonFalse"}
    >
      {/* --LOGO-- */}
      <Grid
        container
        className={theme.checkedA ? "nav_buttonTrue" : "nav_buttonFalse"}
      >
        <div className="header">
          <div className="logo_div">
            <img className="logo" src={logo} alt="logo" />
          </div>
          {/* --INPUT-- */}

          <div className="searchbar_div">
            <SearchBar
              className="searchBar"
              value={movie}
              onChange={(newValue) => setMovie(newValue)}
              placeholder="Find my movie"
              onRequestSearch={() => {
                getSubmit();
                onClick2();
              }}
            />
          </div>
          {/* --TOOGLE SWITCH-- */}
          <div className="switch">
            <FormGroup>
              <FormControlLabel
                control={
                  <GreenSwitch
                    checked={theme.checkedA}
                    onClick={handleChange_theme}
                    name="checkedA"
                  />
                }
              />
            </FormGroup>
          </div>
        </div>
      </Grid>
      {/* --MOVIE LIST--  */}

      {showBody ? (
        <Grid
          container
          className={
            theme.checkedA
              ? "movieListsGrid_buttonTrue"
              : "movieListsGrid_buttonFalse"
          }
        >
          {result.Search ? (
            <div className="movieLists">
              {result.Search.map((user) => (
                <Grid className="card1" item xs={4}>
                  <div className="movieListDiv" key={user.imdbID}>
                    <img
                      className="image-list"
                      src={user.Poster}
                      alt={user.imdbID}
                      onMouseEnter={(e) => handleDetails(e)}
                      onClick={() => {
                        getDetails();
                        onClick1();
                      }}
                    ></img>
                    <div className=".movieName">
                      <h4 className="movieTitle">
                        {user.Title}
                        {" ("}
                        {user.Year}
                        {")"}
                      </h4>
                    </div>
                  </div>
                </Grid>
              ))}
            </div>
          ) : (
            <h3 className="text">Type something to see search results.!!</h3>
          )}
        </Grid>
      ) : null}

      {showResults ? (
        <Grid
          container
          className="movieDetails"
          style={{ color: "whitesmoke" }}
        >
          <div className="mainBlock">
            <div className="poster">
              <img
                className="image-list1"
                src={movieDetails.Poster}
                alt={movieDetails.imdbID}
              ></img>
            </div>
            <div className="details">
              <h1>
                {movieDetails.Title}
                {" ("}
                {movieDetails.Year}
                {")"}
              </h1>
              <h2>
                {"IMDB Rating: "}
                {rating}
              </h2>
              <h2>
                {"Runtime: "}
                {movieDetails.Runtime}
              </h2>
              <h2>
                {"Genre: "}
                {movieDetails.Genre}
              </h2>
              <h2>
                {"Director: "}
                {movieDetails.Director}
              </h2>
              <h2>
                {"Country: "}
                {movieDetails.Country}
              </h2>
              <h5>{movieDetails.Plot}</h5>
            </div>
          </div>
          <div className="viewSimilarDiv">
            <button className="viewSimilar" onClick={onClick2}>
              View Similar
            </button>
          </div>
        </Grid>
      ) : null}
    </Grid>
  );
};

export default App;
