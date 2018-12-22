<component class="c-wizard-telemetry">
    <header class="ca">{{$t('telemetry')}}</header>

    <div class="step-description">
        <span class="cf">
            {{$t('{name} can log application errors automatically. This anonimized data helps improving {name}\'s stability and quality. Issue data is removed after being fixed.', {name: app.name})}}
        </span>
        <span class="cf">
            {{$t('do you want to help improve {name}?', {name: app.name})}}
        </span>
        <em class="help cf">{{$t('you can always change your decision afterwards in Settings.')}}</em>
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
