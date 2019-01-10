<nav component class="c-main-menu">
    <div class="options">

        <button
            class="button option t-btn-menu-activity"
            :class="classes('activities')"
            @click="setLayer('activities')"
        ><icon name="recent"/></button>

        <button
            class="button option t-btn-menu-contacts"
            :class="classes('contacts', true)"
            @click="setLayer('contacts')"
        ><icon name="contacts"/></button>

        <button
            class="button option t-btn-menu-calls"
            :class="classes('calls')"
            @click="setLayer('calls')"
        ><icon name="phone"/></button>

        <button
            v-if="plugin.menubarIcon"
            v-for="plugin in customPlugins" @click="setLayer(plugin.menubarIcon)"
            class="button option"
            :class="classes(plugin.menubarIcon, plugin.menubarTransferHint)"
        ><icon :name="plugin.menubarIcon"/></button>

    </div>
</nav>
