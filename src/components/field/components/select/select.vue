<div class="c-select field">
    <label class="c-select__label field__label ca" :class="classes()" :for="name">{{label}}</label>
    <div class="c-select__container">
        <select
            class="c-select__element"
            :disabled="disabled || !options.length"
            :name="name"
            @change="updateModel($event)"
        >
            <option v-if="!options.length" value="" disabled selected class="cf">
                {{$t(empty)}}
            </option>

            <option v-else-if="placeholder" :value="null">
                {{placeholder.ca()}}
            </option>

            <option
                v-if="option.name"
                v-for="option in options"
                :selected="option[idfield] === value.id"
                :value="option[idfield]"
            >{{$t(option.name).ca()}}</option>
        </select>
        <slot class="c-select__button" name="button"></slot>
    </div>
    <slot class="c-select__context" name="context"></slot>

    <div v-if="help" class="c-select__help field__help cf">{{help}}</div>
    <ul v-if="invalidFieldValue && validationMessage" class="c-select__invalid" v-html="validationMessage"></ul>
</div>
