import { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import NewPost from "./components/NewPost";

function App() {
  const [file, setFile] = useState();
  const [image, setImage] = useState();

  useEffect(() => {
    const getImage = () => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        setImage({
          url: img.src,
          width: img.width,
          height: img.height,
        });
      };
    };

    file && getImage();
  }, [file]);

  return (
    <div>
      <Navbar />
      {image ? (
        <NewPost image={image} />
      ) : (
        <div className="newPostCard">
          <div className="addPost">
            <img
              src="https://iconarchive.com/download/i60615/double-j-design/origami-colored-pencil/blue-mail-send.ico"
              alt=""
              className="avatar"
            />
            <h2>Click on icon down below !</h2>
          </div>
          <div className="postForm">
            <label htmlFor="file">
              <img
                className="addImg"
                src="https://icon-library.com/images/maps-icon-png/maps-icon-png-5.jpg"
                alt=""
              />

              <button>Send</button>
            </label>
            <input
              onChange={(e) => setFile(e.target.files[0])}
              id="file"
              style={{ display: "none" }}
              type="file"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
