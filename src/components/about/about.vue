<section component class="c-about content">

    <header class="content__header header">
         <icon class="header__icon" name="logo"/>
         <div class="header__filters"></div>
         <div class="header__text">{{app.name}} {{app.version.current}}</div>
         <div class="header__actions"></div>
    </header>

    <main class="about main">
        <div class="support-l">

            <div
                class="support-item"
                @click="openTab(vendor.support.website)"
            >
                <div class="support-item__icon"><icon name="logo"/></div>
                <div class="support-item-l">
                    <div class="support-item__title cf">{{$t('need help?')}}</div>
                    <div class="support-item__description cf">
                        {{$t('the documentation is here to help you make the most out of the {vendor} softphone', {vendor: app.name})}}!
                    </div>
                  </div>
            </div>

            <div
                v-if="vendor.support.email"
                class="support-item"
                @click="openTab('mailto:' + vendor.support.email)"
            >
                <div class="support-item__icon"><icon name="mail"/></div>
                <div class="support-item-l">
                    <div class="support-item__title cf">{{$t('questions?')}}</div>
                    <div class="support-item__description cf">
                        {{$t('feel free to contact us for feedback or questions about {vendor} or related products', {vendor: app.name})}}.
                    </div>
                </div>
            </div>

            <div
                class="support-item"
                @click="openTab('https://github.com/garage11/ca11/')"
            >
                <div class="support-item__icon"><icon name="github"/></div>
                <div class="support-item-l">
                    <div class="support-item__title cf">{{$t('improving {vendor}', {vendor: app.name})}}</div>
                    <div class="support-item__description cf">
                       {{$t('{vendor} is a free and open software project. Star {vendor}, make a feature request or report an issue on Github.', {vendor: app.name})}}
                    </div>
                </div>
            </div>

            <div
                v-if="vendor.support.phone"
                class="support-item"
            >
                <div class="support-item__icon"><icon name="phone"/></div>
                <div class="support-item-l">
                    <div class="support-item__title cf">{{$t('phone')}}</div>
                    <div class="support-item__description cf">{{$t('give us a call')}}:</div>
                    <div class="support-item__channel">{{vendor.support.phone}}</div>
                </div>
            </div>

        </div>
    </main>
</section>
