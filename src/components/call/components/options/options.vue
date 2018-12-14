<component class="component-call-options">

    <!-- <div class="rounded-button-with-text">
        <div class="rounded-button" @click="muteToggle" :class="classes('mute-button')">
            <icon name="mic-off"/>
        </div>
        <p class="ca">{{$t('mute')}}</p>
    </div> -->

    <div class="rounded-button-with-text" v-if="call.transfer.type !== 'accept'">
        <div class="rounded-button" @click="transferToggle" :class="classes('transfer-button')">
            <icon name="transfer"/>
        </div>
        <p class="ca">{{$t('transfer')}}</p>
    </div>
    <div class="rounded-button-with-text" v-else>
        <div class="rounded-button" @click="transferFinalize">
            <icon name="merge"/>
        </div>
        <p class="ca">{{$t('transfer')}}</p>
    </div>

    <div class="rounded-button-with-text">
        <div class="rounded-button" @click="holdToggle" :class="classes('hold-button')">
            <icon name="call-hold"/>
        </div>
        <p class="ca">{{$t('on hold')}}</p>
    </div>

    <div class="rounded-button-with-text">
        <div class="rounded-button" @click="keypadToggle" :class="classes('dialpad-button')">
            <icon name="dialpad"/>
        </div>
        <p class="ca">{{$t('keypad')}}</p>
    </div>

</component>
