---
layout: sub-navigation
title: Section 4 - Understand Results
---
## Understanding the response for /token

Example Response

{

"access\_token": "access\_token",

"refresh\_token": "refresh\_token",

"scope": "openid",

"id\_token": "id\_token",

"token\_type": "Bearer",

"expires\_in": 900

}

<u>You can use the following table to understand the ID Token’s
claims.</u>

<table>
<colgroup>
<col style="width: 15%" />
<col style="width: 84%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Claim</strong></th>
<th><strong>Description</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>access_token</td>
<td>Access tokens are used in token-based authentication to allow an
application to access an API.</td>
</tr>
<tr class="even">
<td>refresh_token</td>
<td>A refresh token is a mechanism to receive a new access token when
the old one expires</td>
</tr>
<tr class="odd">
<td>scope</td>
<td>Scope is a mechanism in OAuth 2.0 to limit an application's access
to a user's account</td>
</tr>
<tr class="even">
<td>id_token</td>
<td>ID tokens are used in token-based authentication to cache user
profile information and provide it to a client application</td>
</tr>
<tr class="odd">
<td>token_type</td>
<td>The type of token this is, typically just the string “Bearer”.</td>
</tr>
<tr class="even">
<td>expires_in</td>
<td>The time the token is valid for.</td>
</tr>
</tbody>
</table>

## Understanding the ID Token

A id\_token is return to the user after successful authentication has
happened.

<u>Example Token</u>

<u>Example Token - Decoded by</u> <http://jwt.io>

{

"sub": "4f6893f4-6fbe-423e-a5cc-d3c93e5a7c41",

"aud": "2fs46jov3cm4a",

"iss": "https://authz.swan.sign-in.service.gov.scot",

"exp": 1676775909,

"iat": 1676775009,

"nonce": "203JsNo\_0Ljz0TV\_KfFOAAH6nym\_ZaiQzjodvape\_GM",

"jti": "jJH3wstMbus",

"sid": "Sb8gpnD90hTKxP8fHEdaaQfE7aIHsDBGYv3b8Y1mJrE"

}

NOTE: ScotAccount’s privacy principles prevent us from supplying any
personal information, as part of the Authentication process.

We only provide a UUID as part of the “sub” claim that is immutable and
can be used as a reference point. We do NOT provide e.g. email address
or mobile no as part of the Authentication process.

Once the user has been through Identity Verification, there is an API
/attribute/values to use to receive certain Verified Data.

<u>You can use the following table to understand the ID Token’s
claims.</u>

<table>
<colgroup>
<col style="width: 8%" />
<col style="width: 91%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Claim</strong></th>
<th><strong>Description</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>sub</td>
<td>The subject identifier or the unique ID of a user (UUID).</td>
</tr>
<tr class="even">
<td>aud</td>
<td>The audience, which will be the client_id you were assigned during
onboarding.</td>
</tr>
<tr class="odd">
<td>iss</td>
<td>The ScotAccount OpenID Provider’s Issue identifier as specified in
the <a
href="https://authz.swan.sign-in.service.gov.scot/.well-known/openid-configuration">discovery
endpoint</a>.</td>
</tr>
<tr class="even">
<td>exp</td>
<td>exp means ‘expiration time’. This is the expiration time for this
token, which will be an integer timestamp representing the number of
seconds since the <a href="https://www.epochconverter.com/">Unix
Epoch</a>.</td>
</tr>
<tr class="odd">
<td>iat</td>
<td>iat stands for ‘issued at’. This identifies the time at which
ScotAccount created the JWT. You can use this claim to understand the
age of the JWT.<br />
This will appear as an integer timestamp representing the number of
seconds since the <a href="https://www.epochconverter.com/">Unix
Epoch</a>.</td>
</tr>
<tr class="even">
<td>nonce</td>
<td>The nonce value your application provided when you made the
authorisation request.</td>
</tr>
<tr class="odd">
<td>jti</td>
<td>The "jti" (JWT ID) claim provides a unique identifier for the
JWT</td>
</tr>
<tr class="even">
<td>sid</td>
<td>sid claim is defined in Front-Channel Logout 1.0 is for its use as a
parameter for frontchannel_logout_uri</td>
</tr>
</tbody>
</table>

