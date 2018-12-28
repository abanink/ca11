<section component class="c-login" tabindex="-1" v-on:keyup.enter="login">

    <header>
        <div v-if="app.session.active" class="greeting">
            <span v-if="app.session.active === 'new' || user.status === 'login'" class="cf">
                {{$t('welcome to {name}', {name: app.name})}}
            </span>
            <span v-else class="cf">{{$t('welcome back')}}<br/>{{app.session.active}}</span>
        </div>
        <div v-else class="greeting">
            <span class="cf">{{greeting}}</span>
        </div>
        <p class="welcome-message cf">
            <span class="cf">
                <template v-if="!app.session.active && app.session.available.length">
                {{$t('continue with an existing user session')}}
                </template>
                <template v-else-if="app.session.active === 'new' || user.status === 'login'">
                {{$t('a local session is used to protect and encapsulate your personal data; data is stored encrypted on this computer.')}}</br>
                </template>
                <template v-else>
                {{$t('unlock your session with the session secret')}}
                </template>
            </span>
        </p>
    </header>

    <!-- Login without any sessions, or when selecting a new session.-->
    <div v-if="!app.session.available.length || app.session.active === 'new' || user.status === 'login'">
        <!-- Only show the username field with a 'new' session. -->
        <Field name="username" type="text" autocomplete="off"
            :autofocus="true" :label="$t('session name')" :model.sync="user.username"
            :placeholder="$t('used to identify your session with')"
            :validation="$v.user.username"/>

        <Field name="password" type="password"
            :label="$t('session lock secret')" :model.sync="password"
            :placeholder="$t('this secret is used to unlock the session')"
            :validation="$v.password"/>

        <div class="buttons is-centered">
            <button v-if="app.session.available.length" :disabled="user.status === 'login'" type="button" class="button cf" @click="selectSession()">{{$t('change session')}}</button>
            <button type="button" class="button is-primary cf test-login-button" :class="{'is-loading': user.status === 'login'}" :disabled="$v.$invalid || user.status === 'login'" @click="login">{{$t('start session')}}</button>
        </div>
    </div>

    <!-- Unlocking a selected session..-->
    <div v-else-if="app.session.active && app.session.active !== 'new'">
        <!-- Do not publish browser test screenshots without a password field. This would leak test credentials. -->
        <Field name="password" type="password"
            :label="$t('session lock secret')" :model.sync="password"
            :placeholder="$t('this secret is used to unlock the session')"
            :validation="$v.password"/>

        <div class="buttons is-centered">
            <button v-if="app.session.available.length" :disabled="user.status === 'login'" type="button" class="button cf" @click="selectSession()">{{$t('change session')}}</button>
            <button type="button" class="button is-primary cf test-login-button" :class="{'is-loading': user.status === 'login'}" :disabled="$v.$invalid || user.status === 'login'" @click="login">{{$t('log in')}}</button>
        </div>
    </div>

    <!-- Session picker that presents available sessions to choose from.-->
    <div class="sessions" v-else-if="app.session.available.length && !app.session.active">
        <div v-for="session in app.session.available" class="session">
            <i class="icon-session" @click="selectSession(session)"><icon name="contact"/></i>
            <div class="description" @click="selectSession(session)">{{session}}</div>
            <i class="icon-remove status-indicator tooltip tooltip-left" :data-tooltip="$t('remove session').capitalize()" @click="removeSession(session)">
                <icon name="delete"/>
            </i>
        </div>
        <div class="welcome-message">
            <span class="cf">{{$t('or create a new user session')}}</span>
        </div>
        <div class="session new-session" @click="newSession()">
            <i class="icon-session"><icon class="icon-session" name="contact-add"/></i>
            <div class="description cf">{{$t('add session')}}</div>
        </div>
    </div>

    <footer>
        <div class="help-message cf">
            {{$t('need help?')}}<br/>
            <span class="cf">{{$t('click on the')}}</span>
            <i @click="setOverlay('about')"><icon name="help"/></i>{{$t('icon')}}
        </div>
    </footer>
</section>
