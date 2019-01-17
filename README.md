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


# WebRTC Softphone
CA11 is an open WebRTC softphone developed by [Garage11](https://garage11.tech).
It could be described as a hybrid softphone with an aim for maximum reach. It's maximizing
reach by wiring the ecosystems of VoIP and Web together. CA11 can be used with
modern WebRTC-compatible VoIP backends like Asterisk and Freeswitch using the
[SIP-WSS](https://tools.ietf.org/html/rfc7118) protocol.

CA11 is of interest to VoIP-providers that would like to integrate WebRTC in their
VoIP stack, without having to invest heavily in development cost for yet another
proprietary WebRTC softphone. CA11 can easily be adapted to a custom brand
and extended with the use of plugins. The CA11 softphone is also useful for
industries like Call centers, CRM vendors, Telehealth professionals and
businesses that rely on remote work and collaboration. Feel free to contact [Garage11](mailto:info@garage11.tech) for more information.


# D-Telephone Network
CA11 is driven by the conviction that communication technology should
enforce privacy, while being simple, open, free and enjoyable to use.
VoIP is an amazing technology with a lot of benefits, but its centralized
media flow makes it costly to scale and a target for government
regulation and monitoring. The SIP protocol itself is also quite
complicated for the majority of WebRTC applications.

The bread-and-butter of WebRTC - p2p media streams and ICE negotation can
just as well be handled by a simple signalling mechanism. *SIG11* is a simple
protocol that features public key encryption between nodes, and a network of
signalling super-nodes that relay encrypted messages between peer candidates.
Peers on the network can call each other by calling the other's public key.
A public key can be bound to a simpler identifier, like a phone number,
but a phone number is assigned by the peer itself. Identity trust is
established by storing the public key on urls that only the trusted
user has access to.

# Development
CA11 is written in an environment-agnostic JavaScript codebase that applies a simple
but powerful reactive data-oriented design based on [Vue.js](https://vuejs.org/).
This architecture allows CA11 to be developed at a very fast pace while keeping
the code maintainable and easy to adapt. The CA11 softphone is primary targetting
desktop and mobile web environments. It currently builds as a Chrome WebExtension,
a PWA and as an Electron desktop application. Headless mode in Node.js is
implemented partially for tests. Head over to the [developer quickstart](https://docs.ca11.io/developers/quickstart)
to learn more about CA11. Please be aware of the [code of conduct](https://github.com/garage11/ca11/blob/develop/.github/CODE_OF_CONDUCT.md)
and [contributing guide](https://github.com/garage11/ca11/blob/develop/.github/CONTRIBUTING.md) if you're interested in contributing.


