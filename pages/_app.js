import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Component {...pageProps} />
      <footer>
        <p>2022 Coffee Finder</p>
      </footer>
    </div>
  );
}

export default MyApp;
