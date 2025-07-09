---
layout: sub-navigation
title: Section 5 - How to Test
---
We provide the following features:

-   Manual Testing

-   Automated Testing

-   Sample Clients

# **Manual Testing**

We provide a Demo Relying Party application, that you can manually use
to test:

-   Authentication

-   Identity verification

It can be accessed from the link
<https://oidc-private-client.swan.sign-in.service.gov.scot/integration>

# **Automated Testing - Mock Service**

We provide a Mock Service that can be used to test:

-   Authentication

-   Identity verification

This provides an easy way to test our identity verification capability
without having to supply real information or documentation such as name
/ address / copies of documents such as passport.

It can be accessed from the link
[https://mock-dis.main.swan.sign-in.service.gov.scot](https://mock-dis.main.swan.sign-in.service.gov.scot/)

NOTE: There are a few points to note and differences to remember.

-   Paul Wallis: Can be used for either scope, will pass gpg-45-medium
    identity verification

-   Brian Harle: Can be used for either scope, will fail gpg-45-medium
    verification

-   Value of code\_challenge isn't validated

-   Value of client\_id isn't validated

-   Prompt & nonce are out of scope for the mock and therefore ignored

-   The returned auth code is hardcoded for the 2 people available in
    this mock

-   Value of code\_verifier isn't validated

-   Value of sub & iss (client id) and aud in the JWT aren't validated

-   Value of sub & iss (client id) and aud in the DIS-Client-Assertion
    aren't validated

# **Sample Client**

We have also provided a working sample Relying Party application, that
is the same as the one that you can use for Manual Testing.

It can be accessed from the link:
<https://github.com/sg-digital-identity-scotland/sso-oidc-client/tree/main/sample-client>

NOTE: Our Sample Application is NOT to be used in production or intended
as production grade code.