<template >
    <div>
        <h4>{{ selectedVoice }}</h4>
        <div class="card">
            <h2>Baca berita CNN</h2>
            <h5>Listen to those words!</h5>

            <!-- Text Area  for the User to Type -->
            <textarea class="form-control mt-5" v-model="textInput" cols="30" rows="10"
                placeholder="Type here..."></textarea>

            <!-- Control Buttons -->
            <div class="mb-5">
                <button id="start" class="btn btn-success mt-5 me-3" @click="startSpeach()">Start</button>
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
            selectedVoice: 1,
            textInput: null,
            speachOptions: {
                volume: 1,
                rate: 1,
                pitch: 1,
            }
        }
    },
    methods: {
        getVoiceList() {
            this.voices = speechSynthesis.getVoices();
            console.log(this.voices);

        },
        rateChange() {
            const rate = document.querySelector('#rate').value;
            document.querySelector('#rate-label').textContent = rate;
        },
        startSpeach() {
            try {
                const msg = new SpeechSynthesisUtterance();
                msg.text = this.textInput;
                msg.volume = this.speachOptions.volume;
                msg.rate = this.speachOptions.rate;
                msg.pitch = this.speachOptions.pitch;
                msg.voice = this.voices[this.selectedVoice];
                speechSynthesis.speak(msg);
                //save to file .mp3
                
            } catch (error) {
                console.log(error);
            }
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