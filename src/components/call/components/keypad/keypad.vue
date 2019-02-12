<component class="c-keypad t-keypad" tabindex="-1">

    <div class="c-keypad__input">
        <input
            v-bind:value="number"
            v-on:input="inputChange($event.target.value)"
            autocomplete="off"
            name="number-input"
            placeholder="..."
            ref="input"
            type="text"
            :readonly="mode === 'dtmf'"
            @keydown="press($event.key)"
        />

        <button
            v-if="mode === 'call'"
            class="c-keypad__correct"
            @click="removeLastNumber"
        >
            <icon name="backspace"/>
        </button>
    </div>

    <div class="c-keypad__keys">
        <div class="c-keypad__key-row">
            <button class="c-keypad__key t-btn-keypad-1" @mousedown="press('1')">
                1<div class="sub"><icon name="voicemail"/></div/>
            </button>
            <button class="c-keypad__key t-btn-keypad-2" @mousedown="press('2')">
                2<div class="sub">ABC</div>
            </button>
            <button class="c-keypad__key t-btn-keypad-3" @mousedown="press('3')">
                3<div class="sub">DEF</div>
            </button>
        </div>
        <div class="c-keypad__key-row">
            <button class="c-keypad__key t-btn-keypad-4" @mousedown="press('4')">
                4<div class="sub">GHI</div>
            </button>
            <button class="c-keypad__key t-btn-keypad-5" @mousedown="press('5')">
                5<div class="sub">JKL</div>
            </button>
            <button class="c-keypad__key t-btn-keypad-6" @mousedown="press('6')">
                6<div class="sub">MNO</div>
            </button>
        </div>
        <div class="c-keypad__key-row">
            <button class="c-keypad__key t-btn-keypad-7" @mousedown="press('7')">
                7<div class="sub">PQRS</div>
            </button>
            <button class="c-keypad__key t-btn-keypad-8" @mousedown="press('8')">
                8<div class="sub">TUV</div>
            </button>
            <button class="c-keypad__key t-btn-keypad-9" @mousedown="press('9')">
                9<div class="sub">WXYZ</div>
            </button>
        </div>
        <div class="c-keypad__key-row">
            <button class="c-keypad__key function t-btn-keypad-*" @mousedown="press('*')">
            *
            </button>
            <button class="c-keypad__key t-btn-keypad-0" @mousedown="press('0')">0<div class="sub">+</div></button>
            <button class="c-keypad__key function t-btn-keypad-#" @mousedown="press('#')">#</button>
        </div>
    </div>
</component>
