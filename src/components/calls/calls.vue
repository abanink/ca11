<component class="c-calls t-calls" :class="classes('component')">

    <header v-if="callActive.status === 'new'" class="content__header header">
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
        <div class="header__actions"></div>
    </header>
    <CallMediaPreview v-else-if="callActive.id" :call="callActive"/>

    <main class="main">
        <Call v-if="callActive.id" :call="callActive"/>
        <MediaStream
            v-else-if="stream[stream.type].selected"
            class="local-stream-preview"
            :stream="stream[stream.type]"
        />
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
            v-else
            display="touch"
            mode="call"
            :endpoint="description.endpoint"
            :model.sync="description.endpoint"
        />
    </main>
</component>
