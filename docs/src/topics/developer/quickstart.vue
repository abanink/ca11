<component class="c-page">
    <h1>Quickstart</h1>
    <p>
        To get started, you need a recent version of Chrome(70+) and Node.js (11+).
        CA11 uses the <a href="https://gulpjs.com/">Gulp</a> build system,
        a configuration file(<code>.ca11rc</code>) and runtime flags to
        determine how to build CA11. There are several configuration options
        that can be used to customize the build. Creating a default build is
        quite straightforward:
    </p>

<pre v-highlightjs><code class="bash">git clone git@github.com:ca11/ca11.git
cd ca11
npm i
cp ./.ca11rc.example ~/.ca11rc
gulp develop
</code></pre>

    <p>
        Open a Chrome/Chromium browser to <code>http://localhost:3000</code> and
        you'll see a running CA11 instance.
    </p>

</component>
