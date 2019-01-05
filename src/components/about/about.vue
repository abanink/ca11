<section component class="c-about content">

    <header class="content__header header">
         <icon class="header__icon" name="logo"/>
         <div class="header__filters"></div>
         <div class="header__text">{{app.name}} {{app.version.current}}</div>
         <div class="header__actions"></div>
    </header>

    <main class="about main">
        <div class="support">
            <div class="support-option">
                <icon class="support-icon" name="logo"/>
                <div class="support-title cf">{{$t('online help')}}</div>
                <div class="support-description">{{app.name}} {{$t('documentation')}}</div>
                <div class="support-channel link" @click="openTab(vendor.support.website)">{{vendor.name}} website</div>
            </div>

            <div v-if="vendor.support.email" class="support-option">
                <icon class="support-icon" name="mail"/>
                <div class="support-title">E-mail</div>
                <div class="support-description cf">{{$t('drop us your question')}}</div>
                <div class="support-channel"><a :href="'mailto:' + vendor.support.email">{{vendor.support.email}}</a></div>
            </div>

            <div v-if="vendor.support.phone" class="support-option">
                <icon class="support-icon" name="phone"/>
                <div class="support-title cf">{{$t('phone')}}</div>
                <div class="support-description cf">{{$t('give us a call')}}:</div>
                <div class="support-channel link">{{vendor.support.phone}}</div>
            </div>

            <div class="support-option">
                <icon class="support-icon" name="github"/>
                <div class="support-title">Github</div>
                <div class="support-description cf">{{$t('report an issue')}}</div>
                <div class="support-channel link" @click="openTab('https://github.com/garage11/ca11/issues')">Github issues</div>
            </div>
        </div>
    </main>
</section>
