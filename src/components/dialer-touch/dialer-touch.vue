<component class="c-dialer-touch" tabindex="-1">
    <div class="keypad">
        <div :class="classes('number-input')">
            <input name="number-input" type="text" ref="input" autocomplete="off" autofocus placeholder="..."
                @keydown="press($event.key)"
                :readonly="mode === 'dtmf'"
                v-bind:value="endpoint" v-on:input="inputChange($event.target.value)"
                v-on:keyup.enter="validateCall(description)"/>

            <i v-if="mode === 'call'" class="correct" @click="removeLastNumber">
                <icon name="backspace"/>
            </i>
        </div>

        <div class="keys" v-on:keyup.enter="validateCall(description)">
            <div class="key-row">
                <button class="key test-key-1" @mousedown="press('1')">
                    1<div class="sub"><icon name="voicemail"/></div/>
                </button>
                <button class="key test-key-2" @mousedown="press('2')">
                    2<div class="sub">ABC</div>
                </button>
                <button class="key test-key-3" @mousedown="press('3')">
                    3<div class="sub">DEF</div>
                </button>
            </div>
            <div class="key-row">
                <button class="key test-key-4" @mousedown="press('4')">
                    4<div class="sub">GHI</div>
                </button>
                <button class="key test-key-5" @mousedown="press('5')">
                    5<div class="sub">JKL</div>
                </button>
                <button class="key test-key-6" @mousedown="press('6')">
                    6<div class="sub">MNO</div>
                </button>
            </div>
            <div class="key-row">
                <button class="key test-key-7" @mousedown="press('7')">
                    7<div class="sub">PQRS</div>
                </button>
                <button class="key test-key-8" @mousedown="press('8')">
                    8<div class="sub">TUV</div>
                </button>
                <button class="key test-key-9" @mousedown="press('9')">
                    9<div class="sub">WXYZ</div>
                </button>
            </div>
            <div class="key-row">
                <button class="key function test-key-*" @mousedown="press('*')">
                *
                </button>
                <button class="key test-key-0" @mousedown="press('0')">0<div class="sub">+</div></button>
                <button class="key function test-key-#" @mousedown="press('#')">#</button>
            </div>
        </div>
    </div>
</component>
