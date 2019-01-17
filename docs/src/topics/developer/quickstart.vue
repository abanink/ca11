<component class="c-page">
    <h1>Quickstart</h1>
    <p>
        Nice to have you interested in CA11 development! To run CA11,
        you need a recent version of Chrome/Chromium(70+), Node.js(11+),
        npm and GIT. Checkout the code with:
    </p>

<pre v-highlightjs><code class="bash">git clone git@github.com:ca11/ca11.git
cd ca11
npm i
cp ./.ca11rc.example ~/.ca11rc
</code></pre>

    <p>
        CA11 uses the <a href="https://gulpjs.com/">Gulp</a> build system,
        a configuration file(<code>.ca11rc</code>) and runtime flags to
        determine how to build CA11. Type the following to see all options:
<pre v-highlightjs><code class="bash">gulp</code></pre>
    </p>

    <p>
        Creating the default PWA build and launching the development services
        is straightforward:
    </p>

<pre v-highlightjs><code class="bash">gulp develop</code></pre>

    <p>
        Open a Chrome/Chromium browser to <code>http://localhost:3000</code> to
        try CA11 PWA.
    </p>

</component>
