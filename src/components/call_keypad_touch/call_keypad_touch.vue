<component class="component-call-keypad-touch" tabindex="-1" :class="{'call-ongoing': callOngoing}">

    <div :class="classes('number-input')">
        <input name="number-input" type="text" ref="input" autocomplete="off" autofocus placeholder="..."
            @keyup="pressKey()" @keydown="pressKey($event.key)"
            v-bind:value="endpoint" v-on:input="inputChange($event.target.value)"
            v-on:keyup.enter="setupCall()"/>

        <i class="correct" v-if="mode === 'call'" @click="removeLastNumber">
            <icon name="backspace"/>
        </i>
    </div>

    <div class="contacts-match" v-if="mode === 'call'">
        <span v-if="matchedContact">
            {{matchedContact.endpoint.number}} - {{matchedContact.contact.name}}
        </span>
    </div>

    <div class="keys" v-on:keyup.enter="setupCall()">
        <div class="key-row">
            <button class="key test-key-1" @mouseup="unpressKey()" @mousedown="pressKey('1')">1</button>
            <button class="key test-key-2" @mouseup="unpressKey()" @mousedown="pressKey('2')">2<div class="sub">ABC</div></button>
            <button class="key test-key-3" @mouseup="unpressKey()" @mousedown="pressKey('3')">3<div class="sub">DEF</div></button>
        </div>
        <div class="key-row">
            <button class="key test-key-4" @mouseup="unpressKey()" @mousedown="pressKey('4')">4<div class="sub">GHI</div></button>
            <button class="key test-key-5" @mouseup="unpressKey()" @mousedown="pressKey('5')">5<div class="sub">JKL</div></button>
            <button class="key test-key-6" @mouseup="unpressKey()" @mousedown="pressKey('6')">6<div class="sub">MNO</div></button>
        </div>
        <div class="key-row">
            <button class="key test-key-7" @mouseup="unpressKey()" @mousedown="pressKey('7')">7<div class="sub">PQRS</div></button>
            <button class="key test-key-8" @mouseup="unpressKey()" @mousedown="pressKey('8')">8<div class="sub">TUV</div></button>
            <button class="key test-key-9" @mouseup="unpressKey()" @mousedown="pressKey('9')">9<div class="sub">WXYZ</div></button>
        </div>
        <div class="key-row">
            <button class="key test-key-*" @mouseup="unpressKey()" @mousedown="pressKey('*')">*</button>
            <button class="key test-key-0" @mouseup="unpressKey()" @mousedown="pressKey('0')">0<div class="sub">+</div></button>
            <button class="key test-key-#" @mouseup="unpressKey()" @mousedown="pressKey('#')">#</button>
        </div>
    </div>
    <!-- Dial actions when not used in combination with a call. -->
    <div class="call-actions" v-if="mode === 'call'">
        <div class="rounded-button action dial test-call-button" @click="setupCall(callDescription)" :class="{'disabled': !callDescription.endpoint}">
            <icon name="phone"/>
        </div>
    </div>
</component>
