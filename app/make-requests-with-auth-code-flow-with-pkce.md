---
layout: sub-navigation
title: Section 3 - Make Requests with Auth Code Flow with PKCE
---
# Authentication Flow

The sequence diagram below shows the authentication flow and the
following sections of text explain each step.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><img src="media/image1.png"
style="width:4.875in;height:2.3125in" /></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## Step 1 - Browse to Relying Party’s application

The end user browses to the Relying Parties web application.

## Step 2 - Well Known Endpoint

A well known endpoint is part of the OIDC protocol and is used as a
reference point for configuration information to make sure that both the
RP and OP can change information dynamically at runtime.

DIS recommends that the relying party calls the Discovery Endpoint prior
commencing each OIDC flow. This will ensure any configuration changes
are dynamically applied.

NOTE:
<https://authz.swan.sign-in.service.gov.scot/.well-known/openid-configuration>
is for use with our integration environment.

## Step 3 - JWKS\_URI

The jwks\_uri endpoint provides an interface to see our public key,
which we use for signing of JWt’s.

It contains the following information \[ “kty” , “e” , “use” , “kid” ,
“n” \]

Keys will be rotated periodically, and the current and old keys will be
kept available. The most resent key will always be the first one
available in the json structure.

<table>
<colgroup>
<col style="width: 8%" />
<col style="width: 91%" />
</colgroup>
<thead>
<tr class="header">
<th>Day 1</th>
<th>{"keys":[{"kty":"RSA","e":"AQAB","use":"sig","kid":"WgiG","n":"123"}]}</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>Day 2</td>
<td>{"keys":[<br />
{"kty":"RSA","e":"AQAB","use":"sig","kid":"XsXX","n":"456"},<br />
{"kty":"RSA","e":"AQAB","use":"sig","kid":"WgiG","n":"123"}]}</td>
</tr>
<tr class="even">
<td>Day 3</td>
<td><p>{"keys":[</p>
<p>{"kty":"RSA","e":"AQAB","use":"sig","kid":"ZZ12","n":"789"},<br />
{"kty":"RSA","e":"AQAB","use":"sig","kid":"XsXX","n":"456"},<br />
{"kty":"RSA","e":"AQAB","use":"sig","kid":"WgiG","n":"123"}]}</p></td>
</tr>
</tbody>
</table>

DIS recommends that the relying party calls the JWKS prior commencing
each OIDC flow. This will ensure the latest DIS public key is available
to the relying party. DIS routinely and automatically rotates signing
keys.

NOTE: <https://authz.swan.sign-in.service.gov.scot/jwks.json> is for use
with our integration environment.

## Step 4 - Make a Request for Authorisation

