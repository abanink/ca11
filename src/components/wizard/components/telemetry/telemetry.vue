<component class="c-wizard-telemetry">
    <header class="c-wizard__header">{{$t('telemetry')}}</header>

    <div class="c-wizard__description">
        <span class="cf">
            <a href="https://sentry.io/">Sentry</a>
            {{$t(' application error tracking helps us to improve {name}. Do you want to support {name} by allowing errors to be logged automatically to Sentry?', {name: app.name})}}
        </span>
        <em class="help cf">{{$t('you can change your choice afterwards from Settings.')}}</em>
        <br/>
    </div>

    <slot name="progress"></slot>

    <div class="buttons is-centered">
        <button class="button test-wizard-devices-back" @click="stepBack()">
            {{$t('back')}}
        </button>
        <button class="button cf test-wizard-telemetry-no" @click="toggleTelemetry(false)">
            {{$t('no')}}
        </button>
        <button class="button is-primary cf test-wizard-telemetry-yes" @click="toggleTelemetry(true)">
            {{$t('yes')}}
        </button>
    </div>
</component>
