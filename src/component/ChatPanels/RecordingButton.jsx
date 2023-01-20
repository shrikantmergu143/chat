import React from "react";
import { useState } from "react";
import Recorder from 'react-mp3-recorder';

const RecordingButton = () => {
    const [ RecordingHere, setRecordingHere ] = useState(null);

    const start = () => {
        var elements = document.querySelector('.styles_button__3Vugn');
        
    }
    const _onRecordingComplete = (blob) => {
        console.log('recording', blob)
        const Bloburl = URL.createObjectURL(blob);
        setRecordingHere(Bloburl);
      }
     
    const _onRecordingError = (err) => {
        console.log('recording error', err)
    }

    return(<React.Fragment>
            <Recorder
        onRecordingComplete={_onRecordingComplete}
        onRecordingError={_onRecordingError}
      />        
      <button onClick={() => start()}>Click me</button>
      <audio src={RecordingHere} controls />
    </React.Fragment>)
}

export default RecordingButton;
// import React from "react";
// import { useState, useEffect } from "react";

// const RecordingButton = () => {
//     const [recordingMsg, showRecordingMsg] = useState(false);
//     const [micOptions, setMicOptions] = useState([]);
    

//     (async () => {
//         let leftchannel = [];
//         let rightchannel = [];
//         let recorder = null;
//         let recording = false;
//         let recordingLength = 0;
//         let volume = null;
//         let audioInput = null;
//         let sampleRate = null;
//         let AudioContext = window.AudioContext || window.webkitAudioContext;
//         let context = null;
//         let analyser = null;
//         let canvas = document.querySelector('canvas');
//         // let canvasCtx = canvas.getContext("2d");
//         // let visualSelect = document.querySelector('#visSelect');
//         let micSelect = document.querySelector('#micSelect');
//         let stream = null;
//         let tested = false;
        
//         try {
//           window.stream = stream = await getStream();
//           console.log('Got stream');  
//         } catch(err) {
//           alert('Issue getting mic', err);
//         }
        
//         const deviceInfos = await navigator.mediaDevices.enumerateDevices();
        
//         var mics = [];
//         for (let i = 0; i !== deviceInfos.length; ++i) {
//           let deviceInfo = deviceInfos[i];
//           if (deviceInfo.kind === 'audioinput') {
//             mics.push(deviceInfo);
//             let label = deviceInfo.label ||
//               'Microphone ' + mics.length;
//             console.log('Mic ', label + ' ' + deviceInfo.deviceId);
//             let opts = [];
//             opts.push({value: deviceInfo.deviceId});
//             opts.push({text: label});
//             setMicOptions(opts);
            
//             // const option = document.createElement('option');
//             // option.setAttribute('value', deviceInfo.deviceId);
//             // option.setAttribute('text', label);
//             // // option.value = deviceInfo.deviceId;
//             // // option.text = label;
//             // micSelect.appendChild(option);
//           }
//         }
        
//         function getStream(constraints) {
//           if (!constraints) {
//             constraints = { audio: true, video: false };
//           }
//           return navigator.mediaDevices.getUserMedia(constraints);
//         }
        
        
//         setUpRecording();
        
//         function setUpRecording() {
//           context = new AudioContext();
//           sampleRate = context.sampleRate;
          
//           // creates a gain node
//           volume = context.createGain();
          
//           // creates an audio node from teh microphone incoming stream
//           audioInput = context.createMediaStreamSource(stream);
          
//           // Create analyser
//           analyser = context.createAnalyser();
          
//           // connect audio input to the analyser
//           audioInput.connect(analyser);
          
//           // connect analyser to the volume control
//           // analyser.connect(volume);
          
//           let bufferSize = 2048;
//           let recorder = context.createScriptProcessor(bufferSize, 2, 2);
          
//           // we connect the volume control to the processor
//           // volume.connect(recorder);
          
//           analyser.connect(recorder);
          
//           // finally connect the processor to the output
//           recorder.connect(context.destination); 
      
//           recorder.onaudioprocess = function(e) {
//             // Check 
//             if (!recording) return;
//             // Do something with the data, i.e Convert this to WAV
//             console.log('recording');
//             let left = e.inputBuffer.getChannelData(0);
//             let right = e.inputBuffer.getChannelData(1);
//             if (!tested) {
//               tested = true;
//               // if this reduces to 0 we are not getting any sound
//               if ( !left.reduce((a, b) => a + b) ) {
//                 alert("There seems to be an issue with your Mic");
//                 // clean up;
//                 stop();
//                 stream.getTracks().forEach(function(track) {
//                   track.stop();
//                 });
//                 context.close();
//               }
//             }
//             // we clone the samples
//             leftchannel.push(new Float32Array(left));
//             rightchannel.push(new Float32Array(right));
//             recordingLength += bufferSize;
//           };
//           //visualize();
//         };
        
        
      
