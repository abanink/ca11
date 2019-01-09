<component class="c-dialer-input" tabindex="-1">
    <div class="number-input">
        <input
            v-bind:value="endpoint"
            v-on:input="inputChange($event.target.value)"
            v-on:keyup.enter="setupCall(description)"
            autocomplete="off"
            autofocus placeholder="..."
            name="number-input"
            ref="input"
            type="text"
            @keyup="pressKey()" @keydown="pressKey($event.key)"
        />

        <button
            v-on:keyup.enter="keypadAction"
            class="button"
            :class="{'disabled': !endpoint}"
            @click="setupCall(description)"
        >
            <icon name="transfer"/></button>
    </div>

    <div class="contacts-match">
        <span v-if="matchedContact">
            {{matchedContact.endpoint.number}} - {{matchedContact.contact.name}}
        </span>
    </div>
</component>
