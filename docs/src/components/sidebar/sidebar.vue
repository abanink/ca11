<component class="c-sidebar">
    <header class="header">
        <div class="header__logo">
            <router-link to="/">
                <div class="header__title">CA11</div>
                <icon name="logo"/>
            </router-link>
        </div>
        <div class="header__version">{{version.current}}</div>

        <div class="header__description">
            WebRTC Softphone<br/>
            D-Telephone Network<br/>
        </div>
    </header>
    <nav class="navigation">
        <div class="navigation__header"><icon name="user"/><span>CA11 for Users</span></div>

        <router-link
            v-for="(topic, name) in topics.user"
            class="button navigation__button"
            :to="{name: 'view_user_topic', params: {topic_id: topic.name}}"
        ><icon :name="topic.icon"/><span>{{topic.title}}</span></router-link>

        <div class="navigation__header">
            <icon name="developer"/><span>CA11 for Developers</span>
        </div>
        <router-link
            class="button navigation__button"
            :to="{name: 'view_developer_topic', params: {topic_id: topic.name}}"
            v-for="(topic, name) in topics.developer"
        ><icon :name="topic.icon"/><span>{{topic.title}}</span></router-link>
    </nav>
</component>
