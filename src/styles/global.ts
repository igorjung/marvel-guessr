import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  body {
    width: 100%;
    height: 100%;
    font: 400 15px Roboto, sans-serif;
    overflow-x: hidden;
  }
  button {
    border: 0;
    background: none;
  }
  ul,li {
    list-style-type: none;

  }
  p,strong,span {
    font: 300 16px Roboto, sans-serif;
  }
  h1 {
    font: 600 32px Roboto, sans-serif;

    @media screen and (max-width: 767px) {
      font: 600 24px Roboto, sans-serif;
    }

  }
  h2 {
    font: 600 22px Roboto, sans-serif;

    @media screen and (max-width: 767px) {
      font: 600 18px Roboto, sans-serif;
    }
  }
`;
