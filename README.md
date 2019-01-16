[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![CircleCI](https://circleci.com/gh/garage11/ca11/tree/develop.svg?style=svg)](https://circleci.com/gh/garage11/ca11/tree/develop)

**Learn more**
* [CA11 Documentation](https://docs.ca11.io)
* [CA11 Softphone](https://ca11.io/)


**Install**

    cd projects
    git clone git@github.com:garage11/ca11.git
    cd ca11
    npm i
    gulp develop


# Open WebRTC Softphone
CA11 is an open WebRTC softphone being developed by [Garage11](https://garage11.tech).
It can be described as a hybrid softphone with an aim for maximum reach. It does this
by wiring the ecosystem of VoIP and the web together. CA11 is a suitable client for
modern VoIP backends like Asterisk and Kamailio using the [SIP-WSS](https://tools.ietf.org/html/rfc7118) protocol.

CA11 could be of interest for VoIP-providers, who want to give customers
access to unified communication, without first having to invest heavily in
development, in order to build yet another proprietary softphone solution.
CA11's SIP functionality could also be useful for call centers,
CRM vendors and other companies looking for flexible communication
channels to customers. Feel free to contact [Garage11](mailto:jeroen@garage11.tech)
for more information about CA11's integration options.


# Decentralized Network
*CA11* was started from a deep conviction that communication technology should
enforce privacy, while being uncomplicated, open and free at the same time.
VoIP is an amazing technology with a lot of benefits, but its centralized
nature makes it less scalable than p2p and an unwelcome target for government
regulations and monitoring. The SIP protocol itself is also overcomplicated
for the majority of use-cases that involve realtime communication with WebRTC.

The bread-and-butter of WebRTC - p2p media streams and a simple API
for generating SDP messages - can just as well be handled by a much simpler
signalling mechanism. This is what several startups have done in the past;
pivotting towards single-url p2p conferencing rooms, and limiting WebRTC
signalling logic to their own service. Nowadays, p2p communication on the
web is accessable and ubiquitous, but there is nothing similar yet to a
standardized VoIP network for decentralized calling. The *CA11* softphone
reuses some of the concepts and paradigms from VoIP to design a
decentralized telephony system; *SIG11*. It envisions an open protocol
and decentralized network of signalling nodes, that relay encrypted
messages on behalf of its users, with the purpose to establish p2p
calls and to exchange relayed messages with.


# Development
CA11 is an environment-agnostic ES2017 codebase that applies a simple
but powerful reactive data-oriented design based on [Vue.js](https://vuejs.org/).
This architecture allows CA11 to be developed at a very fast pace while keeping
the code maintainable and easy to adapt. The project is primary targetting desktop
and mobile web. It currently builds as a Chrome WebExtension, a PWA and as an
Electron desktop application. Headless mode in Node.js is implemented partially
for tests. Head over to the [quickstart guide](https://ca11.io/developer/introduction)
to learn more about CA11. Please be aware of the [code of conduct](https://github.com/garage11/ca11/blob/develop/.github/CODE_OF_CONDUCT.md)
and [contributing guide](https://github.com/garage11/ca11/blob/develop/.github/CONTRIBUTING.md) if you're interested in contributing.


