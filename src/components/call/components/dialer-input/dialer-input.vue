<component class="c-dialer-input" tabindex="-1">
    <input
        v-bind:value="endpoint"
        v-on:input="inputChange($event.target.value)"
        v-on:keyup.enter="setupCall(description)"
        autocomplete="off"
        autofocus placeholder="..."
        name="number-input"
        ref="input"
        type="text"
        @keydown="pressKey($event.key)"
        @keyup="pressKey()"
    />

    <button
        v-on:keyup.enter="keypadAction"
        class="button"
        :class="classes('transfer-button')"
        :disabled="!endpoint"
        @click="setupCall(description)"
    ><icon name="transfer"/></button>
</component>
