<component class="c-sidebar">
    <header class="header">
        <div class="header-logo">
            <router-link to="/">
                <img src="/img/logo-128.png"/>
            </router-link>
        </div>
        <div class="header-title">CA11</div>
        <div class="header-brand">{{version.current}}</div>
    </header>
    <nav class="navigation">
        <div class="navigation-header">CA11 for Users</div>

        <router-link
            class="navigation-link"
            :to="{name: 'view_user_topic', params: {topic_id: topic.name}}" v-for="(topic, name) in topics.user"
        >{{topic.title}}</router-link>

        <div class="navigation-header">CA11 for Developers</div>
        <router-link class="navigation-link" :to="{name: 'view_developer_topic', params: {topic_id: topic.name}}" v-for="(topic, name) in topics.developer">
            {{topic.title}}
        </router-link>
    </nav>
</component>
