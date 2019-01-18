<section
    class="c-login t-login"
    component
    tabindex="-1"
    v-on:keyup.enter="login"
>

    <header>
        <div class="c-login__title">
            {{$t('welcome to {name}', {name: app.name})}}
        </div>

        <icon name="logo" class="c-login__logo"/>

        <div class="c-login__subtitle">
            {{$t('decentralized')}}<br/>
            WebRTC {{$t('phone network')}}</br>
        </div>
    </header>

    <!-- Login when there are no sessions or when starting a new session-->
    <div
        v-if="!app.session.available.length || app.session.active === 'new' || user.status === 'login'">
        <FieldText
            v-model="user.username"
            autocomplete="off"
            elementclass="t-txt-session-id"
            name="session-id"
            :autofocus="true"
            :help="$t('your session is stored encrypted on this computer.', {name: app.name})"
            :label="$t('session name')"
            :placeholder="$t('session name')"
            :validation="$v.user.username"
        />

        <FieldPassword
            v-model="password"
            elementclass="t-txt-session-pw"
            name="session-pw"
            :autofocus="true"
            :help="$t('password that will decrypt this session.')"
            :label="$t('session password')"
            :placeholder="$t('session password')"
            :validation="$v.password"
        />

        <div class="buttons is-centered">
            <button
                v-if="app.session.available.length"
                class="button t-btn-change-session"
                @click="selectSession()"
                :disabled="user.status === 'login'"
            >{{$t('change session')}}</button>
            <button
                class="button t-btn-login"
                :class="{'is-loading': user.status === 'login'}"
                :disabled="$v.$invalid || user.status === 'login'"
                @click="login"
            >{{$t('begin session')}}</button>
        </div>
    </div>

    <!--Unlocking a selected session-->
    <div v-else-if="app.session.active && app.session.active !== 'new'">
        <FieldText
            v-model="password"
            elementclass="t-txt-session-pw"
            name="session-pw"
            :autofocus="true"
            :help="$t('password that opens vault {name}.', {name: app.session.active})"
            :label="$t('session password')"
            :placeholder="$t('session password')"
            :validation="$v.password"
        />

        <div class="buttons is-centered">
            <button
                v-if="app.session.available.length"
                class="button t-btn-login"
                :disabled="user.status === 'login'"
                @click="selectSession()"
            >{{$t('change session')}}</button>

            <button
                class="button t-btn-login"
                :class="{'is-loading': user.status === 'login'}"
                :disabled="$v.$invalid || user.status === 'login'"
                @click="login"
            >{{$t('log in')}}</button>
        </div>
    </div>

    <!--List all available sessions-->
    <div
        v-else-if="app.session.available.length && !app.session.active"
        class="sessions"
    >

        <div v-for="session in app.session.available" class="session">
            <i class="icon-session" @click="selectSession(session)"><icon name="session"/></i>
            <div class="session__description" @click="selectSession(session)">{{session}}</div>
            <i class="icon-remove status-indicator tooltip tooltip-left" :data-tooltip="$t('remove session')" @click="removeSession(session)">
                <icon name="delete"/>
            </i>
        </div>

        <div class="session new-session" @click="newSession()">
            <i class="icon-session">
                <icon class="icon-session" name="session"/>
            </i>
            <div class="session__description cf">
                {{$t('new session')}}
            </div>
        </div>
    </div>

    <footer class="footer" >
        <div class="footer__docs"  @click="openTab(vendor.support.website)">
            {{$t('more information')}}
        </div>
        <div class="footer__version">
            v{{app.version.current}}
        </div>
    </footer>
</section>
