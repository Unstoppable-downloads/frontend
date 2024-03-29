import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import NavBar from "./components/Navbar";
import Upload from "./pages/Upload";
import { AceContext } from "./context/context";
import Protected from "./pages/Protected";
import Footer from "./components/Footer";
import Helmet from "react-helmet";
import Modal from "./components/Modal/Modal";
import { toggleModal } from "./components/Modal/ModalController";
import Research from "./pages/Search/index";
import Details from "./pages/Search/details";
import Home from "./pages/Home";
import UploadingGuide from "./pages/Guides/Uploading";
import IndexingGuide from "./pages/Guides/Indexing";

function App() {
  const { connectedAccount, connectWallet, bgUrls, background, creativeMode, setCreativeMode, uploadStatus, setUploadStatus, setBackgroundColor } = useContext(AceContext);
  const { ethereum } = window;

  document.onkeydown = function (evt) {
    evt = evt || window.event;
    var isEscape = false;
    if ("key" in evt) {
      isEscape = evt.key === "Escape" || evt.key === "Esc";
    } else {
      isEscape = evt.keyCode === 27;
    }

    if (isEscape && document.body.classList.contains("modal-active")) {
      toggleModal.call();
    }
  };

  useEffect(() => {
    const connectWalletOnPageLoad = async () => {
      if (sessionStorage?.getItem("isWalletConnected") === "true") {
        try {
          await connectWallet();
        } catch (ex) {
          console.log(ex);
        }
      }
    };
    connectWalletOnPageLoad();
  }, []);

  useEffect(() => {
    // const app = document.getElementById("app").style;
    // const backgroundImage = app.backgroundImage;
    // app.backgroundImage = "";
    // app.backgroundColor = "#ffffff";
    // console.log(backgroundImage)
    console.log(creativeMode);
  }, [creativeMode]);

  useEffect(() => {
    refreshOnWalletChange();
  }, []);

  useEffect(() => {
    setBackgroundColor(false)
  }, [])

  const isConnected = connectedAccount !== "";

  const refreshOnWalletChange = () => {
    if (ethereum) {
      ethereum.on("accountsChanged", function () {
        window.location.reload();
      });
    }
  };


  return (
    <div
      className="min-h-screen bg-contain bg-center text-iexwhite"
      id="app"
      style={{
        // backgroundImage: `url("https://framerusercontent.com/modules/assets/2048/JTTdZra5wxa5h66fJ6xcdSrhck~JI7WW_eXGA4npCJf4aYpm6pYEAlXnzaosDvS7E8qydI.jpg")`,
        backgroundColor: "#f2f1f4",
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Modal id="app-modal" />
      <Router>
        <NavBar />

        <div className="w-full">
          <div className="page-container">
            <main className="w-full text-iexwhite">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route
                  path="/upload"
                  element={
                    <Protected isLoggedIn={isConnected}>
                      <Upload />
                    </Protected>
                  }
                />
                <Route exact path="/search">
                  <Route exact path="" element={<Research />} />
                  <Route exact path="details/*" element={<Details />} />
                </Route>
                <Route exact path="/guides">
                  <Route exact path="how-to-share" element={<UploadingGuide />} />
                  <Route exact path="how-to-index" element={<IndexingGuide />} />
                </Route>
              </Routes>
            </main>
          </div>
        </div>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
