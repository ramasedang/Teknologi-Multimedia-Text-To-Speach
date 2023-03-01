<template >
    <div>
        <div class="card">
            <h2>Convert Text to Speech</h2>
            <h5>Listen to those words!</h5>
            <p class="lead mt-4">Select Voice</p>

            <!-- Select Menu for Voice -->
            <select id="voices" class="form-select"></select>

            <!-- Range Slliders for Volume, Rate & Pitch -->
            <div class="d-flex mt-4">
                <div>
                    <p class="lead">Volume</p>
                    <input type="range" min="0" max="1" value="1" step="0.1" id="volume" />
                    <span id="volume-label" class="ms-2">1</span>
                </div>
                <div class="mx-5">
                    <p class="lead">Rate</p>
                    <input type="range" min="0.1" max="10" value="1" id="rate" step="0.1" />
                    <span id="rate-label" class="ms-2">1</span>
                </div>
                <div>
                    <p class="lead">Pitch</p>
                    <input type="range" min="0" max="1" value="1" step="0.1" id="pitch" />
                    <span id="pitch-label" class="ms-2">1</span>
                </div>
            </div>

            <!-- Text Area  for the User to Type -->
            <textarea class="form-control mt-5" cols="30" rows="10" placeholder="Type here..."></textarea>

            <!-- Control Buttons -->
            <div class="mb-5">
                <button id="start" class="btn btn-success mt-5 me-3">Start</button>
                <button id="pause" class="btn btn-warning mt-5 me-3">Pause</button>
                <button id="resume" class="btn btn-info mt-5 me-3">Resume</button>
                <button id="cancel" class="btn btn-danger mt-5 me-3">Cancel</button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'HomeView',
    data() {
        return {
            msg: 'Welcome to Your Vue.js App',
            voices: [],
        }
    },
    methods: {
        getVoiceList() {
            const voices = speechSynthesis.getVoices();
            voices.forEach(voice => {
                const option = document.createElement('option');
                option.textContent = voice.name + '(' + voice.lang + ')';
                option.setAttribute('data-lang', voice.lang);
                option.setAttribute('data-name', voice.name);
                document.querySelector('#voices').appendChild(option);
            });
        },
    },
    mounted() {
        this.getVoiceList();
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = this.getVoiceList;
        }
    },

}
</script>
<style >
.card {
    padding: 1rem 1.5rem;
    border-radius: 7px;

}
</style>