<component class="c-telemetry t-telemetry">
    <header class="c-wizard__header">{{$t('quality metrics')}}</header>

    <div class="c-wizard__description">
        {{$t('do you mind if {name} sends any application exceptions to a service for quality metrics? This helps us to responds faster to software issues.', {name: app.name}).ca()}}


        <div class="cf c-wizard__help">
            {{$t('you can always change your choice later from Settings.')}}
            <a class="cf" target="_blank" href="https://sentry.io/">{{$t('about')}} Sentry {{$t('quality metrics')}}</a>.
        </div>
    </div>

    <slot name="progress"></slot>

    <div class="buttons stretched">
        <button class="button button--widget t-btn-telemetry-back" @click="stepBack()">
            {{$t('back')}}
        </button>

        <button
            class="button button--widget t-btn-telemetry-next-no"
            @click="toggleTelemetry(false)"
        >{{$t('deny')}}</button>

        <button
            class="button button--widget t-btn-telemetry-next-yes"
            @click="toggleTelemetry(true)"
        >{{$t('allow')}}</button>

    </div>
</component>