## Understanding the Access Token

A access\_token is return to the user after they make a call to /token
end point.

<u>Example Access Token</u>

eyJraWQiOiJXZ2lHIiwidHlwIjoiYXQrand0IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiI0ZjY4OTNmNC02ZmJlLTQyM2UtYTVjYy1kM2M5M2U1YTdjNDEiLCJzY3AiOlsib3BlbmlkIl0sImlzcyI6Imh0dHBzOi8vYXV0aHouc3dhbi5zaWduLWluLnNlcnZpY2UuZ292LnNjb3QiLCJleHAiOjE2NzY3NzU5MTAsImlhdCI6MTY3Njc3NTAxMCwianRpIjoicm9UekozM1RGZTgiLCJjaWQiOiIyZnM0NmpvdjNjbTRhIn0.fZtNE4GJRtYopKrHO4-Jau8lrNB5PyS0uz73gNlIH25aik9bNHX59PfNgnPdlgKF\_LZFJmJFk7KytDldx21B1KIjseZwjprVQ0G\_0crQ2rx8zdkig1bewggT-zsDxl0mpK05ERfmxeXdAL-entluGLtqqDmyXVF4C8ortKeWeNVwa0GgkA4mLunE4vQzQtJ\_nBr3\_D8Lq7OBScd-3iloj8tiKoKn0VQRctrUwc5IBfgV7DaPDBdqP1-tez1bzcb5l62ext43AaLwcuWEBlev1rHqqGbedx0Orrq8XMAftjna0Qa0mka\_J2QdVYxbIbIZbTddrjIMgratJcj8dFU3Ww

