<section component class="c-login" tabindex="-1" v-on:keyup.enter="login">

    <header>
        <div class="c-login__title">
            {{$t('welcome to {name}', {name: app.name})}}
        </div>

        <div class="c-login__subtitle">
            {{$t('secure decentralized calling, meetings and collaboration')}}</br>
        </div>
    </header>

    <!-- Login when there are no sessions or when starting a new session-->
    <div
        v-if="!app.session.available.length || app.session.active === 'new' || user.status === 'login'">
        <FieldText
            v-model="user.username"
            autocomplete="off"
            name="username"
            :autofocus="true"
            :help="$t('a session holds your data on this computer.')"
            :label="$t('session name')"
            :placeholder="$t('session name')"
            :validation="$v.user.username"
        />

        <FieldText
            v-model="password"
            name="password"
            :autofocus="true"
            :help="$t('your data is protected with this secret.')"
            :label="$t('session secret')"
            :placeholder="$t('screen secret')"
            :validation="$v.password"
        />

        <div class="buttons is-centered">
            <button
                v-if="app.session.available.length"
                class="button cf"
                @click="selectSession()"
                :disabled="user.status === 'login'"
            >{{$t('change session')}}</button>
            <button
                class="button is-primary test-login-button"
                :class="{'is-loading': user.status === 'login'}"
                :disabled="$v.$invalid || user.status === 'login'"
                @click="login"
            >{{$t('start session')}}</button>
        </div>
    </div>

    <!--Unlocking a selected session-->
    <div v-else-if="app.session.active && app.session.active !== 'new'">
        <FieldText
            v-model="password"
                name="username"
            :autofocus="true"
            :help="$t('the session can be opened with the correct session secret.')"
            :label="$t('session secret')"
            :placeholder="$t('session secret')"
            :validation="$v.password"
        />

        <div class="buttons is-centered">
            <button
                v-if="app.session.available.length"
                :disabled="user.status === 'login'"
                class="button cf"
                @click="selectSession()"
            >{{$t('change session')}}</button>

            <button
                class="button is-primary test-login-button"
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
            <i class="icon-session" @click="selectSession(session)"><icon name="contact"/></i>
            <div class="description" @click="selectSession(session)">{{session}}</div>
            <i class="icon-remove status-indicator tooltip tooltip-left" :data-tooltip="$t('remove session')" @click="removeSession(session)">
                <icon name="delete"/>
            </i>
        </div>
        <div class="c-login__subtitle">
            {{$t('start new session')}}
        </div>
        <div class="session new-session" @click="newSession()">
            <i class="icon-session"><icon class="icon-session" name="contact-add"/></i>
            <div class="description cf">{{$t('add session')}}</div>
        </div>
    </div>

    <footer>
        <div class="help-message cf">
            {{$t('what is this?')}}<br/>
            <span class="cf">{{$t('click on the')}}</span>
            <i @click="setOverlay('about')"><icon name="help"/></i>{{$t('icon')}}
        </div>
    </footer>
</section>
