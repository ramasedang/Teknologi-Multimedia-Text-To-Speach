<template >
    <div class="mt-10 container text-white">
        <div class="p-4">
            <h2 class="text-center text-sm-start">Convert Text to Speech</h2>
            <h5>Listen to those words!</h5>
            <h4 class="lead mt-4">Select Voice</h4>
            
            
            <!-- <div>
                
                <div class="form-check card mb-1 form-check-inline">
                    <input class="form-check-input" type="radio" />
                    <label class="form-check-label" for="flexRadioDefault1">Male</label>
                </div>
                <div class="form-check card mb-1 form-check-inline">
                    <input class="form-check-input" type="radio" />
                    <label class="form-check-label" for="female">Female</label>
                </div>
            </div> -->


            <!-- Select Menu for Voice -->
            <select id="voices" class="form-select">{ getVoiceList }</select>

            <!-- Range Slliders for Volume, Rate & Pitch -->
            <!-- <div class="d-flex mt-4">
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
            </div> -->

            <!-- Text Area  for the User to Type -->
            <label for="text" class="form-label mt-5 h4">Input Text</label>
            <textarea class="form-control" cols="30" rows="10" placeholder="Type here..."></textarea>

            <!-- Control Buttons -->
            <div class="m-auto">
                <button id="start" class="btn btn-outline-primary mt-5 me-3">Start</button> 
                <font-awesome-icon icon="fa-solid fa-pause" />
                <button id="pause" class="btn btn-outline-warning mt-5 me-3">Pause</button>
                <button id="resume" class="btn btn-outline-info mt-5 me-3">Resume</button>
                <button id="cancel" class="btn btn-outline-danger mt-5 me-3">Cancel</button>
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
    border-radius: 10px;

}
.container {
    margin-top: 20px;
}

</style>