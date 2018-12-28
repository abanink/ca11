<component class="c-calls" :class="classes('component')">

    <header class="main-content-header" v-if="callActive.status === 'new'">
        <icon class="header-icon" name="phone"/>
        <span class="header-text uc">{{$t('calls')}}</span>

        <div class="header-filters">
            <Field class="filter" name="protocol" type="radio-group" :model.sync="description.protocol" :options="protocols"/>
        </div>

        <div class="header-actions"></div>
    </header>
    <CallMediaPreview v-else-if="callActive.id" :call="callActive"/>

    <!-- calling disabled -->
    <main class="main-content-base">
        <div v-if="!keypadEnabled" class="call-disabled">
            <icon class="disabled-icon" name="dialpad-off"/>
            <div class="disabled-text">
                <span class="cf">{{$t('service unavailable.')}}</span><br/>
                <span class="cf">{{$t('what\'s wrong?')}}</span>
            </div>
            <div class="disabled-reason">
                <ul>
                    <li v-for="reason in callingDisabled">
                        {{translations('callingDisabled', reason)}}
                    </li>
                </ul>
            </div>
        </div>

        <Call v-if="callActive.id" :call="callActive"/>
        <!-- starting without any active call -->
        <DialerTouch
            v-else
            display="touch"
            mode="call"
            :endpoint="description.endpoint"
            :model.sync="description.endpoint"
        />
    </main>
</component>
