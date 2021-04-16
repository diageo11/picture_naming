# Picture Matching Game

This is code for an experiment examining cognitive load on word choice for both a human and computer partner. This methodology is based on that of the Cowan et al. (2019) study. Please consult that paper for further details.

## The code

The experiment is designed to run online and is built using HTML, CSS, PHP, and Javascript. Additionally, the jsPsych library (de Leeuw, 2015) is used as it considered a reliable way to automate common functions of experiments. Please visit the [jsPsych website](https://www.jspsych.org/) for tutorials and further information. The experiment can be currently found at the [UCD HCI Research Lab website](https://icsresearch.ucd.ie/picture_naming/picture_naming_back_up/experiment.html).

The base HTML file is `experiment.html`, which is where participants should be sent. This file brings together all the required javascript to run the experiment.

## The Results

At the end of the experiment, different information is collected from each participant. First, participants will be given a 15 character ID that is used to label their data. In the `data` folder, their actions within the experiment will be saved as a `.csv` file. In the `saved_audio` folder, each utterance made by the participant will be saved as a separate file with the participant ID and the item being described.

# Warning

This experiment is made to be run on a server, and so will break if ran locally. It is also only tested with Google Chrome and Firefox, and so should not be ran using Safari, Internet Explorer, or any other browser. For Firefox users, they may have to select "remember this choice" when allowing microphone access during the experiment.

# References

de Leeuw, J. R. (2015). jsPsych: A JavaScript library for creating behavioral experiments in a web browser. Behavior Research Methods, 47(1), 1-12. doi:10.3758/s13428-014-0458-y.

Cowan, B. R., Doyle, P., Edwards, J., Garaialde, D., Hayes-Brady, A., Branigan, H. P., ... & Clark, L. (2019, August). What's in an accent? The impact of accented synthetic speech on lexical choice in human-machine dialogue. In Proceedings of the 1st International Conference on Conversational User Interfaces (pp. 1-8).
