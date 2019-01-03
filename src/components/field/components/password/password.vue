<div class="c-password field">
    <label class="c-password__label ca" :for="name">{{label}}</label>
    <div class="c-password__container">
        <input
            :disabled="disabled"
            :name="name"
            :placeholder="placeholder"
            :type="visible ? 'text' : 'password'"
            :value="value"
            @input="updateModel($event)"
        />
        <ul class="c-password__invalid" v-html="validationMessage"></ul>
        <span :class="{visible}" class="icon is-small is-right" @click="toggleVisible()">
            <icon name="eye"/>
        </span>
    </div>
    <div v-if="help" class="c-password__help cf">{{help}}</div>
</div>
