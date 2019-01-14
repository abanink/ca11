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

        <div class="c-login__subtitle">
            {{$t('open softphone & decentralized communication network')}}</br>
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
            :help="$t('your session is stored in a local vault.', {name: app.name})"
            :label="$t('session name')"
            :placeholder="$t('session name')"
            :validation="$v.user.username"
        />

        <FieldPassword
            v-model="password"
            elementclass="t-txt-session-pw"
            name="session-pw"
            :autofocus="true"
            :help="$t('password that opens this vault.')"
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

        <div class="c-login__subtitle">
            {{$t('continue a previous session')}}
        </div>

        <div v-for="session in app.session.available" class="session">
            <i class="icon-session" @click="selectSession(session)"><icon name="contact"/></i>
            <div class="description" @click="selectSession(session)">{{session}}</div>
            <i class="icon-remove status-indicator tooltip tooltip-left" :data-tooltip="$t('remove session')" @click="removeSession(session)">
                <icon name="delete"/>
            </i>
        </div>
        <div class="c-login__subtitle">
            {{$t('or start a new session')}}
        </div>
        <div class="session new-session" @click="newSession()">
            <i class="icon-session">
                <icon class="icon-session" name="contact-add"/>
            </i>
            <div class="description cf">
                {{$t('create new session')}}
            </div>
        </div>
    </div>

    <footer>
        <div class="help-message cf" @click="openTab(vendor.support.website)">
            {{$t('learn more about {name}', {name: app.name})}}<br/>
        </div>
    </footer>
</section>
