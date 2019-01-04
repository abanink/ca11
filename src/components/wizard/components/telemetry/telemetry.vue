<component class="c-wizard-telemetry">
    <header class="ca">{{$t('telemetry')}}</header>

    <div class="step-description">
        <span class="cf">
            {{$t('Sentry application error tracking helps us to improve {name}. Do you want to help by allowing {name} to send application error data to Sentry?', {name: app.name})}}
        </span>
        <em class="help cf">{{$t('you can always change your choice afterwards in Settings.')}}</em>
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
