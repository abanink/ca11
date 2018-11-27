<component class="component-call-keypad-touch" tabindex="-1">

    <header v-if="callActive.status === 'new'">
        <div class="header-line">
            <div class="title uc">{{$t('calls')}}</div>
            <div class="vertical-devider"></div>
            <div class="content-filters">
                <Field name="protocol" type="radio-group" :model.sync="description.protocol" :options="protocols"/>
            </div>
        </div>
        <div class="header-line contacts-options">
            <div class="field field-text">

            </div>
        </div>
    </header>

    <div class="keypad">
        <div :class="classes('number-input')">
            <input name="number-input" type="text" ref="input" autocomplete="off" autofocus placeholder="..."
                @keyup="unpress()" @keydown="press($event.key)"
                :readonly="mode === 'dtmf'"
                v-bind:value="endpoint" v-on:input="inputChange($event.target.value)"
                v-on:keyup.enter="validateCall(description)"/>

            <i class="correct" v-if="mode === 'call'" @click="removeLastNumber">
                <icon name="backspace"/>
            </i>
        </div>
        <Soundmeter v-if="!callOngoing" class="soundmeter"/>

        <div class="keys" v-on:keyup.enter="validateCall(description)">
            <div class="key-row">
                <button class="key test-key-1" @mouseup="unpress()" @mousedown="press('1')">
                    1<div class="sub"><icon name="voicemail"/></div/>
                </button>
                <button class="key test-key-2" @mouseup="unpress()" @mousedown="press('2')">
                    2<div class="sub">ABC</div>
                </button>
                <button class="key test-key-3" @mouseup="unpress()" @mousedown="press('3')">
                    3<div class="sub">DEF</div>
                </button>
            </div>
            <div class="key-row">
                <button class="key test-key-4" @mouseup="unpress()" @mousedown="press('4')">
                    4<div class="sub">GHI</div>
                </button>
                <button class="key test-key-5" @mouseup="unpress()" @mousedown="press('5')">
                    5<div class="sub">JKL</div>
                </button>
                <button class="key test-key-6" @mouseup="unpress()" @mousedown="press('6')">
                    6<div class="sub">MNO</div>
                </button>
            </div>
            <div class="key-row">
                <button class="key test-key-7" @mouseup="unpress()" @mousedown="press('7')">
                    7<div class="sub">PQRS</div>
                </button>
                <button class="key test-key-8" @mouseup="unpress()" @mousedown="press('8')">
                    8<div class="sub">TUV</div>
                </button>
                <button class="key test-key-9" @mouseup="unpress()" @mousedown="press('9')">
                    9<div class="sub">WXYZ</div>
                </button>
            </div>
            <div class="key-row">
                <button class="key function test-key-*" @mouseup="unpress()" @mousedown="press('*')">
                *
                </button>
                <button class="key test-key-0" @mouseup="unpress()" @mousedown="press('0')">0<div class="sub">+</div></button>
                <button class="key function test-key-#" @mouseup="unpress()" @mousedown="press('#')">#</button>
            </div>
        </div>

        <!-- Dial actions when not used in combination with a call. -->
        <div class="call-actions" v-if="mode === 'call'">
            <button class="rounded-button action dial test-call-button"
                :class="{'disabled': !description.endpoint}"
                @click="validateCall(description)">
                <icon name="phone"/>
            </button>
        </div>
    </div>


</component>