//         function mergeBuffers(channelBuffer, recordingLength) {
//           let result = new Float32Array(recordingLength);
//           let offset = 0;
//           let lng = channelBuffer.length;
//           for (let i = 0; i < lng; i++){
//             let buffer = channelBuffer[i];
//             result.set(buffer, offset);
//             offset += buffer.length;
//           }
//           return result;
//         }
        
//         function interleave(leftChannel, rightChannel){
//           let length = leftChannel.length + rightChannel.length;
//           let result = new Float32Array(length);
      
//           let inputIndex = 0;
      
//           for (let index = 0; index < length; ){
//             result[index++] = leftChannel[inputIndex];
//             result[index++] = rightChannel[inputIndex];
//             inputIndex++;
//           }
//           return result;
//         }
        
//         function writeUTFBytes(view, offset, string){ 
//           let lng = string.length;
//           for (let i = 0; i < lng; i++){
//             view.setUint8(offset + i, string.charCodeAt(i));
//           }
//         }
      
//         function start() {
//           recording = true;
//         //   document.querySelector('#msg').style.visibility = 'visible'
//             showRecordingMsg(true);
//           // reset the buffers for the new recording
//           leftchannel.length = rightchannel.length = 0;
//           recordingLength = 0;
//           console.log('context: ', !!context);
//           if (!context) setUpRecording();
//         }
      
//         function stop() {
//           console.log('Stop')
//           recording = false;
//         //   document.querySelector('#msg').style.visibility = 'hidden'
//         showRecordingMsg(false);
          
          
//           // we flat the left and right channels down
//           let leftBuffer = mergeBuffers ( leftchannel, recordingLength );
//           let rightBuffer = mergeBuffers ( rightchannel, recordingLength );
//           // we interleave both channels together
//           let interleaved = interleave ( leftBuffer, rightBuffer );
          
//           ///////////// WAV Encode /////////////////
//           // from http://typedarray.org/from-microphone-to-wav-with-getusermedia-and-web-audio/
//           //
      
//           // we create our wav file
//           let buffer = new ArrayBuffer(44 + interleaved.length * 2);
//           let view = new DataView(buffer);
      
//           // RIFF chunk descriptor
//           writeUTFBytes(view, 0, 'RIFF');
//           view.setUint32(4, 44 + interleaved.length * 2, true);
//           writeUTFBytes(view, 8, 'WAVE');
//           // FMT sub-chunk
//           writeUTFBytes(view, 12, 'fmt ');
//           view.setUint32(16, 16, true);
//           view.setUint16(20, 1, true);
//           // stereo (2 channels)
//           view.setUint16(22, 2, true);
//           view.setUint32(24, sampleRate, true);
//           view.setUint32(28, sampleRate * 4, true);
//           view.setUint16(32, 4, true);
//           view.setUint16(34, 16, true);
//           // data sub-chunk
//           writeUTFBytes(view, 36, 'data');
//           view.setUint32(40, interleaved.length * 2, true);
      
//           // write the PCM samples
//           let lng = interleaved.length;
//           let index = 44;
//           let volume = 1;
//           for (let i = 0; i < lng; i++){
//               view.setInt16(index, interleaved[i] * (0x7FFF * volume), true);
//               index += 2;
//           }
      
//           // our final binary blob
//           const blob = new Blob ( [ view ], { type : 'audio/wav' } );
          
//           const audioUrl = URL.createObjectURL(blob);
//           console.log('BLOB ', blob);
//           console.log('URL ', audioUrl);
//           document.querySelector('#audio').setAttribute('src', audioUrl);
//           const link = document.querySelector('#download');
//           link.setAttribute('href', audioUrl);
//           link.download = 'output.wav';
//         }
        
//         // Visualizer function from
//         // https://webaudiodemos.appspot.com/AudioRecorder/index.html
//         //
//         // function visualize() {
//         //   let WIDTH = canvas.width;
//         //   let HEIGHT = canvas.height;
//         //   let CENTERX = canvas.width / 2;
//         //   let CENTERY = canvas.height / 2;
      
//         //   let visualSetting = visualSelect.value;
//         //   console.log(visualSetting);
//         //   if (!analyser) return;
      
//         //   if(visualSetting === "sinewave") {
//         //     analyser.fftSize = 2048;
//         //     var bufferLength = analyser.fftSize;
//         //     console.log(bufferLength);
//         //     var dataArray = new Uint8Array(bufferLength);
      
//         //     // canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
      
//         //     // var draw = function() {
      
//         //     //   //drawVisual = requestAnimationFrame(draw);
      
//         //     //   analyser.getByteTimeDomainData(dataArray);
      
//         //     // //   canvasCtx.fillStyle = 'rgb(200, 200, 200)';
//         //     // //   canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
      
//         //     // //   canvasCtx.lineWidth = 2;
//         //     // //   canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
      
//         //     // //   canvasCtx.beginPath();
      
//         //     //   var sliceWidth = WIDTH * 1.0 / bufferLength;
//         //     //   var x = 0;
      
//         //     //   for(var i = 0; i < bufferLength; i++) {
      
