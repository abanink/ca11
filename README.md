[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![CircleCI](https://circleci.com/gh/garage11/ca11/tree/develop.svg?style=svg)](https://circleci.com/gh/garage11/ca11/tree/develop)


**Resources**
* [CA11 PWA](https://ca11.io/)
* [CA11 Documentation](https://docs.ca11.io)


**Install**

    cd projects
    git clone git@github.com:garage11/ca11.git
    cd ca11
    npm i
    gulp develop


# WebRTC Phone
CA11 is a free WebRTC softphone that enables people to receive and make
peer-to-peer calls, video calls and screen sharing sessions. CA11 is being developed by [Garage11](https://garage11.tech), and could be described as a hybrid softphone with an aim for maximum reach. This is done by wiring the ecosystems of VoIP and
WebRTC together; combining the best of both worlds. CA11 can be used with modern WebRTC-compatible PBX software like Asterisk and Freeswitch over the [SIP-WSS](https://tools.ietf.org/html/rfc7118) protocol.

CA11 is interesting for VoIP-providers that like to integrate WebRTC in their
VoIP stack, without having to invest heavily in development costs to build yet
another proprietary WebRTC softphone solution. CA11 can easily be adapted to a
custom brand and extended through the use of plugins. CA11's premise of free,
privacy-friendly calling targets the internet community as a whole, but could
also be an interesting solution for industries like Call centers, CRM vendors, Telehealth professionals and other businesses that rely on remote work and collaboration. Feel free to contact [Garage11](mailto:info@garage11.tech)
for more information.


# Decentralized Network
CA11 is developed from the conviction that communication technology should
enforce privacy, while remaining simple, open, free and enjoyable to use.
VoIP is an amazing technology with a lot of benefits, but its centralized
media flow makes it costly to scale and a target for government regulation
and monitoring. The SIP protocol itself is also quite complicated for the
majority of WebRTC applications.

The essence of WebRTC, P2P media streams and ICE negotation, can
better be handled by a simpler signalling mechanism. *SIG11* is
an overlay network with public key encryption between nodes. Peers
on the network call each other by their public key. Because a
public key is hard to remember, a public key can be also be linked
to a simpler identifier, like a phone number. There is no central
authority that assigns these numbers. Instead, a peer assigns its
own number. Identity trust is established by a peer showing that its
public key is stored on domains that are known to be controlled by
the expected user.

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