<u>Example Access Token - Decoded by</u> [jwt.io](http://jwt.io/)

{

"sub": "4f6893f4-6fbe-423e-a5cc-d3c93e5a7c41",

"scp": \[ "openid" \],

"iss": "https://authz.swan.sign-in.service.gov.scot",

"exp": 1676775910,

"iat": 1676775010,

"jti": "roTzJ33TFe8",

"cid": "2fs46jov3cm4a"

}

<u>You can use the following table to understand the access token’s
claims</u>

<table>
<colgroup>
<col style="width: 8%" />
<col style="width: 91%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Claim</strong></th>
<th><strong>Description</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>sub</td>
<td>The subject identifier or the unique ID of a user (UUID).</td>
</tr>
<tr class="even">
<td>scp</td>
<td>Lists the scopes that have been consented for release by our
Attribute Server.</td>
</tr>
<tr class="odd">
<td>iss</td>
<td>The ScotAccount OpenID Provider’s Issue identifier as specified in
the <a
href="https://authz.swan.sign-in.service.gov.scot/.well-known/openid-configuration">discovery
endpoint</a>.</td>
</tr>
<tr class="even">
<td>exp</td>
<td>exp means ‘expiration time’. This is the expiration time for this
token, which will be an integer timestamp representing the number of
seconds since the <a href="https://www.epochconverter.com/">Unix
Epoch</a>.</td>
</tr>
<tr class="odd">
<td>iat</td>
<td>iat stands for ‘issued at’. This identifies the time at which
ScotAccount created the JWT. You can use this claim to understand the
age of the JWT.<br />
This will appear as an integer timestamp representing the number of
seconds since the <a href="https://www.epochconverter.com/">Unix
Epoch</a>.</td>
</tr>
<tr class="even">
<td>jti</td>
<td>jti stands for ‘JWT ID’ and it’s a unique identifier that can
prevent the token being reused.</td>
</tr>
<tr class="odd">
<td>cid</td>
<td>Client identifier of the OIDC client that requested this token, this
will be the Client ID assigned to you during onboarding.</td>
</tr>
</tbody>
</table>

 

## Understanding Results for Get Verified Data

A signed\_jwt is return to the user after they have gone through
successful identity verification , and they have used the
/attribute/value endpoint to receive their data.

<u>Example signed JWT</u>

eyJraWQiOiJkTVZEIiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXJpZmllZF9jbGFpbXMiOnsidmVyaWZpY2F0aW9uIjp7Im91dGNvbWUiOiJmMmNmZTBlMS02ZmJlLTRjYjYtOWU4ZC0xYzFmMTQyN2NjMmEgVkVSSUZJRUQgU1VDQ0VTU0ZVTExZIiwidHJ1c3RfZnJhbWV3b3JrIjoidWtfdGZpZGEiLCJhc3N1cmFuY2VfbGV2ZWwiOiJHUEc0NS1NZWRpdW0iLCJ0aW1lIjoiMjAyMy0wMi0xNVQxNjozOVoiLCJ2ZXJpZmllciI6eyJvcmdhbml6YXRpb24iOiJESVMiLCJ0eG4iOiJhNGRiZTg3Ny1kZjYzLTQ2MDgtOTViMC0zYTdmZTNhNGQ3NTEifX19LCJjbGFpbXMiOnsidXVpZCI6ImYyY2ZlMGUxLTZmYmUtNGNiNi05ZThkLTFjMWYxNDI3Y2MyYSIsImdpdmVuX25hbWUiOiJzYW1wbGVfZ2l2ZW5fbmFtZSIsImZhbWlseV9uYW1lIjoic2FtcGxlX2ZhbWlsaXlfbmFtZSIsImJpcnRoX2RhdGUiOiIxOTkwLTA5LTA4IiwiYWRkcmVzcyI6eyJ1cHJuIjoiOTA2NzAwMDgxNzU5Iiwic3ViQnVpbGRpbmdOYW1lIjoiMC8yIiwiYnVpbGRpbmdOdW1iZXIiOiI5OSIsInN0cmVldE5hbWUiOiJzYW1wbGVfc3RyZWV0X25hbWUiLCJhZGRyZXNzTG9jYWxpdHkiOiJzYW1wbGVfbG9jYWx0aW9uIiwicG9zdGFsQ29kZSI6IlgxMTFYWCJ9fX0=

<u>Example signed JWT - Decode by</u> <http://jwt.io>

{

"verified\_claims": {

"verification": {

"outcome": "f2cfe0e1-6fbe-4cb6-9e8d-1c1f1427cc2a VERIFIED SUCCESSFULLY",

"trust\_framework": "uk\_tfida",

"assurance\_level": "GPG45-Medium",

"time": "2023-02-15T16:39Z",

"verifier": {

"organization": "DIS",

"txn": "a4dbe877-df63-4608-95b0-3a7fe3a4d751"

}

}

},

"claims": {

"uuid": "f2cfe0e1-6fbe-4cb6-9e8d-1c1f1427cc2a",

"given\_name": "sample\_given\_name",

"family\_name": "sample\_familiy\_name",

"birth\_date": "1990-09-08",

"address": {

"uprn": "906700081759",

"subBuildingName": "0/2",

"buildingNumber": "99",

"streetName": "sample\_street\_name",

"addressLocality": "sample\_localtion",

"postalCode": "X111XX"

}

}

}


<u>You can use the following table to understand the signed\_jwt’s
claims</u>

<table>
<colgroup>
<col style="width: 9%" />
<col style="width: 15%" />
<col style="width: 68%" />
<col style="width: 6%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Element</strong></th>
<th><strong> </strong></th>
<th><strong>Description</strong></th>
<th><strong>Max Field Length</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>verification</td>
<td>outcome</td>
<td>String representing an identifier that is assigned to the End-User.
The same as the sub identifier in the id token.</td>
<td> </td>
</tr>
<tr class="even">
<td>verification</td>
<td>trust_framework</td>
<td>The trust framework the IDV check was carried out in accordance
with.</td>
<td> </td>
</tr>
<tr class="odd">
<td>verification</td>
<td>assurance_level</td>
<td>Assurance level attained within the above trust framework.</td>
<td> </td>
</tr>
<tr class="even">
<td>verification</td>
<td>time</td>
<td>Exact time this check was completed.</td>
<td> </td>
</tr>
<tr class="odd">
<td>verification</td>
<td>verifier.organisation</td>
<td>The organisation that has responsibility for the check.</td>
<td> </td>
</tr>
<tr class="even">
<td>verification</td>
<td>verifier.txn</td>
<td>Unique transaction reference number within the above organisation,
relating to this IDV check.</td>
<td> </td>
</tr>
<tr class="odd">
<td>claims</td>
<td>given_name</td>
<td>String representing Given names(s) or first name(s) of the End-user
- also includes middle name(s). People can have multiple given names,
all can be present, with the names being separated by space
characters.</td>
<td>100</td>
</tr>
<tr class="even">
<td>claims</td>
<td>family_name</td>
<td>String representing Surname(s) or last names(s) of the End-user.
People can have multiple family names, all can be present, with the
names being separated by space characters.</td>
<td>40</td>
</tr>
<tr class="odd">
<td>claims</td>
<td>birthdate</td>
<td>Represented as an <a
href="https://openid.net/specs/openid-connect-core-1_0.html">ISO
8601:2004</a> [ISO8601‑2004] YYYY-MM-DD format</td>
<td>10</td>
</tr>
<tr class="even">
<td>claims</td>
<td>address</td>
<td><p>JSON object - Address lines concatenated and comma delimited:</p>
<p>Uprn Up to 12 digits. String containing only digits.</p>
<p>organisationName Max 60 characters</p>
<p>departmentName Max 30 characters</p>
<p>subBuildingName Max 30 characters</p>
<p>buildingNumber  integer</p>
<p>buildingName Max 50 characters</p>
<p>dependentStreetName Max 60 characters</p>
<p>streetName Max 60 characters</p>
<p>doubleDependentAddressLocality Max 35 characters</p>
<p>dependentAddressLocality Max 35 characters</p>
<p>addressLocality Max 30 characters</p>
<p>postalCode Max 7 characters</p>
<p>Fields are specified based on <a
href="https://www.postcodeaddressfile.co.uk/products/postcode_address_file_paf/paf_file_structure-layout.htm">https://www.postcodeaddressfile.co.uk/products/postcode_address_file_paf/paf_file_structure-layout.htm</a></p></td>
<td><p> </p>
<p> </p>
<p> </p>
<p> </p></td>
</tr>
</tbody>
</table>

The address provided in the Successful Outcome :

This address is validated by taking the claimed name, date of birth and
address and matching these claims against credit bureau records. These
records include, voters role data, credit records, fraud markers and
other data sources. This provides appropriate confidence, along with the
other document and selfie checks that this is a valid identity to GPG45
medium. However, the address provided to the relying party is not
*guaranteed* to be current as the various records can take time to
update. It is up to the relying party to understand the level of
confidence in the address and make risk based decisions in the use of
the address data in their processes.

### Unsuccessful Outcomes

Where a user could not be verified to the required assurance level, this
will be communicated to you in the JWT response as illustrated below in
the outcome element:

{

"verified\_claims":{

"verification":{

"outcome" : "\[UUID\] NOT VERIFIED",

"trust\_framework":"uk\_tfida",

"assurance\_level":"GPG45-MEDIUM",

"time":"2018-12-10T13:45:00.000Z",

"verifier":{

"organization":"DIS",

"txn":"a7bf64c2-f22c-11ec-b939-0242ac120002"

}

}

}

}