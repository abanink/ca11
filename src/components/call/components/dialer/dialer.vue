<component class="c-dialer" tabindex="-1">
    <input
        v-bind:value="endpoint"
        v-on:input="inputChange($event.target.value)"
        v-on:keyup.enter="call({description})"
        autocomplete="off"
        autofocus placeholder="..."
        class="c-dialer__input t-txt-dialer-number"
        name="number-input"
        ref="input"
        type="text"
        @keydown="pressKey($event.key)"
        @keyup="pressKey()"
    />

    <button
        v-on:keyup.enter="keypadAction"
        class="c-dialer__transfer button t-btn-dialer-call"
        :class="classes('transfer-button')"
        :disabled="!endpoint"
        @click="call({description})"
    ><icon name="transfer"/></button>
</component>