To make an [authorisation
request](https://openid.net/specs/openid-connect-core-1_0.html#CodeFlowAuth),
your application should first send the user to the authorisation URL. To
send the user to the authorisation end point.

An example of the command is detailed below.

<u>Request</u>

GET https://authz.swan.sign-in.service.gov.scot/authorize?

client\_id="YOUR\_CLIENT\_ID"

&redirect\_uri="YOUR\_REDIRECT\_URI"

&response\_type=code

&scope=openid

&code\_challenge\_method=S256

&code\_challenge="YOUR\_CODE\_CHALLENGE"

&state="YOUR\_STATE"

&nonce="YOUR\_NONCE"

Our Authorisation flow is valid for 7 days. This means you will need to
persist the &state parameter for up to 7 days.

### <u>Parameters - Request for Authorisation</u>

Replace the placeholder values or “YOUR\_\*” from the above request with
your specifics and follow the guidance provided.

<table>
<colgroup>
<col style="width: 26%" />
<col style="width: 11%" />
<col style="width: 62%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Parameter</strong></th>
<th><strong>Type</strong></th>
<th><strong>Description</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>client_id</td>
<td>Required</td>
<td>You will have been be issued your client_ID during onboarding with
ScotAccount.</td>
</tr>
<tr class="even">
<td>redirect_uri</td>
<td>Required</td>
<td>You’ll have specified one or moreredirect_uri during onboarding with
ScotAccount.<br />
The redirect URI parameter must exactly match one of the redirect URIs
you specified, except that it must be URL-encoded.</td>
</tr>
<tr class="odd">
<td>response_type</td>
<td>Required</td>
<td>You must set this value to be code: response_type=code.</td>
</tr>
<tr class="even">
<td>scope</td>
<td>Required</td>
<td>openid</td>
</tr>
<tr class="odd">
<td>code_challenge_method</td>
<td>Required</td>
<td>This value indicates which encryption algorithm has been used to
generate the code_challenge. ScotAccount only support <a
href="https://datatracker.ietf.org/doc/html/rfc7636#section-4.2">SHA-256</a>
therefore this value <strong>must</strong> be set to S256.</td>
</tr>
<tr class="even">
<td>code_challenge</td>
<td>Required</td>
<td><p>We mandate the use of <a
href="https://datatracker.ietf.org/doc/html/rfc7636#section-4.1">Proof
Key for Code Exchange (PKCE)</a> and this parameter is your
code_challenge that is generated from your code_verifier by your OIDC
client library.</p>
<p>OAuth have a very good explanation of the PKCE protocol <a
href="https://www.oauth.com/oauth2-servers/pkce/">here on their
website</a>.</p></td>
</tr>
<tr class="odd">
<td>state</td>
<td>Required</td>
<td>When you receive a response at the redirect URL, there must be a way
to verify the response came for a request which you sent. The state
value solves this issue by binding the request and response, which
reduces impact of <a
href="https://owasp.org/www-community/attacks/csrf">Cross Site Request
Forgery</a> attacks.<br />
This value will be returned to the client in the authentication
response. As DIS allows OIDC flows to last up to 7 days</td>
</tr>
<tr class="even">
<td>nonce</td>
<td>Required</td>
<td>A unique value generated by your application that is used to verify
the integrity of the id_token and mitigate replay attacks</td>
</tr>
</tbody>
</table>

#### <u>Response - Request for Authorisation</u>

HTTP/1.1 302 Found

Location: https://YOUR\_REDIRECT\_URI?code=YOUR\_CODE&state=xyzABC123

#### <u>Errors - Request for Authorisation</u>

To understand more about what the error is, you can look in the
response. Depending on the type of error you receive, the response may
contain an error and an error\_description which will provide you with
information.

If the token request is invalid or unauthorised, you’ll receive an error
response with the Content-Type of application/json, for example:

HTTP/1.1 400 Bad Request

Content-Type: application/json

{

"error": "invalid\_request"

"error\_description": "invalid scope"

}

The table below has information on the error types you may encounter.

<table>
<colgroup>
<col style="width: 10%" />
<col style="width: 34%" />
<col style="width: 55%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Http Status</strong></th>
<th><strong>Error_code</strong></th>
<th><strong>Error_Description</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>302</td>
<td>invalid_request</td>
<td>Invalid Request: Missing state parameter</td>
</tr>
<tr class="even">
<td rowspan="9"><p> </p>
<p> </p>
<p> </p>
<p> </p>
<p> </p>
<p> </p>
<p>400</p></td>
<td rowspan="6"><p> </p>
<p>invalid_request</p></td>
<td>Invalid Request: Missing client_id parameter</td>
</tr>
<tr class="odd">
<td>Invalid Request: Invalid client_ID</td>
</tr>
<tr class="even">
<td>Invalid Request: Missing redirect_uri parameter</td>
</tr>
<tr class="odd">
<td>Invalid Request: The redirect_uri for client iy7tmce7lveq2 is not
registered</td>
</tr>
<tr class="even">
<td>Invalid Request: Missing response_type parameter</td>
</tr>
<tr class="odd">
<td>Invalid Request: The redirect_uri for client XXX is not
registered</td>
</tr>
<tr class="even">
<td> unsupported_response_type</td>
<td>Unsupported response type: Unsupported response_type parameter</td>
</tr>
<tr class="odd">
<td>invalid_scope</td>
<td>Invalid scope: missing scope openid</td>
</tr>
<tr class="even">
<td>invalid_claims</td>
<td>Invalid claims: email, profile</td>
</tr>
<tr class="odd">
<td>401</td>
<td>access_denied</td>
<td>Access_denied: Token not valid</td>
</tr>
<tr class="even">
<td>402</td>
<td>N/A</td>
<td>N/A</td>
</tr>
<tr class="odd">
<td></td>
<td>invalid_session_id</td>
<td>Not found: Invalid SID or expired session</td>
</tr>
<tr class="even">
<td>403</td>
<td>access_denied</td>
<td> Access_denied: Token not valid</td>
</tr>
<tr class="odd">
<td>404</td>
<td>not_found</td>
<td> Not Found: Page not found</td>
</tr>
<tr class="even">
<td>500</td>
<td>internal_server_error</td>
<td> </td>
</tr>
<tr class="odd">
<td>501</td>
<td>N/A</td>
<td>N/A</td>
</tr>
<tr class="even">
<td>502</td>
<td>bad_gateway</td>
<td>bad_gateway</td>
</tr>
<tr class="odd">
<td>503</td>
<td>internal_server_error</td>
<td>internal_server_error : Internl Error. Please Retry</td>
</tr>
</tbody>
</table>

## Step 5 - Redirect

The Relying Parties web application issues a 302 http redirect with the
necessary authorisation request and parameters needed.

## Step 6 - Authentication Request

The User Agent executes the request from Step 3.

## Step 7 - User Authentication

The OP provides a series of UI/UX screens for authentication to happen

## Step 8 - If Authn

Once Authentication has happened, the code\_challenge parameter in the
authorisation request (PKCE) is stored, and validated again by the token
end point.

This is a security feature.

## Step 9 - Redirect with REDIRECT\_URI

The Relying Parties web application issues a http redirect using the
REDIRECT\_URI , this is defined as part of the onboarding process in
“Stage-2 - Technical - Setup and Configuration - RP integration”.

This is part of the callback mechanism used after successful
authentication in the OIDC Flow.

## Step 10 - Send auth\_code to RP

A auth\_code is generation after a successful OIDC Flow and returned
back to the End User.

## Step 11 - Make a Request for Token

To make a request to the token endpoint, the relying party’s application
needs to exchange your authorisation code for tokens, you’ll need to
make a POST request to the /token endpoint using the private\_key\_jwt
client assertion authentication method.

## <u>Request - Request for Token</u>

POST https:\\\\authz.swan.sign-in.service.gov.scot\\token

{

"client\_assertion\_type": "YOUR\_CLIENT\_ASSERTION\_TYPE",

"code": "YOUR\_CODE",

"grant\_type": "authorization\_code",

"redirect\_uri": "YOUR\_REDIRECT\_URI",

"client\_assertion": "YOUR\_CLIENT\_ASSERTION",

"code\_verifier": "YOUR\_CODE\_VERIFIER"

}

Our access\_token is valid for 4 hrs

## <u>Parameters - Request for Token</u>

Please replace “YOUR\_\*”, from the above request, with the specific
Relying Party information, following the advice/information provided
below.

<table>
<colgroup>
<col style="width: 23%" />
<col style="width: 11%" />
<col style="width: 65%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Parameter</strong></th>
<th><strong>Type</strong></th>
<th><strong>Description</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>client_assertion_type</td>
<td>Required</td>
<td>Format -
"urn:ietf:params:oauth:client-assertion-type:jwt-bearer"</td>
</tr>
<tr class="even">
<td>code</td>
<td>Required</td>
<td>This information is provided in the previous step</td>
</tr>
<tr class="odd">
<td>grant_type</td>
<td>Required</td>
<td>Format - "authorization_code"</td>
</tr>
<tr class="even">
<td>redirect_uri</td>
<td>Required</td>
<td>You’ll have specified one or moreredirect_uri during onboarding to
ScotAccount.<br />
The redirect URI parameter must exactly match one of the redirect URIs
you specified, except that it must be URL-encoded.</td>
</tr>
<tr class="odd">
<td>client_assertion</td>
<td>Required</td>
<td>This is your public key in a jwt format.</td>
</tr>
<tr class="even">
<td>code_verifier</td>
<td>Required</td>
<td><p>As part of the PKCE process, the OP will return a "code_verifier"
, as part of the authorization process, that will need to be stored, and
sent back to the /token endpoint.</p>
<p>This is a security feature to stop MITM - Man in the Middle
Attacks.</p></td>
</tr>
</tbody>
</table>

## <u>Response where scope is openid</u>

{

"access\_token":
"eyJraWQiOiJXZ2lHIiwidHlwIjoiYXQrand0IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiI0ZjY4OTNmNC02ZmJlLTQyM2UtYTVjYy1kM2M5M2U1YTdjNDEiLCJzY3AiOlsib3BlbmlkIl0sImlzcyI6Imh0dHBzOi8vYXV0aHouc3dhbi5zaWduLWluLnNlcnZpY2UuZ292LnNjb3QiLCJleHAiOjE2Nzg5MzI2NjIsImlhdCI6MTY3ODkzMTc2MiwianRpIjoiekY4Q1VQRC10ZVkiLCJjaWQiOiI1eWh5Z2tzY3R3cHFnIn0.LiE0ocHRkXNINwwxol4XrKqYMuafZ2-gSP1S2huPam-anV9uxMxvbm7W6pvWe8n2mOUsxFDQVNgVP8OuoFuMj-nhWvm5ZornnACmHS1g0MkECOabQmnYrmqcWJesYvrlMRccrie20ZM34\_wALQYL2xgtKNBBaUaD6rTmjiKU3TGgX2q7b71A72YqA9stxQjBocjjWcJuXHrbt\_qmyuiS2SVniRvmOXnukpiGPLIBZshJGm3SpZiAknfrlo7EQCQUru9NHuj9DYf1wxoRYzZh8nYLXvAm7lzxkVvH1AhhHoj2TAF6YXvMOZPRC7PSrc9hOxYz3xJkOZnQmfyucyh8-Q",

"refresh\_token":
"eyJlbmMiOiJBMTI4Q0JDLUhTMjU2IiwiYWxnIjoiZGlyIn0..vnC6Aa6eIzxwHxP1eIk2rA.4or8EM0wJZfj0-w3YfjK-pz97Iysa57njT7UDuGJKa3TkFxgs1sCws9zWfYjuEK7KU\_j8spLc50ngaSGQaqq23z2T-suL-B0JC949Exl\_-48zPEBiQCqsBEKo338973xMm7\_Arvp86aQQDQ7i5KTSd05vXqA7YCW7WCEgIG1k93JPsY0pp70NSBqPP-wpCu914yPkXTvQlte5TbyoVpH89mafQg4oyfvzQT2NBtMOC\_LoeOImSOKuD0dLCNmgrsXn5CrcXLfquk8bTR283G2qE9AguphWGjm3hWIqVhXuCgZo7AsBkPxbsnt0oIQ7UuD3ZH\_n7qRagiC9rOuBdYgmNaYfAYRtpEujVXB8GnwMniSgn0iyB8-tf-x3Gs8ihQe8x-dwOXwMMrXXrM11Wnevh2ZOr8TQoh4f\_JHXmy7OdvcqaRTa2JzEre9gy1vSevkK6lPbCV1IeD1oIPkJk3A7FKNrWlVS5w0uJa1KaItVrQtrFrhgMHwGIqkVcWNQ-ZEnvRCRqoFzt812m6jUHchpxlFHFiiQ58kfIl6UyH9\_vc8pSONMxQbgoBJftLKR0JqxHU3pTpmIjPupLxMl3YMDIdLGPmemK8pmPbHB9zvCq4eR7HiiYsb5JweBxOUaPlNCdkjj1MT30q56tldEoila\_mk5V75Dj3U5EhqpRlyFYTLSzPHRjBnjlrGTb8FqZ6zSNC8JZ\_U4q2LWkJge4RT2riOIC1yLmfy2K1NflNKi99P5CGzuzmavX3Yv9usqK\_3CKnTPOAbtIR9lJO4eBz6uxsaB7JTp\_ASxhG96OIkuupph4OvLuPVX8vX6f0i05Ay5Xa0b2-7WBR-i9m7VjUoFUCH4m2HwSzp30oOmQw\_n0nT7tM\_1\_mXDd95StbKavkb9Yjdzg6BVA5Ux9eKU-WrF05rB9YLT5u1E4M3cNA7XCpvR935O1Hty-Z7\_U58MGG2SPYKlquTjtHPV4v7Kb3M\_Astr8OzDiR3Rw4q59Xd8Ak.Y4pYS8iU7Jft6ay6yywpig",

"scope": "openid",

"id\_token":
"eyJraWQiOiJXZ2lHIiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiI0ZjY4OTNmNC02ZmJlLTQyM2UtYTVjYy1kM2M5M2U1YTdjNDEiLCJhdWQiOiI1eWh5Z2tzY3R3cHFnIiwiaXNzIjoiaHR0cHM6Ly9hdXRoei5zd2FuLnNpZ24taW4uc2VydmljZS5nb3Yuc2NvdCIsImV4cCI6MTY3ODkzMjY2MiwiaWF0IjoxNjc4OTMxNzYyLCJub25jZSI6IkJkSExEV1BSbVk4V0JZTjZCRXRGZkkyUlZvSm15Q1JwcEdGSXQyaEd5N0EiLCJqdGkiOiJmUF9XXzJ3NjVpVSIsInNpZCI6Inl4WjJWcE9ueWRWMENUOGoxU2JsZnp0UllEcmtxLVNKM09IN2VqRjdHUWcifQ.db79iKccqKkXF4MF2IThOV05AZHrlvmNZWAW5ojUzyQoKzHSlPtCEeC3sqwsah84gHMqU0A9ACWPbE8SECdpzOvL6QVCfoWjwuiMEzMsOZvCHccMEpeNX8rbB7\_L5Mo5lLOpVl80jIezKNQJ8NMQoOgMGaBm5qkgLTVFuYqVnvpzAEb44xDeSYe7\_\_jaXOUBiGIWMqopeqJRmR1cy5yJ9ShqDa\_xoBVmAxXXXv0ZOanE7E7-LCBApdvFNRA-JUUrjMIYUNn8cSkupye6bjLElLT\_qPKJc6N0mSOhH43oU5GB-heMhNX18p-07J5pFFAHotcP6VsA2mE7y96gLQ1XrA",

"token\_type": "Bearer",

"expires\_in": 900

}

## <u>Errors - Request for Token</u>

To understand more about what the error is, you can look in the
response. Depending on the type of error you receive, the response may
contain an error and an error\_description which will provide you with
information.

If the token request is invalid or unauthorised, you’ll receive an error
response with the Content-Type of application/json, for example:

HTTP/1.1 501 Bad Request

Content-Type: application/json

{

"error": "internal\_server\_error"

"error\_description": "Technical Error"

}

The table below has information on the error types you may encounter.

<table>
<colgroup>
<col style="width: 5%" />
<col style="width: 28%" />
<col style="width: 65%" />
</colgroup>
<thead>
<tr class="header">
<th>401</th>
<th>access_denied</th>
<th>Access_denied: Token not valid</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>402</td>
<td>N/A</td>
<td>N/A</td>
</tr>
<tr class="even">
<td></td>
<td>invalid_session_id</td>
<td>Not found: Invalid SID or expired session</td>
</tr>
<tr class="odd">
<td>403</td>
<td>access_denied</td>
<td> Access_denied: Token not valid</td>
</tr>
<tr class="even">
<td>404</td>
<td>not_found</td>
<td> Not Found: Page not found</td>
</tr>
<tr class="odd">
<td>500</td>
<td>internal_server_error</td>
<td> </td>
</tr>
<tr class="even">
<td>501</td>
<td>N/A</td>
<td>N/A</td>
</tr>
<tr class="odd">
<td>502</td>
<td>bad_gateway</td>
<td>bad_gateway</td>
</tr>
<tr class="even">
<td>503</td>
<td>internal_server_error</td>
<td>internal_server_error : Internl Error. Please Retry</td>
</tr>
</tbody>
</table>

 

## Step 12 - Verifies auth\_code and code\_challenger

The token end point verifies that the auth\_code and code\_challenge are
valid

## Step 13 - Returns Token

The token end point returns the following information:

-   id\_token

-   access\_token

-   refresh\_token

## Step 14 - Extract “sub” in ID\_Token

The “sub” field can be extracted from the id\_token, this is a immutable
GUID that is associated with the end user and never changes.

DIS recommends that the relying party verify the signatures of the
tokens received using the latest configuration from the Discovery End
Point and the JWKS End Point.

The “sub” field can be used by the Relaying Parties application as a
primary/secondary key to identity the end user.

 

# IDV Flow

The sequence diagram below shows the identity flow and the following
sections of text explain each step.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><img src="media/image2.png"
style="width:4.875in;height:2.77083in" /></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

### Step 1 - Browse

The end user browses to the Relying Parties web application.

### Step 2 - User decides to go through Identity Verification

The end user decides to go through the Identity Verification Process.

### Step 3 - Well Known Endpoint

A well known endpoint is part of the OIDC protocol and is used as a
reference point for configuration information to make sure that both the
RP and OP can change information dynamically at runtime.

DIS recommends that the relying party calls the Discovery Endpoint prior
commencing each OIDC flow. This will ensure any configuration changes
are dynamically applied.

NOTE:
<https://authz.swan.sign-in.service.gov.scot/.well-known/openid-configuration>
is for use with our integration environment.

### Step 4 - JWKS\_URI

The jwks\_uri endpoint provides an interface to see our public key,
which we use for signing of JWt’s.

It contains the following information \[ “kty” , “e” , “use” , “kid” ,
“n” \]

Keys will be rotated periodically, and the current and old keys will be
kept available. The most resent key will always be the first one
available in the json structure.

<table>
<colgroup>
<col style="width: 8%" />
<col style="width: 91%" />
</colgroup>
<thead>
<tr class="header">
<th>Day 1</th>
<th>{"keys":[{"kty":"RSA","e":"AQAB","use":"sig","kid":"WgiG","n":"123"}]}</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>Day 2</td>
<td>{"keys":[<br />
{"kty":"RSA","e":"AQAB","use":"sig","kid":"XsXX","n":"456"},<br />
{"kty":"RSA","e":"AQAB","use":"sig","kid":"WgiG","n":"123"}]}</td>
</tr>
<tr class="even">
<td>Day 3</td>
<td><p>{"keys":[</p>
<p>{"kty":"RSA","e":"AQAB","use":"sig","kid":"ZZ12","n":"789"},<br />
{"kty":"RSA","e":"AQAB","use":"sig","kid":"XsXX","n":"456"},<br />
{"kty":"RSA","e":"AQAB","use":"sig","kid":"WgiG","n":"123"}]}</p></td>
</tr>
</tbody>
</table>

DIS recommends that the relying party calls the JWKS prior commencing
each OIDC flow. This will ensure the latest DIS public key is available
to the relying party. DIS routinely and automatically rotates signing
keys.

NOTE: <https://authz.swan.sign-in.service.gov.scot/jwks.json> is for use
with our integration environment.

### Step 5 - Make a Request for Authorisation

To make an [authorisation
request](https://openid.net/specs/openid-connect-core-1_0.html#CodeFlowAuth),
your application should first send the user to the authorisation URL. To
send the user to the authorisation URL, run this command below to make a
GET request, and follow the guidance in the following table to

<u>Request</u>

GET https://authz.swan.sign-in.service.gov.scot/authorize?

client\_id="YOUR\_CLIENT\_ID"

&redirect\_uri="YOUR\_REDIRECT\_URI"

&response\_type=code

&scope=openid&gpg-45-medium

&code\_challenge\_method=S256

&code\_challenge="YOUR\_CODE\_CHALLENGE"

&state="YOUR\_STATE"

&nonce="YOUR\_NONCE"

Our Authorisation flow is valid for 7 days.

#### <u>Parameters - Request for Authorisation</u>

Replace the placeholder values or “YOUR\_\*” from the above request with
the Relying Party specifics and follow the guidance provided.

<table>
<colgroup>
<col style="width: 26%" />
<col style="width: 11%" />
<col style="width: 62%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Parameter</strong></th>
<th><strong>Type</strong></th>
<th><strong>Description</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>client_id</td>
<td>Required</td>
<td>You will have been be issued your client_ID during onboarding with
ScotAccount.</td>
</tr>
<tr class="even">
<td>redirect_uri</td>
<td>Required</td>
<td>You’ll have specified one or moreredirect_uri during onboarding with
ScotAccount.<br />
The redirect URI parameter must exactly match one of the redirect URIs
you specified, except that it must be URL-encoded.</td>
</tr>
<tr class="odd">
<td>response_type</td>
<td>Required</td>
<td>You must set this value to be code: response_type=code.</td>
</tr>
<tr class="even">
<td>scope</td>
<td>Required</td>
<td>openid &amp; gpg-45-medium</td>
</tr>
<tr class="odd">
<td>code_challenge_method</td>
<td>Required</td>
<td>This value indicates which encryption algorithm has been used to
generate the code_challenge. ScotAccount only support <a
href="https://datatracker.ietf.org/doc/html/rfc7636#section-4.2">SHA-256</a>
therefore this value <strong>must</strong> be set to S256.</td>
</tr>
<tr class="even">
<td>code_challenge</td>
<td>Required</td>
<td><p>We mandate the use of <a
href="https://datatracker.ietf.org/doc/html/rfc7636#section-4.1">Proof
Key for Code Exchange (PKCE)</a> and this parameter is your
code_challenge that is generated from your code_verifier by your OIDC
client library.</p>
<p>OAuth have a very good explanation of the PKCE protocol <a
href="https://www.oauth.com/oauth2-servers/pkce/">here on their
website</a>.</p></td>
</tr>
<tr class="odd">
<td>state</td>
<td>Required</td>
<td>When you receive a response at the redirect URL, there must be a way
to verify the response came for a request which you sent. The state
value solves this issue by binding the request and response, which
reduces impact of <a
href="https://owasp.org/www-community/attacks/csrf">Cross Site Request
Forgery</a> attacks.<br />
This value will be returned to the client in the authentication
response</td>
</tr>
<tr class="even">
<td>nonce</td>
<td>Required</td>
<td>A unique value generated by your application that is used to verify
the integrity of the id_token and mitigate replay attacks</td>
</tr>
</tbody>
</table>

#### <u>Response - Request for Authorisation</u>

HTTP/1.1 302 Found

Location: https://YOUR\_REDIRECT\_URI?code=YOUR\_CODE&state=xyzABC123

#### <u>Errors - Request for Authorisation</u>

To understand more about what the error is, you can look in the
response. Depending on the type of error you receive, the response may
contain an error and an error\_description which will provide you with
information.

If the token request is invalid or unauthorised, you’ll receive an error
response with the Content-Type of application/json, for example:

HTTP/1.1 400 Bad Request

Content-Type: application/json

{

"error": "invalid\_request"

"error\_description": "invalid scope"

}

The table below has information on the error types you may encounter.

<table>
<colgroup>
<col style="width: 10%" />
<col style="width: 34%" />
<col style="width: 55%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Http Status</strong></th>
<th><strong>Error_code</strong></th>
<th><strong>Error_Description</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td rowspan="9"><p> </p>
<p> </p>
<p> </p>
<p> </p>
<p> </p>
<p> </p>
<p>400</p></td>
<td rowspan="6"><p> </p>
<p>invalid_request</p></td>
<td>Invalid Request: Missing client_id parameter</td>
</tr>
<tr class="even">
<td>Invalid Request: Invalid client_ID</td>
</tr>
<tr class="odd">
<td>Invalid Request: Missing redirect_uri parameter</td>
</tr>
<tr class="even">
<td>Invalid Request: The redirect_uri for client iy7tmce7lveq2 is not
registered</td>
</tr>
<tr class="odd">
<td>Invalid Request: Missing response_type parameter</td>
</tr>
<tr class="even">
<td>Invalid Request: The redirect_uri for client XXX is not
registered</td>
</tr>
<tr class="odd">
<td> unsupported_response_type</td>
<td>Unsupported response type: Unsupported response_type parameter</td>
</tr>
<tr class="even">
<td>invalid_scope</td>
<td>Invalid scope: missing scope openid</td>
</tr>
<tr class="odd">
<td>invalid_claims</td>
<td>Invalid claims: email, profile</td>
</tr>
<tr class="even">
<td>401</td>
<td>access_denied</td>
<td>Access_denied: Token not valid</td>
</tr>
<tr class="odd">
<td>402</td>
<td>N/A</td>
<td>N/A</td>
</tr>
<tr class="even">
<td></td>
<td>invalid_session_id</td>
<td>Not found: Invalid SID or expired session</td>
</tr>
<tr class="odd">
<td>403</td>
<td>access_denied</td>
<td> Access_denied: Token not valid</td>
</tr>
<tr class="even">
<td>404</td>
<td>not_found</td>
<td> Not Found: Page not found</td>
</tr>
<tr class="odd">
<td>500</td>
<td>internal_server_error</td>
<td> </td>
</tr>
<tr class="even">
<td>501</td>
<td>N/A</td>
<td>N/A</td>
</tr>
<tr class="odd">
<td>502</td>
<td>bad_gateway</td>
<td>bad_gateway</td>
</tr>
<tr class="even">
<td>503</td>
<td>internal_server_error</td>
<td>internal_server_error : Internl Error. Please Retry</td>
</tr>
</tbody>
</table>

### Step 6 - Redirect

Issue a 302 http redirect with the necessary authorisation request and
parameters needed. This will be passed to the User\_Agent, so that when
authentication happens, a user input will happen.

### Step 7 - Authentication Request

The OP provides a series of UI/UX screens for authentication to happen

### Step 8 - User Consents to Identity Verification

The OP provides a series of UI/UX screens for consent and identity
verification to happen.

### Step 9 - Store Verification Challenge

Once Authentication has happened, the code\_challenge parameter in the
authorisation request (PKCE) is stored, and validated again by the token
end point.

This is a security feature.

### Step 10 - Redirect

Issue a 302 http redirect with the necessary authorisation request and
parameters needed. This will be passed to the User\_Agent, so that when
authentication happens, a user input will happen.

### Step 11 - Send Auth\_Code

A auth\_code is generation after a successful OIDC Flow and returned
back to the End User.

### Step 12 - Make a Request for Token

To make a request to the token endpoint, the relying party’s application
needs to exchange your authorisation code for tokens, you’ll need to
make a POST request to the /token endpoint using the private\_key\_jwt
client assertion authentication method. 

#### <u>Request - Request for Token</u>

POST https:\\\\authz.swan.sign-in.service.gov.scot\\token

{

"client\_assertion\_type": "YOUR\_CLIENT\_ASSERTION\_TYPE",

"code": "YOUR\_CODE",

"grant\_type": "authorization\_code",

"redirect\_uri": "YOUR\_REDIRECT\_URI",

"client\_assertion": "YOUR\_CLIENT\_ASSERTION",

"code\_verifier": "YOUR\_CODE\_VERIFIER"

}

Our access\_token is valid for 4 hrs

#### <u>Parameters - Request for Token</u>

Please replace “YOUR\_\*”, from the above request, with the specific
Relying Party information, following the advice/information provided
below.

<table>
<colgroup>
<col style="width: 23%" />
<col style="width: 11%" />
<col style="width: 65%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Parameter</strong></th>
<th><strong>Type</strong></th>
<th><strong>Description</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>client_assertion_type</td>
<td>Required</td>
<td>Format -
"urn:ietf:params:oauth:client-assertion-type:jwt-bearer"</td>
</tr>
<tr class="even">
<td>code</td>
<td>Required</td>
<td>This information is provided in the previous step</td>
</tr>
<tr class="odd">
<td>grant_type</td>
<td>Required</td>
<td>Format - "authorization_code"</td>
</tr>
<tr class="even">
<td>redirect_uri</td>
<td>Required</td>
<td>You’ll have specified one or moreredirect_uri during onboarding to
ScotAccount.<br />
The redirect URI parameter must exactly match one of the redirect URIs
you specified, except that it must be URL-encoded.</td>
</tr>
<tr class="odd">
<td>client_assertion</td>
<td>Required</td>
<td>This is your public key in a jwt format.</td>
</tr>
<tr class="even">
<td>code_verifier</td>
<td>Required</td>
<td><p>As part of the PKCE process, the OP will return a "code_verifier"
, as part of the authorization process, that will need to be stored, and
sent back to the /token endpoint.</p>
<p>This is a security feature to stop MITM - Man in the Middle
Attacks.</p></td>
</tr>
</tbody>
</table>

#### <u>Responses - Request for Token</u>

##### <u>Response where scope is openid&gpg-45-medium</u>

{

"access\_token":
"eyJ0eXAiOiJhdCtqd3QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlNIQS0yNTYifQ.eyJzdWIiOiJkMWViNDBmOS0xZDlmLTRlOTItYjJhOC01ZTQwYzgwMGI1ODIiLCJzY3AiOlsiZ2l2ZW5fbmFtZSIsImZhbWlseV9uYW1lIiwiYmlydGhfZGF0ZSIsInVwcm4iLCJvcmdhbmlzYXRpb25OYW1lIiwiZGVwYXJ0bWVudE5hbWUiLCJzdWJCdWlsZGluZ05hbWUiLCJidWlsZGluZ051bWJlciIsImJ1aWxkaW5nTmFtZSIsImRlcGVuZGVudFN0cmVldE5hbWUiLCJzdHJlZXROYW1lIiwiZG91YmxlRGVwZW5kZW50QWRkcmVzc0xvY2FsaXR5IiwiZGVwZW5kZW50QWRkcmVzc0xvY2FsaXR5IiwiYWRkcmVzc0xvY2FsaXR5IiwicG9zdGFsQ29kZSIsImdwZy00NS1tZWRpdW0iLCJvcGVuaWQiXSwiaXNzIjoiaHR0cHM6Ly9hdXRoei5zd2FuLnNpZ24taW4uc2VydmljZS5nb3Yuc2NvdCIsImV4cCI6MTY3MTgwMzMyMiwiaWF0IjoxNjcxODAyNDIyLCJqdGkiOiIwMmJlMjE2MC1kZDNkLTRmMzctOGZmMy03NjI2ODgwNGY4OGUiLCJjaWQiOiJzb21lQ2xpZW50SWQifQ.mXtyLOWRefeE95jlxFbbpXdfvhT40vGnyjmOoiKb-KBS73zUU\_hCoDTjN2T5UOSEtCm5lZfEVhQTX1Xfj0SsGLtxHkP4g260O1m9jpuklsUSIpYypq7TStCRy0jzK1-XQCxQGfucSOAM9PfoPUELTgIrerdkk4BGYkt1scD4388lglNEno9m\_\_sSZ2p8OnJEI6F6n7YDTlIMkNgLWvBJGC344Yqn0qW2Jd9\_Cly\_h\_rUtphIVGWRTluIAzNYRnRxbyh\_XBV2PueVfypRXZ5IU5BqkMnxtFktyWphlSuULxZ5wQqP4\_qd-jSk2gJzBcritmkOB\_4crG0Col9V1sZkLQ",

"refresh\_token":
"yFUT9LKACgDHZv3QCe0HHPuKZo4ute4UqETyudp5K8RIALHl73OdMVhTTWErj5GY2NADmbvBAmpftA7BaZbcYXlnACPEjlPzDiITiU0Egb3zaIkkgfUzYtZmvzSe89OjdFIp3KfOsQ1vwW6i5nIVJxZI8D0K0ceCi1HjMTTyqdvouMsTXLHxboCV8PQPANDUXFRVGaJT9zAsRcWXPu01fbbK1SyNxdZG0YGxOwSun9vf8nw2F3C6zqvSAsXnf8AAKqMVv9eHG1ApOtJVr33qw4WuGz7VJGtulk3wmv98kjuU7xXXciQsnoDffKf9NX8tIXNX0chKQOueV6SR8EH1QJVdWKdjDoYIMH9WTDUxiYLl3PgZPpiGL7AC0j7h4dJbCBmbsj9rYC0i5RtDt7FVzHjSL0MYnwZgHuZM1BnrDZEBVGV1uPkGTuY6t4HZ9qn0Ft4vmGgrBDPkdafrasc3FluYez6jZP8lxtwIQ9RdbylzcGC73JZioTFjT8gzs6ABCd1B8c25ag3JzGix3NqbSDmJAT1tKriulKW2ayh3HwW8SBEgvltzgGSUwfjwDA1QW0RbtLeloPXLfES0Dgbz7xiTqu3DKQUPFWACq1pI7Bn3GMB5FvHp3vg1kIOxldoGPd5mctVVZ6L0anwQZLQzhhufZrVBXomf9kH3AEPbIVl3okIdXcEJF5kpy7jTAZ5mrtX1gf6Fq6tdXJ2PiMxK7Lhcfg59UZCzpU3KoN32VQrstHiC5uF9xFHu0notip58P0T7hcrOBLjpOePHguk8jeRR4dIgsBXKASia7Dl4TSDYhPMNbvqpG4SYO54xbW5zLjxb7IMXs2aKebtJnq5TuoTubUnInhJUSWvhG6PZgy3t6wB1AFfJwD82yH5VBgr47tokNdlX9e3R9gwkyeeZnq8fIgiaPR1SqvkjEzJRzfFPYHWck9Lbd2xgNK83SDQZCn6338G16kBqa5iH58JcgrsMjvtsKiaLoORRgqqzxWRb7N9dfyVqDRujtghy56al83DhEc9IW70caT3df346QqY9bHOno8R7IeMpu31DJhg4Bh31kVUvA7UUXGL7HSMpVt2jYKNQsG1XXdmYIpCyuP5n9NAgxwmMyT53u7DcnsSoKUezxDwFKiJtnh0W3OpBCvvKHmL9EPEnR3ByODdplGITSOAIkxh9uz2qHWyB8CKwTzLr68wkqcoOPARlBvHTgQ0SowMUxY5iSFEdEqndv8ZcgzXa0i4P5UxqLrLNGMd0qVOmN2Rikdia6EhqVpwW39TBjbX74moZNO1QA1IBQdBebH0ZO0eci7DgRI7dJDmGvlHlKnm4e6CYGSfxRgoGtvN460vputrwISJbIxkFJR6XXdjmHK4ubrwFo1yoBOnm4ehyG0UnEObH8VMUFuUNpp1MC1UUiORmNwCcJZ3thuleI3ZNFjn9fTyx7nb4kXg4sXk8BbZZvqRVv0gsijrrqCK0Gf9B3BYuyRUq0FlYvQoZmsxF",

"scope": "given\_name family\_name birth\_date uprn organisationName
departmentName subBuildingName buildingNumber buildingName
dependentStreetName streetName doubleDependentAddressLocality
dependentAddressLocality addressLocality postalCode gpg-45-medium
openid",

"id\_token":
"eyJ0eXAiOiJhdCtqd3QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlNIQS0yNTYifQ.eyJzdWIiOiJkMWViNDBmOS0xZDlmLTRlOTItYjJhOC01ZTQwYzgwMGI1ODIiLCJhdWQiOiJzb21lQ2xpZW50SWQiLCJpc3MiOiJodHRwczovL2F1dGh6LnN3YW4uc2lnbi1pbi5zZXJ2aWNlLmdvdi5zY290IiwiZXhwIjoxNjcxODAzMzIyLCJpYXQiOjE2NzE4MDI0MjIsIm5vbmNlIjoiODg5YmU4NjQtYzUyZi00ZWE0LTg3MzEtOTc1MjNhMzEzMjBkIiwianRpIjoiNmI1ZTU0YmMtMGViOS00NGUxLWE5OTgtMjYwM2Q4MTg2ZmYyIiwic2lkIjoiU0lEIn0.lLxz4-FuLaS-n5NC3xAr5\_xOcUupVw5do4DC5ia3c3gJgE7ieoRxuS6uo2qK\_MyjdkUdAOSERA15EKSD9bDpYxPzNpv39MQolA8t2mvlxsW2-pDve1rWbrr9KJXDcbOwhln0Tu9EHCd50c2zNfhC5xyLj1CTCFpUOJc9iBykv6dsLCdIKCaBWidRY0xGKo8gShkE7sUBAJhnHYWJA\_cHq2pRFrIutP-vkHoe59rnpeuB08BJ4PK7EjNlCvV\_22AiLJfiiokHpgQsPT0WyVSehCFZ-wiUKbtyRqHqLaIAjkdJsgR3UqPaV7qcaV7lF2ctwC2qXCzdIi\_IDPdcUwWvKQ",

"token\_type": "Bearer",

"expires\_in": 900

}

#### <u>Errors - Request for Token</u>

To understand more about what the error is, you can look in the
response. Depending on the type of error you receive, the response may
contain an error and an error\_description which will provide you with
information.

If the token request is invalid or unauthorised, you’ll receive an error
response with the Content-Type of application/json, for example:

HTTP/1.1 400 Bad Request

Content-Type: application/json

{

"error": "invalid\_request"

"error\_description": "invalid scope"

}

The table below has information on the error types you may encounter.

<table>
<colgroup>
<col style="width: 5%" />
<col style="width: 28%" />
<col style="width: 65%" />
</colgroup>
<thead>
<tr class="header">
<th>401</th>
<th>access_denied</th>
<th>Access_denied: Token not valid</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>402</td>
<td>N/A</td>
<td>N/A</td>
</tr>
<tr class="even">
<td></td>
<td>invalid_session_id</td>
<td>Not found: Invalid SID or expired session</td>
</tr>
<tr class="odd">
<td>403</td>
<td>access_denied</td>
<td> Access_denied: Token not valid</td>
</tr>
<tr class="even">
<td>404</td>
<td>not_found</td>
<td> Not Found: Page not found</td>
</tr>
<tr class="odd">
<td>500</td>
<td>internal_server_error</td>
<td> </td>
</tr>
<tr class="even">
<td>501</td>
<td>N/A</td>
<td>N/A</td>
</tr>
<tr class="odd">
<td>502</td>
<td>bad_gateway</td>
<td>bad_gateway</td>
</tr>
<tr class="even">
<td>503</td>
<td>internal_server_error</td>
<td>internal_server_error : Internl Error. Please Retry</td>
</tr>
</tbody>
</table>

### Step 13 - Verify Code\_Challenge

The token end point verifies that the auth\_code and code\_challenge are
valid.

### Step 14 - Return Tokens

The token end point returns the following information:

-   id\_token

-   access\_token

-   refresh\_token

### Step 15 - Check Signature

DIS recommends that the relaying party verify the signatures of the
tokens received using the latest configuration from the Discovery End
Point and the JWKS End Point.

### Step 16 - Get Results

To view Verified Attribute Data the user needs to have completed the
identity verification journey, using the scopes=openid&gpg-45-medium.

Then you will be able to make a GET request to /attributes/values using
the access token returned from the token endpoint in the previous step
and a private\_key\_jwt client assertion authentication method.

#### <u>Request - Get Verified Attribute Data</u>

GET
https://attribute-pwya.main.swan.sign-in.service.gov.scot/attributes/values

Headers:

Authorization: "Bearer YOUR\_ACCESS\_TOKEN"

DIS-Client-Assertion: "YOUR\_ASSERTION"

#### <u>Parameters - Get Verified Attribute Data</u>

<table>
<colgroup>
<col style="width: 23%" />
<col style="width: 11%" />
<col style="width: 65%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Parameter</strong></th>
<th><strong>Type</strong></th>
<th><strong>Description</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><p>Header</p>
<p>Authorization: "Bearer ****”</p></td>
<td>Required</td>
<td>Access_Token you received from the /token endpoint</td>
</tr>
<tr class="even">
<td><p>Header</p>
<p>DIS-Client-Assertion: "****”</p></td>
<td>Required</td>
<td>This will be a JWT signed by the RPs private key. The JWT will need
to includes the claims listed here <a
href="https://www.rfc-editor.org/rfc/rfc7519#section-4.1.1">https://www.rfc-editor.org/rfc/rfc7519#section-4.1.1</a><br />
Though connect2id will ignore ‘nbf' and ‘iat’ claims but it adding them
will still work</td>
</tr>
</tbody>
</table>

 

#### <u>Response - Get Verified Attribute Data</u>

{

"claimsToken":
"eyJraWQiOiJkTVZEIiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXJpZmllZF9jbGFpbXMiOnsidmVyaWZpY2F0aW9uIjp7Im91dGNvbWUiOiJmMmNmZTBlMS02ZmJlLTRjYjYtOWU4ZC0xYzFmMTQyN2NjMmEgVkVSSUZJRUQgU1VDQ0VTU0ZVTExZIiwidHJ1c3RfZnJhbWV3b3JrIjoidWtfdGZpZGEiLCJhc3N1cmFuY2VfbGV2ZWwiOiJHUEc0NS1NZWRpdW0iLCJ0aW1lIjoiMjAyMy0wMi0xNVQxNjozOVoiLCJ2ZXJpZmllciI6eyJvcmdhbml6YXRpb24iOiJESVMiLCJ0eG4iOiJhNGRiZTg3Ny1kZjYzLTQ2MDgtOTViMC0zYTdmZTNhNGQ3NTEifX19LCJjbGFpbXMiOnsidXVpZCI6ImYyY2ZlMGUxLTZmYmUtNGNiNi05ZThkLTFjMWYxNDI3Y2MyYSIsImdpdmVuX25hbWUiOiJzYW1wbGVfZ2l2ZW5fbmFtZSIsImZhbWlseV9uYW1lIjoic2FtcGxlX2ZhbWlsaXlfbmFtZSIsImJpcnRoX2RhdGUiOiIxOTkwLTA5LTA4IiwiYWRkcmVzcyI6eyJ1cHJuIjoiOTA2NzAwMDgxNzU5Iiwic3ViQnVpbGRpbmdOYW1lIjoiMC8yIiwiYnVpbGRpbmdOdW1iZXIiOiI5OSIsInN0cmVldE5hbWUiOiJzYW1wbGVfc3RyZWV0X25hbWUiLCJhZGRyZXNzTG9jYWxpdHkiOiJzYW1wbGVfbG9jYWx0aW9uIiwicG9zdGFsQ29kZSI6IlgxMTFYWCJ9fX0="

}

 

####  <u>Errors - Get Verified Attribute Data</u>

To understand more about what the error is, you can look in the
response. Depending on the type of error you receive, the response may
contain an error and an error\_description which will provide you with
information.

If the token request is invalid or unauthorised, you’ll receive an error
response with the Content-Type of application/json, for example:

HTTP/1.1 400 Bad Request

Content-Type: application/json

{

"error": "invalid\_request"

"error\_description": "invalid scope"

}

The table below has information on the error types you may encounter.

<table>
<colgroup>
<col style="width: 5%" />
<col style="width: 28%" />
<col style="width: 65%" />
</colgroup>
<thead>
<tr class="header">
<th>401</th>
<th>access_denied</th>
<th>Access_denied: Token not valid</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>402</td>
<td>N/A</td>
<td>N/A</td>
</tr>
<tr class="even">
<td></td>
<td>invalid_session_id</td>
<td>Not found: Invalid SID or expired session</td>
</tr>
<tr class="odd">
<td>403</td>
<td>access_denied</td>
<td> Access_denied: Token not valid</td>
</tr>
<tr class="even">
<td>404</td>
<td>not_found</td>
<td> Not Found: Page not found</td>
</tr>
<tr class="odd">
<td>500</td>
<td>internal_server_error</td>
<td> </td>
</tr>
<tr class="even">
<td>501</td>
<td>N/A</td>
<td>N/A</td>
</tr>
<tr class="odd">
<td>502</td>
<td>bad_gateway</td>
<td>bad_gateway</td>
</tr>
<tr class="even">
<td>503</td>
<td>internal_server_error</td>
<td>internal_server_error : Internl Error. Please Retry</td>
</tr>
</tbody>
</table>

### Step 17 - Verify Access Token and Private\_JWT

The Verified Data End Point verifies that both the access\_token and
private\_jwt are correct and valid.

### Step 18 - Send Results JWT

Return to the Relaying Parties application a signed JWT with verified
claims of the end user.

### Step 19 - Check Signature of Results

DIS recommends that the relaying party verify the signatures of the
tokens received using the latest configuration from the Discovery End
Point and the JWKS End Point.

### Step 20 - Verify “sub” field in results

DIS recommends that the relaying party verifies that the correct valid
user details are given, by checking the “sub” field matches the initial
request sent.

## Make a Request for Logout

The request to define a Logout url is optional.

### <u>Request - Request for Logout</u>

HTTP/1.1 GET

Location: https://sso.sign-in.service.gov.scot/logout?

id\_token\_hint=eyJraWQiOiIxZTlnZGs3I...

&post\_logout\_redirect\_uri=http://example-service.com/my-logout-url

&state=sadk8d4--lda%d

If no ScotAccount session exists, for example if the session has
expired, the endpoint redirects your user to the default logout page for
ScotAccount. Your user can continue their journey from the default
logout page.

### <u>Parameters - Request for Logout</u>

<table>
<colgroup>
<col style="width: 27%" />
<col style="width: 17%" />
<col style="width: 55%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Parameter</strong></th>
<th><strong>Type</strong></th>
<th><strong>Description</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>id_token_hint</td>
<td>Recommended</td>
<td>This is the ID token ScotAccount previously issued when you made a
request to the /token endpoint for your user’s current session.</td>
</tr>
<tr class="even">
<td>post_logout_redirect_uri</td>
<td>Optional</td>
<td><p>You can only use this parameter if you have specified an
id_token_hint.<br />
This parameter is the URL you want to redirect your users to after you
have logged them out.<br />
The post_logout_redirect_uri must match the logout URI you specified
when you registered</p>
<p>.</p></td>
</tr>
<tr class="odd">
<td>state</td>
<td>Optional</td>
<td>You can use this query parameter to maintain state between the
logout request and your user being redirected to the
post_logout_redirect_uri.</td>
</tr>
</tbody>
</table>

### <u>Response - Request for Logout</u>

HTTP 1.1 302 Found

Location: https://example-service.com/my-logout-url&state=sadk8d4--lda%d

You have now logged your user out of ScotAccount and terminated their
session.