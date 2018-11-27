<component class="component-call-keypad-input" tabindex="-1">
    <div :class="classes('number-input')">
        <input name="number-input" type="text" ref="input" autocomplete="off" autofocus placeholder="..."
            @keyup="pressKey()" @keydown="pressKey($event.key)"
            v-bind:value="endpoint" v-on:input="inputChange($event.target.value)"
            v-on:keyup.enter="setupCall(description)"/>

        <i class="icon icon-small" :class="{'disabled': !endpoint}"
            v-on:keyup.enter="keypadAction" @click="setupCall(description)"><icon name="transfer"/></i>
    </div>

    <div class="contacts-match">
        <span v-if="matchedContact">
            {{matchedContact.endpoint.number}} - {{matchedContact.contact.name}}
        </span>
    </div>
</component>
