---
layout: sub-navigation
title: Section 1 - Overview
---
ScotAccount currently provides 2 distinct services: Authentication and
Identity Verification. These are provided to Relying Parties using a
OIDC (Open ID Connect) auth code flow with PKCE

The table below summarises the key points on each flow.

<table>
<colgroup>
<col style="width: 18%" />
<col style="width: 11%" />
<col style="width: 14%" />
<col style="width: 55%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Capability Provided</strong></th>
<th><strong>Scope</strong></th>
<th><strong>GPG Standards</strong></th>
<th><strong>Description</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>Authentication</td>
<td>openid</td>
<td>gpg44 medium</td>
<td><p>OIDC authorisation requests must contain the openid scope value
to indicate that an application intends to use the OIDC protocol.</p>
<p>The <em>ID token</em> obtained at the end of this flow has a
<em>Sub</em> field which is a UUID which unique and persistent
identifies a user. i..e every time the same user logs on an id token
with the same <em>Sub</em> will be produced.</p></td>
</tr>
<tr class="even">
<td>Identity Verification</td>
<td><p>openid</p>
<p>gpg-45-medium</p></td>
<td>gpg45 medium</td>
<td><p>Before an Identity verification flow can be run an authentication
flow MUST have been completed.</p>
<p>OIDC authorisation requests must contain the openid and the
gpg-45-medium scope values to indicate that an application intends to
use the OIDC protocol.</p></td>
</tr>
</tbody>
</table>