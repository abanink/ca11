<component class="component-wizard-telemetry">
    <header class="ca">{{$t('telemetry')}}</header>

    <div class="step-description">
        <span class="cf">
            {{$t('by automatically tracking errors that might occur in {name}, you\'re directly contributing to {name}\'s quality and stability.', {name: app.name})}}
        </span>
        <span class="cf">
            {{$t('do you want to help?')}}
        </span>
        <em class="help cf">{{$t('you can always change your decision afterwards from the privacy settings.')}}</em>
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
