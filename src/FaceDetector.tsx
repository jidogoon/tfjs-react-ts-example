import "@tensorflow/tfjs-backend-cpu";
import * as blazeface from "@tensorflow-models/blazeface";
import * as tf from "@tensorflow/tfjs-core";

export class FaceDetector {
  _model: blazeface.BlazeFaceModel | undefined;
  constructor() {
    (async () => {
      await tf.setBackend("cpu");
      this._model = await blazeface.load();
    })();
  }
  isModelReady = () => this._model != null;
  getFaces = async (
    source: HTMLVideoElement | HTMLCanvasElement | ImageData | undefined
  ) => {
    if (!source) return null;
    return this._model?.estimateFaces(source);
  };
}
