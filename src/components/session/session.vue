<section
    class="c-login t-login"
    component
    tabindex="-1"
    v-on:keyup.enter="login"
>

    <header>
        <a target="_blank" href="https://docs.ca11.io">
            <icon name="caller" class="c-login__logo"/>
            <div class="c-login__title">
                {{app.name}}
            </div>
        </a>

        <div class="c-login__slogan">
            <transition name="slogan" appear>
                <div v-if="slogans[currentSlogan].show" :key="slogans[currentSlogan].id">{{slogans[currentSlogan].phrase}}</div>
            </transition>
        </div>
    </header>

    <!-- Login when there are no sessions or when starting a new session-->
    <div
        v-if="!app.session.available.length || app.session.active === 'new' || session.status === 'login'">
        <FieldText
            v-model="session.username"
            autocomplete="off"
            elementclass="t-txt-session-id"
            name="session-id"
            :autofocus="true"
            :help="$t('your phone is safely stored on this computer.', {name: app.name})"
            :label="$t('phone name')"
            :placeholder="$t('james,maria,robert,susan,...')"
            :validation="$v.session.username"
        />

        <FieldPassword
            v-model="password"
            elementclass="t-txt-session-pw"
            name="session-pw"
            :autofocus="true"
            :help="$t('the password to secure your phone with.')"
            :label="$t('phone password')"
            :placeholder="$t('secret password')"
            :validation="$v.password"
        />

        <div class="buttons is-centered">
            <button
                v-if="app.session.available.length"
                class="button button--widget t-btn-change-session"
                @click="selectSession()"
                :disabled="session.status === 'login'"
            >{{$t('change session')}}</button>
            <button
                class="button button--widget primary t-btn-login"
                :class="{'is-loading': session.status === 'login'}"
                :disabled="$v.$invalid || session.status === 'login'"
                @click="login"
            >{{$t('start your phone')}}</button>
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
            :label="$t('phone password')"
            :placeholder="$t('secret password')"
            :validation="$v.password"
        />

        <div class="buttons is-centered">
            <button
                v-if="app.session.available.length"
                class="button button--widget t-btn-login"
                :disabled="session.status === 'login'"
                @click="selectSession()"
            >{{$t('change session')}}</button>

            <button
                class="button button--widget primary t-btn-login"
                :class="{'is-loading': session.status === 'login'}"
                :disabled="$v.$invalid || session.status === 'login'"
                @click="login"
            >{{$t('unlock phone')}}</button>
        </div>
    </div>

    <!--List all available sessions-->
    <div
        v-else-if="app.session.available.length && !app.session.active"
        class="sessions"
    >

        <div v-for="session in app.session.available" class="session">
            <i class="icon-session" @click="selectSession(session)"><icon name="phone"/></i>
            <div class="session__description" @click="selectSession(session)">{{session}}</div>
            <i class="icon-remove status-indicator tooltip tooltip-left" :data-tooltip="$t('remove session')" @click="removeSession(session)">
                <icon name="delete"/>
            </i>
        </div>

        <div class="session new-session" @click="newSession()">
            <i class="icon-session">
                <icon class="icon-session" name="phone-add"/>
            </i>
            <div class="session__description cf">
                {{$t('new phone')}}
            </div>
        </div>
    </div>

    <footer class="footer" >
        <div class="footer__version">
            <a target="_blank" href="https://github.com/garage11/ca11">{{app.name}} {{app.version.current}}</a>
            &#8226;
            <a target="_blank" href="https://garage11.tech">&copy; Garage11</a>
        </div>
    </footer>
</section>
