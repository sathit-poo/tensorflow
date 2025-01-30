const video = document.getElementById('video')

var eyeClosedThreshold = 10
const blinkCount = 0
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('https://sathit-poo.github.io/tensorflow/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('https://sathit-poo.github.io/tensorflow/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('https://sathit-poo.github.io/tensorflow/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('https://sathit-poo.github.io/tensorflow/models')
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
   
   
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    // faceapi.draw.drawDetections(canvas, resizedDetections)
     faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    // faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
    

    const detections2 = await faceapi
    .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks();
  
    if (detections2.length > 0) {
      const landmarks = detections2[0].landmarks;
         // Blink detection
     const leftEyeTop = landmarks.positions[37];
     const leftEyeBottom = landmarks.positions[41];
     const rightEyeTop = landmarks.positions[43];
     const rightEyeBottom = landmarks.positions[47];

     const leftEyeDistance = leftEyeBottom.y - leftEyeTop.y;
     const rightEyeDistance = rightEyeBottom.y - rightEyeTop.y;

    
     eyeClosedThreshold = leftEyeDistance
     if (  leftEyeDistance < 9) {
      console.log("กระพริบตา",leftEyeDistance)
     }
   var blinkStarted = false

    let x1 = landmarks.positions[1].x;
    let y1 = landmarks.positions[1].y;

    let x2= landmarks.positions[17].x;
    let y2= landmarks.positions[17].y;

    let _m = (y2-y1)/(x2-x1)
    let rad = Math.atan(_m)  
    let ang = rad *(180/3.14)* (-1);

    console.log("head angle=", ang)

 //  console.log("leftEyeDistance=", leftEyeDistance)
    //  if (
    //    leftEyeDistance < eyeClosedThreshold &&
    //    rightEyeDistance < eyeClosedThreshold &&
    //    !blinkStarted.current
    //  ) {
    //    blinkStarted.current = true;
    //    blinkCount.current++;
    //  } else if (
    //    leftEyeDistance >= eyeClosedThreshold &&
    //    rightEyeDistance >= eyeClosedThreshold &&
    //    blinkStarted.current
    //  ) {
    //    blinkStarted.current = false;
    //  }
    //  console.log("Blinking=", blinkDone.current)
    //  if (blinkCount.current >= 2 && !blinkDone.current) {
    //     console.log("Blinking=", blinkDone.current)
     
    //  }
    }
  

  }, 100)
})

let click_button = document.querySelector("#click-photo");
let canvas = document.querySelector("#canvas");
click_button.addEventListener('click', function() {
  canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
  let image_data_url = canvas.toDataURL('image/jpeg');

  // data url of the image
  console.log(image_data_url);
});
