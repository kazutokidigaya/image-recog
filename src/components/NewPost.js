import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { Link } from "react-router-dom";

const NewPost = ({ image }) => {
  const { url, width, height } = image;
  const [faces, setFaces] = useState([]);
  const videoHeight = "80%";
  const videoWidth = "80%";

  const imgRef = useRef();
  const canvasRef = useRef();

  const handleImage = async () => {
    const detections = await faceapi
      .detectAllFaces(imgRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions()
      .withAgeAndGender();

    setFaces(detections.map((d) => Object.values(d.box)));
  };

  const enter = async () => {
    const detections = await faceapi
      .detectAllFaces(imgRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();
    const displaySize = {
      width: videoWidth,
      height: videoHeight,
    };
    faceapi.matchDimensions(canvasRef.current, displaySize);
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    const ctx =
      canvasRef &&
      canvasRef.current &&
      faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
    canvasRef &&
      canvasRef.current &&
      faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
    canvasRef &&
      canvasRef.current &&
      faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections);
    faces.map((face) => ctx.strokeRect(...face));
  };

  useEffect(() => {
    const loadModels = () => {
      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        faceapi.nets.faceExpressionNet.loadFromUri("/models"),
      ])
        .then(handleImage)
        .catch((e) => console.log(e));
    };

    imgRef.current && loadModels();
  }, []);

  return (
    <div className="container">
      <div className="left" style={{ width, height }}>
        <img
          ref={imgRef}
          height={videoHeight}
          width={videoWidth}
          crossOrigin="anonymous"
          src={url}
          alt=""
        />
        <canvas
          onMouseEnter={enter}
          ref={canvasRef}
          width={width}
          height={height}
        />
      </div>
    </div>
  );
};

export default NewPost;
