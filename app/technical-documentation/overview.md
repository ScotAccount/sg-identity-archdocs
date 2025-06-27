---
layout: sub-navigation
title: Section 1 - Overview
---
ScotAccount currently provides 2 distinct services: Authentication and
Identity Verification. These are provided to Relying Parties using a
OIDC (Open ID Connect) auth code flow with PKCE

The table below summarises the key points on each flow.

| Capability Provided   | Scope                | GPG Standards   | Description |
|----------------------|----------------------|-----------------|-------------|
| Authentication       | openid               | gpg44 medium    | OIDC authorisation requests must contain the openid scope value to indicate that an application intends to use the OIDC protocol.<br><br>The *ID token* obtained at the end of this flow has a *Sub* field which is a UUID which unique and persistent identifies a user. i.e. every time the same user logs on an id token with the same *Sub* will be produced. |
| Identity Verification| openid<br>gpg-45-medium | gpg45 medium | Before an Identity verification flow can be run an authentication flow MUST have been completed.<br><br>OIDC authorisation requests must contain the openid and the gpg-45-medium scope values to indicate that an application intends to use the OIDC protocol. |