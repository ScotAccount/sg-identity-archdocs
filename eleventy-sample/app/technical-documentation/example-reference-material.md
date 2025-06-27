---
layout: sub-navigation
title: Section 6 - Example Reference Material
---
The information provided below is intended to help your consideration of
the service. To help illustrate how the service works, we have provided
an Example Relying Party application that supports:

-   OIDC + PKCE auth code flow

-   a call to exchange id\_token with access\_token using the /token
    endpoint with a private\_key\_jwt , authentication method

-   a call to Get Verified Data with an access\_token using the
    /attributes/values endpoint with a private\_key\_jwt, authentication
    method

This is not intended to be suitable for a Production Environment

# Certified Library

We recommend the use of a Certified Library, preferably certified by the
OpenID Foundation, a list of them can be found here [Certified
Libraries](https://openid.net/developers/certified/).

We use Connect2id, and you can also then for Libraries , see [Connect2id
Libraries](https://connect2id.com/)

There is also the option or the lower level Nimbus [Nimbus
Libraries](https://connect2id.com/products/nimbus-jose-jwt)

# Example Material

For example purposes and to “get you started”, we have provided a java
spring boot example, see [Example
Code](https://github.com/sg-digital-identity-scotland/sso-oidc-client),
that is hosted on a public github repo.
