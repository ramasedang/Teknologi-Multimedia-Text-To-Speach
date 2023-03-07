<template >
    <div>
        <div class="card">
            <h4>{{ fileText }}</h4>
            <h2>Convert Text to Speech</h2>
            <h5>Listen to those words!</h5>
            <p class="lead mt-4">Select Voice</p>

            <!-- Select Menu for Voice -->
            <select id="voices" class="form-select" v-model="selectedVoice">
                <option :value="index" v-for="(voice, index) in voices" :key="index">
                    {{ voice[0] }} / {{ voice[1] }}
                </option>
            </select>

            <!-- Text Area  for the User to Type -->
            <textarea class="form-control mt-5" v-model="textInput" cols="30" rows="10"
                placeholder="Type here..."></textarea>

            <div>
                <label class="form-label" for="customFile">Masukan file .txt</label>
                <input type="file" ref="fileInput" @change="onFileChange" class="form-control" id="customFile"
                    accept=".txt" />
            </div>
            <!-- Control Buttons -->
            <div class="mb-5">
                <button id="start" class="btn btn-success mt-5 me-3" @click="get_sound()">Start</button>
                <button id="pause" class="btn btn-warning mt-5 me-3" @click="pause_audio()">Pause</button>
                <button id="resume" class="btn btn-info mt-5 me-3" @click="resume_audio()">Resume</button>
                <button id="cancel" class="btn btn-danger mt-5 me-3" @click="stop_audio()">Cancel</button>
            </div>
            <div>
                <h4>Hasil</h4>
                <audio controls :src="audioBase64" autolpay></audio>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import Swal from 'sweetalert2';
