<component class="c-wizard-telemetry">
    <header class="ca">{{$t('telemetry')}}</header>

    <div class="step-description">
        <span class="cf">
            {{$t('{name} uses Sentry error tracking. This helps us to respond better to potential stability issues in {name}. Logged exceptions are semi-anonimized and are removed after the issue is fixed.', {name: app.name})}}
        </span>
        <span class="cf">
            {{$t('do you want to enable error tracking?', {name: app.name})}}
        </span>
        <em class="help cf">{{$t('you can always change this choice afterwards in Settings.')}}</em>
        <br/>
    </div>

    <slot name="progress"></slot>

    <div class="buttons is-centered">
        <button class="button cf test-wizard-telemetry-no" @click="toggleTelemetry(false)">
            {{$t('no thanks')}}
        </button>
        <button class="button is-primary cf test-wizard-telemetry-yes" @click="toggleTelemetry(true)">
            {{$t('no problem')}}
        </button>
    </div>
</component>
