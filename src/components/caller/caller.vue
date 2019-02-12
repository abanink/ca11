<component class="c-caller t-caller" :class="classes('component')">

    <header v-if="!callActive.id" class="content__header header">
        <icon class="header__icon" name="phone"/>

        <div class="header__filters">
            <FieldRadio
                v-model="description.protocol"
                elementclass="t-rd-calls-protocol"
                class="header__filter"
                name="protocol"
                :options="protocols"
            />
        </div>

        <span class="header__text">{{$t('calling')}}</span>
        <div class="header__actions">
            <button v-if="description.protocol === 'sig11'"
                class="header__action"
                :class="{'active': sig11.network.view}"
                @click.stop="toggleNodeView()"
            >
                <icon name="nodes"/>
            </button>
        </div>
    </header>

    <StreamPreview v-else-if="callActive.id" :call="callActive"/>

    <main class="main">
        <Call v-if="callActive.id" :call="callActive"/>
        <StreamView v-else-if="stream[stream.type].selected" :call="null"/>
        <!-- calling disabled -->
        <div v-else-if="callingDisabled" class="call-disabled">
            <icon class="disabled-icon" name="phone"/>
            <div class="disabled-text">
                <span class="cf">{{$t('service unavailable.')}}</span><br/>
                <span class="cf">{{$t('what is wrong?')}}</span>
            </div>
            <div class="disabled-reason">
                <ul>
                    <li v-for="reason in callingDisabled">
                        {{translations('callingDisabled', reason)}}
                    </li>
                </ul>
            </div>
        </div>
        <!-- starting without any active call -->
        <Keypad
            v-else-if="description.protocol === 'sip' || !sig11.network.view"
            display="touch"
            mode="call"
            :number="description.number"
            :model.sync="description.number"
        />
        <Network
            v-else
        />
    </main>
</component>
