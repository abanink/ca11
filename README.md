[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![CircleCI](https://circleci.com/gh/garage11/ca11/tree/develop.svg?style=shield)](https://circleci.com/gh/garage11/ca11/tree/develop)


<img align="left" src="https://docs.ca11.io/screens/alice-new-session-input.png" height="200">
<img align="left" src="https://docs.ca11.io/screens/alice-dialing-bob.png" height="200">
<img src="https://docs.ca11.io/screens/bob-calling-with-alice.png" height="200">


* [CA11](https://ca11.io/) - Try CA11 PWA
* [CA11 Docs](https://docs.ca11.io) - Learn more


# Free Communication To Everyone
CA11 is an ambitious open-source WebRTC communication project being developed by [Garage11](https://garage11.tech). It is developed from the conviction that communication technology must enforce privacy while remaining enjoyable to use.
CA11 encompasses both a softphone and a decentralized telephony network,
that is an alternative to proprietary WebRTC signalling solutions and centralized
SIP networks. The *SIG11* protocol's main goal is to form a free and open overlay network for e2e encrypted WebRTC signalling and messaging, allowing everyone to communicate freely using secure and scalable p2p WebRTC. CA11's premise of free, privacy-friendly calling targets the internet community as a whole.


# WebRTC & VoIP
Besides p2p WebRTC, CA11 can just as easily connect to modern WebRTC-enabled VoIP networks. CA11 is tested with [Asterisk 16](https://www.asterisk.org/), but works with any WebRTC-enabled VoIP-software that supports the [SIP-over-WSS](https://tools.ietf.org/html/rfc7118) protocol. The CA11 project is designed
to be adaptable to any company brand and its functionality can be extended
through the use of plugins.

VoIP-providers who don't like to reinvent the wheel can use CA11 to provide a customized branded WebRTC softphone to customers, saving heavily on development
costs and time. CA11's SIP integration is also useful for industries like Call centers, CRM vendors, Telehealth professionals and other businesses that rely on
remote work and collaboration. Feel free to contact [Garage11](mailto:info@garage11.tech) for more information.


# Install
CA11 uses a simple, yet powerful, reactive data-oriented design based on [Vue.js](https://vuejs.org/). This allows CA11 to be developed at a very fast pace while keeping code maintainable and flexible to adapt. The CA11 softphone builds as a PWA and as Electron desktop application. It runs partly in Node.js, mainly for unit testing.

    git clone git@github.com:garage11/ca11.git
    cd ca11
    yarn
    gulp develop

Head over to the [quickstart](https://docs.ca11.io/developers/quickstart) to learn more about CA11.
Contributing? Please read the [contributing guide](https://github.com/garage11/ca11/blob/develop/.github/CONTRIBUTING.md).
