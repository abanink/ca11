<div class="c-select field" v-click-outside="searchToggle">
    <label
        class="c-select__label field__label"
        :class="classes('label')"
        :for="name"
    >{{label}}</label>

    <div class="c-select__control">
        <div
            v-bind:class="classes('select-search')"
            class="c-select__element-container"
        >
            <input
                v-model="searchQuery"
                autocomplete="off"
                class="c-select__element field__element"
                ref="input"
                readonly="!search"
                :disabled="disabled"
                :id="name"
                :placeholder="value.id ? value.name : placeholder.capitalize()"
                @click="searchSelect($event, null, null, false)"
                @input="searchSelect($event, null, 'query', false)"
                @keydown.up="searchSelect($event, null, 'up', false)"
                @keydown.down="searchSelect($event, null, 'down', false)"
                @keyup.enter="searchSelect($event, null, 'enter', true)"
                @keyup.escape="visible = false"
                @keydown.page-down="searchSelect($event, null, 'page-down', false)"
                @keydown.page-up="searchSelect($event, null, 'page-up', false)"
            />

            <slot class="button" name="button"></slot>
        </div>

        <div class="c-select__options" v-show="visible" ref="options">
            <div
                v-for="option in filteredOptions"
                class="option"
                :class="{selected: searchSelected.id === option.id}"
                :id="`option-${option.id.split('.')[0]}`"
                @click="searchSelect($event, option, null, true)"
            >
                {{option.name.ca()}}
            </div>
        </div>

    </div>
    <div class="c-select__help field__help cf" v-if="help">{{help}}</div>
    <span v-if="invalidFieldValue && validationMessage"
        class="validation-message is-danger" v-html="validationMessage"></span>
    <slot name="context"></slot>
</div>