//         //     //     var v = dataArray[i] / 128.0;
//         //     //     var y = v * HEIGHT/2;
      
//         //     //     if(i === 0) {
//         //     //       canvasCtx.moveTo(x, y);
//         //     //     } else {
//         //     //       canvasCtx.lineTo(x, y);
//         //     //     }
      
//         //     //     x += sliceWidth;
//         //     //   }
      
//         //     //   canvasCtx.lineTo(canvas.width, canvas.height/2);
//         //     //   canvasCtx.stroke();
//         //     // };
      
//         //     // draw();
      
//         //   } else if(visualSetting == "frequencybars") {
//         //     analyser.fftSize = 64;
//         //     var bufferLengthAlt = analyser.frequencyBinCount;
//         //     console.log(bufferLengthAlt);
//         //     var dataArrayAlt = new Uint8Array(bufferLengthAlt);
      
//         //    // canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
      
//         //     // var drawAlt = function() {
//         //     //   //drawVisual = requestAnimationFrame(drawAlt);
      
//         //     //   analyser.getByteFrequencyData(dataArrayAlt);
      
//         //     //   canvasCtx.fillStyle = 'rgb(0, 0, 0)';
//         //     //   canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
      
//         //     //   var barWidth = (WIDTH / bufferLengthAlt);
//         //     //   var barHeight;
//         //     //   var x = 0;
      
//         //     //   for(var i = 0; i < bufferLengthAlt; i++) {
//         //     //     barHeight = dataArrayAlt[i];
      
//         //     //     canvasCtx.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
//         //     //     canvasCtx.fillRect(x,HEIGHT-barHeight/2,barWidth,barHeight/2);
      
//         //     //     x += barWidth + 1;
//         //     //   }
//         //     // };
      
//         //     // drawAlt();
      
//         //   } else if(visualSetting == "circle") {
//         //     analyser.fftSize = 32;
//         //     let bufferLength = analyser.frequencyBinCount;
//         //     console.log(bufferLength);
//         //     let dataArray = new Uint8Array(bufferLength);
      
//         //     // canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
            
//         //     // let draw = () => {
//         //     //   //drawVisual = requestAnimationFrame(draw);
              
//         //     //   analyser.getByteFrequencyData(dataArray);
//         //     //   canvasCtx.fillStyle = 'rgb(0, 0, 0)';
//         //     //   canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
              
//         //     //   // let radius = dataArray.reduce((a,b) => a + b) / bufferLength;
//         //     //   let radius = dataArray[2] / 2
//         //     //   if (radius < 20) radius = 20;
//         //     //   if (radius > 100) radius = 100;
//         //     //   // console.log('Radius ', radius)
//         //     //   canvasCtx.beginPath();
//         //     //   canvasCtx.arc(CENTERX, CENTERY, radius, 0, 2 * Math.PI, false);
//         //     //   // canvasCtx.fillStyle = 'rgb(50,50,' + (radius+100) +')';
//         //     //   // canvasCtx.fill();
//         //     //   canvasCtx.lineWidth = 6;
//         //     //   canvasCtx.strokeStyle = 'rgb(50,50,' + (radius+100) +')';
//         //     //   canvasCtx.stroke();
//         //     // }
//         //     // draw()
//         //   }
      
//         // }
        
//         // visualSelect.onchange = function() {
//         //  // window.cancelAnimationFrame(drawVisual);
//         //   //visualize();
//         // };
        
//         document.getElementById("micSelect").addEventListener('change', async function(e){
//             console.log('now use device ', document.getElementById("micSelect").value);
//             stream.getTracks().forEach(function(track) {
//               track.stop();
//             });
//             context.close();
            
//             stream = await getStream({ audio: {
//               deviceId: {exact: document.getElementById("micSelect").value} }, video: false });
//             setUpRecording();
//         }) 
      
//         function pause() {
//           recording = false;
//           context.suspend()
//         }
      
//         function resume() {
//           recording = true;
//           context.resume();
//         }
      
//         document.querySelector('#record').onclick = (e) => {
//           console.log('Start recording')
//           start();
//         }
      
//         document.querySelector('#stop').onclick = (e) => {
//           stop();
//         }
//       })()

//     return(<React.Fragment>
//           <select name="" id="micSelect">
//             {micOptions.length > 0 && micOptions.map((opt) => {
//                 <option value={opt.value}>{opt.text}</option>
//             })}
//           </select>

//         <select id="visSelect">
//         <option value="frequencybars">Bar</option>
//         <option value="sinewave">Wave</option>
//         <option value="circle">Circle</option>
//         </select>

//         <a id="download" >Download</a>

//         <div className="audio-controls">
//         <button id="record">Record</button>
//         <button id="stop">Stop</button>
//         <audio id="audio" controls></audio>
//         </div>

//         {recordingMsg ? (<div id="msg">Recording...</div>): null}
//         {/* <canvas width="500" height="300"></canvas> */}
//     </React.Fragment>)
// }

// export default RecordingButton;