var audio;
export default {
    name: 'HomeView',
    data() {
        return {
            msg: 'Welcome to Your Vue.js App',
            voices: [],
            selectedVoice: 19,
            textInput: null,
            fileText: '',
            audioBase64: 'data:audio/mpeg;base64,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AzoQMcDh6ocsOytJ1e1Jaz///jbFKro6VrtPWZ+Z1oQ/TYErRwBtX3WiXaIJ0QVy//NExBcQsVaoAMiKlPm9un+nt7rqh5hIMOYyNZVdhA40qJDQ0BpXO/4gR///1XGkKF60vlwCNDJCq3KFuhpPCR1eSBcoxKH2/CC7b0B+Jtz879ed/fzf//b+5C0weCIF//NExCcSIXqsAMlQlNYcqeENhCxHHWWH4xxxknOkPFAjWtmmrZ///2/0D5xwqar+/mG3l27iSgPK8v1kCLN9DGoGNRumP+vH+jefyKjQd2WesQE4dHMynUq2vijspArQ//NExDEREVq0AMHQlBR7x4dtLmwo531r////eylibXpq7vKATcSd7cJGNra5XQFL2dYV6DTgyGx6J5FN9Z/nuq9YffAP+5LMd0G/A8/4V9yE7yEcmTyQraE4iQWl/20///NExD8RMVK0AMNMlP///6ZSMsdXXwBvcs6ghE1f/mV+4XAQH3kiAZrobz3BSXfmnwIXwSF5pUMOWqd+nl5WzG0Dz5RQ6MIoqCD8esoicKuscmut30P//7/3o0WilNwq//NExE0SKZqsAMLKlAE29C9LqchIuNZymV+fmAJlFtUaThP6vZ/ir/77jTFm2taMTNr8MbUvb///m6GcqGqJDBjaQWed/0fgyp//9av00LKmVY1SSMwEKDgRZJhg1J0A//NExFcSEXqUANPElFCF0dSlpaEOt7YabIF0JhbPrNxo2UpKoihs1f+6+vW+t////+X71X//////////rZia3/p7opoSg51HFH8boraYagH/uoQFPI7RjoVAViuQAct///NExGESew6EAOQEuR65zqKwCVNkjEQU9TtoD11X1t/R/3////////////////7rRp7kt/mOrIRUIUoqKloiODI1YDBa1OyswxCBU9AaLTJQTUjWUYsh5Qj8Hy4u9mQD//NExGoR4waAANtEuZgTJhXJUfVmc5cuAwaCH+p/////////nirhF5VxIs4SuDUosoQQTAw4NlOk7SoTGpDMWhMxYbRYLuBNgARpauO5QQAmJXZc/Ly1rzV4zR5iHRwu//NExHUQ+I5sAOPYTDAlsdQHpV3/d9X1/9ewz/f/+5X/9KozIQzZK2AzhOdEcwILTmrnEgUIACOCQteaJFoYAEDoFkkuRog1EvmSJPmpBBZYnNH6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Y2gUJRcy4lct36hwMnX/kP/////8WzzTrXlqnYvPmW0iG0XKp2NOsPvGXkj2OcVwyjJOgMjpc0TTKstG//NExCEQ0vaAANqEuclQqFIcrJ/+v///2///////v//////65L9v2V5GcGiADbUqpZ9RUxLDfKUhQnCLSdkqebHcLz2/qPHIHoZGGCCJdt2QgESSocS699O////+jf////NExDAR0wJ8ANqEuf//9V//////+iVYp0uvbpUgc5lIoNGJqg4DfxmZifBRsNFUkazZRGAcUUvxeDsvjq2ERIipIcJ755pDkmlVCcS0tHU+lr/////////9Klr///////NExDsSQxJ0ANwEuP+2dy/+8wYkpxKuELglBwIEA7WDMOtHF7iVhM2B4kMASi9ukZ7Gc8osYSCUSy4WJGMr7Yijpx+za///////////////////9WKqN/flqmjDuJEj//NExEUR2wZwANnEuZWRVTcCRMsikCmg13ADToUFQWYuFZehOYQ2PrkWmuzE9WgZnNd3ZVcAQCHPk9kv/Jq8HB0i06Zqd////////+Vd9stBoKB06SU030I2s5JzBRYZ//NExFARYJpYAOYMTAgRIGg/QWIigugjStyqTJREoaQ0eAp4k2VEhJ0odPOIvSu1s8qXV9qF0fap/ru7fv391tT+9en1KjvAEBIqUq1lP24HtWOCYXSRMjFkBaSROByM//NExF0QiFosANvSJBCtoomKJepJlVq3IUdcxqEMK4bH97FrJ5ojW3WbjFZNNTRMh8OtrXWuQDOTfKHYB4hJH/ONcT/cv/kGa8Z3jkMSXESFpC2eiSZuSYTkyGMHn5Lu//NExG0ROCogAVsAAEu7CdjBBfj4y/ymYGhcNIxhljWPYcpQ/oISgZm5uXh9J4yRgRxFX/TppzdTSUNi+fNicZGZ//9BkNvsszLDNNMuMZpGIwv//p3+6mUhz7jjJYlB//NExHshGyqEAZhoAO5SLjl4xL49ygqUyaSGRFJ12qACE1GaUg4N4IzvKzllbvXZvW7uuFTBAYGgwcYWEFExkS//ZWtX+7T/1UnvEQNAyCoKhrEQdBoWLMBoMhN4u0ge//NExEkT0KacAdkYAAdHCRD1gCqArTZTlvU8fQnAvFI3bNM3fuktsV+67ZagwiUi+IGUSYE/CrFRIBICEmbDydFjXdttbf///mdUQjt/+mq5mkX/e66l//////3lZFgy//NExEwW4xaIANNEuREsy0ClqGMcZzpYOgzilnqcft4TjFh5YAJBgDg81RmylUDdglSGpllhaoY4ShLjxAagwIxAE6Is+SpIlJZiZsij11N////2+keZ11Rq5uhzKx7o//NExEMbcxp8ANtOvWratl9bI+yf1////tRTTGOccGxhEiTYQFWJDp5YUGkBwajYYLtYWuYJDxKfo4cN7RXFgBYw2ns3TJM8VV/4ZpQ3sH7KzODkYXgQWQhJBxQbUV1k//NExCgW6x58ANyKvKGylnHWr//////VpDteuvXvimvT/o+n/////6aRc4eD0ylFzrZHFxNRxCjFCDOVRjCTCDXOHGZgMKTH2cDIs2aSAW5Dtw0fScfevXiKFv3xbzFa//NExB8P0H6EANZeSGo6rSbj5FDjf///Lf0Sn////7wiAwWBY8RPgsponWXk1fmXqMHoElbOEdTNawNLSsQRG1CBkUq3ofrvV5dokekmA50NQ2XOosYF0f///s/s//////NExDIQEIKEANYeSPyhECOBgy2H49LRc8QF1bUa0FxgvXZi7wwHCLB5BKw52HZl/cKA4iPgmBUD4hCUX0VgmGGC7///+r//////oYB1gwlW0eEAKHxgfamkiNZu5lsa//NExEQPQHaIANZYSEMut0AaCAlzwxcH3K0/3I5BqJgABopCoHz84DgEDMiz///7mP/////9dzQqSMwONWtqxVAu5SqXyybjQWNnm7nNDtepVogRoLaqPX15bDEXuyjg//NExFoPSHKIANYYSJKZxoIQOc/j9bIkWeDRjwDQqz//xagNvKxy2i3////tjxdZIkQAooAQKUeVEggqxnblCwowYI/6pdMqVs5uB9KjHrGbE+jmpTshsjgLxZo0tOar//NExG8SkI6AANYeTGsEQdFXHlTP//7czw2sS/yKf//1qPA2KzYcFVEC4NSapJN+4xbtzRILN1hQPhpeqbSAfd59uMCxbA+wOAliSJZ6UgpNoD+l314hDIYQY0f/+fGh//NExHcReIp8ANPeTBnT55ArCL+/T///Jb5AH1Mi7EBhGLJdUrptzN54h601AcqUdZyDUcHHU6HmIHEWw3J0PQsvkNyZd0mjEBI1TTP//40yWP3DwdD6gra9v///vnhg//NExIQRqJZ8ANMYTFnDI0gbcVa0TFINotdUc+1uJKDMOh4zKrmqEEvXXHw8l8KSObLl6aW8/A/UvgxSDQttEOlM1lFd/o//jcskKIEpgPE7bP///JrJPseVLHS2epox//NExJARsJ54AMIeTOg62AwZr0rZSsViLuw06hrLClVtXu20fI/UwLcLkmzluYQmRARYYlVMdUCNWE+jbBUGpU71P/+vkg6EnSyP////5ZNVBsEodDSJgrHAcxwGC5xd//NExJwR4K5sAMMeTEmxuKwUMFBAwgcGCFgcDxsBBIWFhUVFWYqKiosLC3iwsKirPWKiwt/r///FVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKcRKK5IAMveTDEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExLUO0HUQAGJGSDEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKwAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKwAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKwAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKwAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKwAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKwAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKwAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKwAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKwAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVHqFtEOCM//NExKwAAANIAAAAAIP4EqBzAiAS4XYgAmYkhAyREJHUJULkMoLEJsJQHOLgQcviQSKeQk8jaMcxDHNtAn2gEeoFGrGNrbmFXKlaSiPRiw0rAWEEzC2ONSRSDDxg9NBN//NExKwAAANIAAAAAAPKmpRSRSUtBNBBODyjUlLWpaBMx2mazc3NzFqDKhayQtUossst9MFZdGB0rKq/6EYsGBlv/1FllQbYCedQhB4K9IC2HAXQTQ4FOo2xQJMessEF//NExKwAAANIAAAAAA9uG4SxJk7W0+hcJDHBjdn4XBHtjJKr4SGIZM8iSx4CsiN6vZNeBSG/j7+KU16IEACc4lDiKHeInhwN+uLND4n9dERERPd3Pd3ju7nEEI7u/7uX//NExP8kUeEcAHvMmf7n6F6IiBwMDAxb7gYAAIgAACMHAQOfWgQtNhr0u3EpG/sGOTLHai0Riuq08OR+CI+h0A4Eg+ZSmJ6mXmJi6yfTpJPTkx5rmlz2wGRkuy1vrj3z//NExMAhKs38AHvGuFrWBdta9djqeZiZaqqjqNznAIlpqLzW+SOftXqqo7PMzMkSNa8zPmf6JEq+NOf75ZLvLUaRIzVVVEq71zSKJ8EF/poViCgpKgH0IKLYWM8Eu0LT//NExI4gor38AMMMuSgpieOcaUempJFEhIhCBwwKzB9lEKREDofIEbDzILBUMu9SBjVCwuZlgWFQisiYCoqKipJ//gIXEboLBUVWKihqVCosHqFN/8qKiQ0aBkhVTEFN//NExF4WiKWEAHmSTEUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NExFYAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NExKkAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV',
            speachOptions: {
                volume: 1,
                rate: 1,
                pitch: 1,
            }
        }
    },
    methods: {
        getVoiceList() {
            // this.voices = speechSynthesis.getVoices();
            // console.log(this.voices);
            this.voices = axios.get('http://8.219.195.118:8081/langs')
                .then(response => {
                    console.log(response.data.langs);
                    this.voices = response.data.langs;
                })
                .catch(error => {
                    console.log(error);
                })

        },
        async get_sound() {
            Swal.fire({
                title: 'Please wait...',
                allowOutsideClick: false,
                showConfirmButton: false,
                onBeforeOpen: () => {
                    Swal.showLoading()
                },
            });
            await axios.post('http://8.219.195.118:8081/tts', {
                text: this.textInput,
                lang: this.voices[this.selectedVoice][0],
            })
                .then(response => {
                    var template = 'data:audio/mpeg;base64,'
                    this.audioBase64 = template + response.data.audio;
                    Swal.close();
                    this.play_audio();
                    this.fileReset();
                }).catch(error => {
                    Swal.close();
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Something went wrong!',
                    })
                    console.log(error);
                });
            // var template = 'data:audio/mpeg;base64,'
            // this.audioBase64 = template + response.data.audio;
            // console.log(response.data.audio);
            //play audio



        },
        async play_audio() {
            audio = new Audio(this.audioBase64);
            await audio.play().then(() => {
                console.log('playing');
            }).catch((error) => {
                console.log(error);
            });
        },
        async stop_audio() {
            console.log('test');
            await audio.pause()
        },
        async pause_audio() {
            console.log('stop');
            await audio.pause()
        },
        async resume_audio() {
            console.log('stop');
            await audio.play()
        },
        onFileChange(e) {
            let file = e.target.files[0];
            let reader = new FileReader();
            reader.readAsText(file);
            reader.onload = () => {
                let contents = reader.result;
                this.textInput = contents;
            }
            //remove file name from input
        },
        fileReset() {
            this.$refs.fileInput.value = '';
        },

    },
    mounted() {
        this.getVoiceList();
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = this.getVoiceList;
        }
        // delay 1000 before playing audio
        setTimeout(this.play_audio, 1000);
    },


}
</script>
<style >
.card {
    padding: 1rem 1.5rem;
    border-radius: 7px;

}
</style>