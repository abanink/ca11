<component class="c-telemetry t-telemetry">
    <header class="c-wizard__header">{{$t('telemetry')}}</header>

    <div class="c-wizard__description">
        <span class="cf">
            <a href="https://sentry.io/">Sentry</a>
            {{$t('automated application error tracking helps us to improve {name}. Do you want to support {name} by allowing errors to be logged automatically to Sentry?', {name: app.name})}}
        </span>
        <div class="c-wizard__help cf">{{$t('you can always change your choice afterwards from Settings.')}}</div>
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
            {{$t('no')}}
        </button>
        <button
            class="button t-btn-telemetry-next-yes"
            @click="toggleTelemetry(true)"
        >
            {{$t('yes')}}
        </button>
    </div>
</component>
