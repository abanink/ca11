<nav component class="c-menu">
    <div class="options">

        <button
            class="button button--menu c-menu__option t-btn-menu-activity tooltip tooltip-right"
            :class="classes('activities')"
            :data-tooltip="$t('activities')"
            @click="setLayer('activities')"
        ><icon name="recent"/></button>

        <button
            class="button button--menu c-menu__option t-btn-menu-contacts tooltip tooltip-right"
            :class="classes('contacts', true)"
            :data-tooltip="$t('contacts')"
            @click="setLayer('contacts')"
        ><icon name="contacts"/></button>

        <button
            class="button button--menu c-menu__option t-btn-menu-calls tooltip tooltip-right"
            :class="classes('caller')"
            :data-tooltip="$t('caller')"
            @click="setLayer('caller')"
        ><icon name="phone"/></button>

        <button
            v-if="plugin.menubarIcon"
            v-for="plugin in customPlugins" @click="setLayer(plugin.menubarIcon)"
            class="button option"
            :class="classes(plugin.menubarIcon)"
        ><icon :name="plugin.menubarIcon"/></button>

    </div>
</nav>
