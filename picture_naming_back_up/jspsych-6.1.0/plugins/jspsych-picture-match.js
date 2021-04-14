/*
 * Plugin for picture matching and naming task
 */

jsPsych.plugins["picture-match"] = (function () {

    var plugin = {};

    plugin.info = {
        name: "picture-match",
        parameters: {
            info: {
                type: jsPsych.plugins.parameterType.OBJECT,
                default: undefined
            },
            delay: {
                type: jsPsych.plugins.parameterType.INT,
                default: 1000
            },
            subject: {
                type: jsPsych.plugins.parameterType.STRING,
                default: undefined
            }
        }
    }

    plugin.trial = function (display_element, trial) {

        // Create universal listener
        var keyboardListener;

        // Create stimulus holder
        var html = `<div id='jspsych-picture-match-stimulus'>`;

        // Show images
        html += `<img src='images/${trial.info.stimulus[0]}.bmp' class='stimulus left' >`;
        html += `<img src='images/${trial.info.stimulus[1]}.bmp' class='stimulus right' >`;
        html += `</div>`;

        // Partner Turn
        if (trial.info.turn == 'partner') {

            // setup stimulus
            var sound = new Audio(
                'audio/' + trial.info.correct[0] + '.mp3'
            );

            sound.addEventListener("ended", function () {
                allowKeys();
            });


            html += `<p>Press the LEFT or RIGHT arrow to select the image named by your partner. </p>`;

            jsPsych.pluginAPI.setTimeout(function () {
                // start audio
                sound.play().catch(e => {
                    alert(String(e) + `\n\nCould not play sound files.`);
                });


            }, trial.delay);

            // Participant Turn
        } else if (trial.info.turn == 'participant') {
            html += `<p>Press SPACE after you've named out loud the highlighted image to your partner.</p>`;


            jsPsych.pluginAPI.setTimeout(function () {
                // Highlight image after 'delay' seconds               
                $('.' + trial.info.correct[1])
                    .addClass('highlight');

            }, trial.delay);

            html += '<i class="material-icons md-48 hide show">mic</i>';

            startRecording();

        }

        // Draw
        display_element.innerHTML = html;

        // Create response holder
        var response = {
            rt: null,
            key: null
        }

        function end_trial() {
            // kill any remaining setTimeout handlers
            jsPsych.pluginAPI.clearAllTimeouts();

            // kill keyboard listeners
            if (typeof keyboardListener !== 'undefined') {
                jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
            }

            // Trial Data to save
            var trial_data = {
                rt: response.rt,
                key_press: response.key,
            };

            trial_data.right_answer = trial.info.correct[1];

            if (trial.info.turn == 'partner') {

                trial_data.correct = trial.info.correct[1] == response.key.replace('arrow', '');

            }

            // End trial

            // Clear Screen
            display_element.innerHTML = '';
            // Save data
            jsPsych.finishTrial(trial_data);



        }

        function allowKeys() {
            // Start Keyboard Listener
            keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
                callback_function: after_response,
                valid_responses: ['leftarrow', 'rightarrow'],
                rt_method: 'performance',
                persist: false,
                allow_held_key: false
            });
        }

        function startRecording() {

            var mediaRecorder;
            var audioChunks = [];

            console.log('recording');

            navigator.mediaDevices.getUserMedia({
                audio: true
            }).then(function (stream) {
                window.streamReference = stream;
                mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.start();

                mediaRecorder.ondataavailable = event => {
                    audioChunks.push(event.data);
                };

                mediaRecorder.onstop = event => {
                    const audioBlob = new Blob(audioChunks, {
                        'type': 'audio/webm'
                    });

                    upload(audioBlob);
                    const audioUrl = URL.createObjectURL(audioBlob);
                    const audio = new Audio(audioUrl);
                    console.log(audioUrl);

                    //                    audio.play();
                    //                    audio.onended = () => end_trial();
                    end_trial();

                };

                jsPsych.pluginAPI.setTimeout(() => {

                    stop({
                        rt: 5000,
                        key: null
                    });

                }, 4000 + trial.delay);
            }).catch(e => {
                var user_friendly = `\n\nYou either did not give us permission to acess your microphone or do not have one attached. Unfortunately you can't participate in the experiment. If you would like to take part and have fixed the issue, please refresh the page.`;
                alert(String(e) + user_friendly);
            });

            function stop(info) {
                // Only record the first response
                if (response.key == null) {
                    response = info;
                }
                
                if (mediaRecorder) {

                    jsPsych.pluginAPI.setTimeout(() => {

                        mediaRecorder.stop();

                        $('.material-icons').removeClass('show');
                        console.log('recording stopped');
                        window.streamReference.getAudioTracks()
                            .forEach(function (track) {
                                track.stop();
                            });

                    }, 1000);
                }
            }

            function upload(blob) {
                console.log(blob.type);
                var fd = new FormData();
                fd.append('name',
                    `${trial.subject}_${jsPsych.currentTimelineNodeID()}_${trial.info.correct[0]}_`);

                fd.append('audio', blob);

                fetch("/picture_naming/upload.php", {
                        method: "POST",
                        body: fd
                    })
                    .then(response => {
                        if (response.ok) return response;
                        else throw Error(`Server returned ${response.status}: ${response.statusText}`)
                    })
                    .then(response => console.log(response.text()))
                    .catch(err => {
                        alert(err);
                    });

            }

            jsPsych.pluginAPI.setTimeout(function () {

                // Start Keyboard Listener
                keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
                    callback_function: stop,
                    valid_responses: ['space'],
                    rt_method: 'performance',
                    persist: false,
                    allow_held_key: false
                });

            }, trial.delay);

        }

        // Function to call once accurate response given
        function after_response(info) {
            // Only record the first response
            if (response.key == null) {
                response = info;
            }

            response.key = jsPsych.pluginAPI.convertKeyCodeToKeyCharacter(response.key);

            if (response.key == 'rightarrow') {
                $('.right').addClass('blink');
            } else if (response.key == 'leftarrow') {
                $('.left').addClass('blink');
            }

            jsPsych.pluginAPI.setTimeout(() => end_trial(), 1500);

        }


    };

    return plugin;
})();


// BOOL, STRING, INT, FLOAT, FUNCTION, KEYCODE, SELECT, HTML_STRING, IMAGE, AUDIO, VIDEO, OBJECT, COMPLEX
