import { useRef, useState, useEffect } from "react";
import "@tensorflow/tfjs-backend-cpu";
import "./App.css";
import movie from "./SpolierFrontend.mp4";
import { FaceDetector } from "./FaceDetector";

const detector = new FaceDetector();

const detectFaces = async (video: HTMLVideoElement) => {
  const canvasElement = document.createElement("canvas") as HTMLCanvasElement;
  canvasElement.width = video.videoWidth;
  canvasElement.height = video.videoHeight;
  const ctx = canvasElement.getContext("2d");
  ctx?.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
  return await detector.getFaces(canvasElement);
};

const App = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [faceText, setFaceText] = useState("");

  useEffect(() => {
    setInterval(async () => {
      if (!detector.isModelReady()) {
        setFaceText("Model is not ready :(");
        return;
      }
      const currentVideo = videoRef.current;
      if (!currentVideo) return;
      const before = Date.now();
      const faces = await detectFaces(currentVideo);
      const took = Date.now() - before;
      const faceText = faces
        ?.map((face) => {
          return `[took ${took}ms] topLeft: ${face.topLeft} / bottomRight: ${
            face.bottomRight
          } / probability: ${face.probability ?? "0.0"}`;
        })
        ?.join();
      setFaceText(faceText ?? "");
    }, 500);
  }, []);

  return (
    <div className="App">
      <video ref={videoRef} controls autoPlay muted src={movie} />
      <div>{faceText}</div>
    </div>
  );
};

export default App;
