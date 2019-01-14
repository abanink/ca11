<component class="c-telemetry t-telemetry">
    <header class="c-wizard__header">{{$t('telemetry')}}</header>

    <div class="c-wizard__description">
        {{$t('automated application error logging helps to improve {name}.', {name: app.name}).ca()}}
        {{$t('do you want to improve {name} by automatically sending application errors to', {name: app.name}).ca()}}
        <a href="https://sentry.io/">Sentry</a>?

        <div class="c-wizard__help">
            {{$t('you can always change your choice afterwards from Settings.')}}
        </div>
    </div>

    <slot name="progress"></slot>

    <div class="buttons is-centered">
        <button class="button t-btn-telemetry-back" @click="stepBack()">
            {{$t('back')}}
        </button>
        <button
            class="button t-btn-telemetry-next-no"
            @click="toggleTelemetry(false)"
        >
            {{$t('not really')}}
        </button>
        <button
            class="button t-btn-telemetry-next-yes"
            @click="toggleTelemetry(true)"
        >
            {{$t('no problem')}}
        </button>
    </div>
</component>
