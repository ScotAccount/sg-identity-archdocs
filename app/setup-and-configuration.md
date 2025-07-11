---
layout: sub-navigation
title: Section 2 - Setup and Configuration - RP integration test
---
We have a dedicated integration environment available for Relying  
Parties and or other interested parties, to demo / integrate / trial our  
service offerings.

Integration environment details are:

| **Feature**            | **Integration Details**                                                                                                                                      |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| oidc_private_client    | [https://oidc-private-client.swan.sign-in.service.gov.scot/integration](https://oidc-private-client.swan.sign-in.service.gov.scot/integration)               |
| mock_service           | [https://mock-dis.main.swan.sign-in.service.gov.scot](https://mock-dis.main.swan.sign-in.service.gov.scot/)                                                  |
| oidc_identity_provider | [https://authz.swan.sign-in.service.gov.scot](https://authz.swan.sign-in.service.gov.scot)                                                                   |
| discovery_endpoint     | [https://authz.swan.sign-in.service.gov.scot/.well-known/openid-configuration](https://authz.swan.sign-in.service.gov.scot/.well-known/openid-configuration) |
| version_endpoint       | [https://version.swan.sign-in.service.gov.scot](https://version.swan.sign-in.service.gov.scot/)                                                              |

The things you need to provide us to set up your RP account are:

the external IP (or range of IPs) from which you'll be connecting  
(both for your service sending requests and expecting responses and  
developers/people getting on to our environment from their devices)

your private_key_jwt, public part.

your FQDN.

your redirect url.

your logout url (optional)

a name of your service.

We will then Register a Client and provide Back a “Client ID”.

Note: Step 6 “name of your service”, will be displayed on specific  
ScotAccount pages for dual branding purposes

## 1\. Provide IPs for our Allow Lists

We use IP Allow Lists as a Security Mechanism to restrict access, since  
we are currently a “private beta” offering, as such any Relying Party  
will need to provide to us their public IP Address both for the Client  
Browser Session, and for their service, that is wanting to connect to  
our service. This is because we implement both front and back channel  
communication.

Different Types of Access Needs

Home based access , [What Is My IP? Shows Your Public IP Address -](https://www.whatismyip.com/)  
[IPv4 - IPv6](https://www.whatismyip.com/)

Home based access via a vpn, contact your Network Team / Service  
Provider

Office based access, contact your Network Team / Service Provider

How many IPs will I need to provide

1 , if you running everything from a laptop

2, if you running a client / server model

For Production you will only need to provide an IPs for your “BackEnd”  
to communicate with the service

Static IPs if possible

We prefer individual IPs where possible

But ranges are also allowed

## 2\. Provide your public key for private_key_jwt method call

As part of our client authentication process, the Relying Party  
application will need to provide a public key for the private_key_jwt  
method call.

You’ll need to provide a public key when registering your service. You  
can generate a key pair (a public key and a corresponding private key)  
using [OpenSSL](https://www.openssl.org/).

You’ll need your private key when:

You’re registering your service to use our environments, such as  
Integration or Production.

You request the token using the private key authentication mechanism  
on the /token endpoint.

Once you’ve generated your private key, you must store the key in a  
secure location like aws secrets manager or hashicorp vault, and you  
must not share the private key, and the key must be mounted into the  
application at runtime using a tmpfs file.

You MUST use a different key pair for Production to the one you use in  
the test environment/s.

Supported Algorithms

We support RSA or Elliptic Curve based signing keys.

When deciding between ECDSA vs RSA, both can provide equivalent levels  
of security given long enough key sizes. As ECDSA uses smaller keys to  
achieve the same level of security and it generally performs faster than  
RSA.

When generating an RSA key you need to decide how long the key will be.  
A longer key is more secure but slower.

When generating an elliptic curve key you need to decide on a curve to  
use which corresponds to the length of the key, similar to RSA a longer  
key is more secure but slower.

For ES256 (256 ECDSA key using curve P256 and SHA-256) this provides 128  
bits of security and is considered safe from being cracked beyond 2030.  
For and RSA key to provide equivalent security it will have to have a  
key size of 3072 bits or greater. A 2048 bit RSA key is still considered  
safe from being cracked for the next few years but longer is  
recommended.

Using OpenSSL, run the following on your command line to generate an RSA  
key pair:

openssl genrsa -out private_key.pem 3072

openssl rsa -pubout -in private_key.pem -out public_key.pem

The last parameter (3072 here) is the length of the RSA key in bits.

the number of bits needs to be 2048 or greater

When generating an elliptic curve key you need to select a curve to use.  
The algorithms we support require specific curves. See below.

| **JWT Signing algorithm** | **Curve** | **OpenSSL curve name** |
| ------------------------- | --------- | ---------------------- |
| ES256                     | P-256     | prime256v1             |
| ES384                     | P-384     | secp384r1              |
| ES512                     | P-521     | secp521r1              |
| ES256K                    | secp256k1 | secp256k1              |

Using OpenSSL, run the following on your command line to generate an EC  
key pair:

openssl ecparam -name secp521r1 -genkey -noout -out private_key.pem

openssl ec -in private_key.pem -pubout -out public_key.pem

You have now generated your key pair, which will appear on your machine  
as 2 files:

public_key.pem - This is your public key, which you should share  
with us.

private_key.pem - This is your private key, which you should store  
securely and NOT share.

Once you have generated your key pair, you can use it to create a  
private_key_jwt.

Example private_key_jwt

Base64 Encoded

eyJhbGciOiJFUzI1NiJ9.

ewogICJqdGkiOiJteUpXVElkMDAxIiwKICAic3ViIjoiMzgxNzQ2MjM3NjIiL

AogICJpc3MiOiIzODE3NDYyMzc2MiIsCiAgImF1ZCI6Imh0dHA6Ly9sb2NhbG

hvc3Q6NDAwMC9hcGkvYXV0aC90b2tlbi9kaXJlY3QvMjQ1MjMxMzgyMDUiLAo

gICJleHAiOjE1MzYxNjU1NDAsCiAgImlhdCI6MTUzNjEzMjcwOAp9Cg.

YB4gdhWUGRjWEsEbKDs7-G2WFH2oYz7bAEP5AtegHXInkY9ncA2V3IoA6O_HV

QuFxyCRIklrxsMk32MfNF_ABA

Header part of private_key_jwt

{

"alg": "ES256"

}

Payload part of private_key_jwt

{

"jti": "myJWTId001",

"sub": "38174623762",

"iss": "38174623762",

"aud": "http://localhost:4000/api/auth/token/direct/24523138205",

"exp": 1536165540,

"iat": 1536132708

}

Signature part of private_key_jwt

not shown

Tools to help with the creation / validation of you  
private_key_jwt

There are many utilities on the internet. These are just a few common  
ones to call out:

Creation -  
[json-web-key-generator](https://github.com/mitreid-connect/json-web-key-generator)  
or [mkjwk - JSON Web Key Generator](https://mkjwk.org/)

Validate - [JSON Web Tokens - jwt.io](https://jwt.io/)

Utilities - [Base64 Decode and Encode -](https://www.base64decode.org/)  
[Online](https://www.base64decode.org/) and [Base64 Encode and](https://www.base64encode.org/)  
[Decode - Online](https://www.base64encode.org/)

## 3\. Provide us with you FQDN or localhost

As part of the on-boarding process you will need to provide us with your  
fully qualified Domain Name.

You can supply “localhost”, if you are running both the client  
browser and the server from your laptop

You can supply, a Public FQDN. Example “dummyrp.test.org.gov.scot”

The use of “localhost and “http” is ONLY allowed in our integration  
environment

## 4\. Provide us with your redirect URL

As part of the on-boarding process you will need to provide us a set of  
one of many redirect-url, as part of the client registration process.

Full detailed information can be found in “Stage 3 - Technical - Make  
Requests with Auth Code Flow and PKCE”

## 5 Provide DIS with your Logout URI

As part of the on-boarding client registration process you can provide  
us a Logout url, this is an optional requirement. More information about  
the use of Logout can be found in “Stage 3 Technical - Make a Request  
for Logout” section.

For an Example, see below:

- https://_yourservicetest_.org.gov.scot/logout

## 6\. We will Register a Client, and provide Back a “Client ID”

Once you have provided us all the information from steps 1 to 5, we will  
register your Relying Party application and return a “Client ID”, back  
to you.

## 7\. Simple Test

There is a simple way you can use to ensure the IP Allow List has been  
implemented for you in our integration environment as follows:

GET  
[https://version.swan.sign-in.service.gov.scot](https://version.swan.sign-in.service.gov.scot/)

If successful, you will receive a http response code of 200, and a  
json object

If failure, you will receive a http response code of 504, timeout.  
You should contact us in this case.

Example Version Json object

{"App":{"SSO":{"Authn-Frontend":{"commit_sha":"c59129d74871de4beca837ed6045c6e973c23d27","build_number":"14112","version":"release-20221116.1","release_id":"20221116.1"},"Authn-Api":{"commit_sha":"c59129d74871de4beca837ed6045c6e973c23d27","build_number":"14112","version":"release-20221116.1","release_id":"20221116.1"},"Authz-Service":{"commit_sha":"c59129d74871de4beca837ed6045c6e973c23d27","build_number":"14112","version":"release-20221116.1","release_id":"20221116.1"},"Authz-Server":{"commit_sha":"c59129d74871de4beca837ed6045c6e973c23d27","build_number":"14112","version":"release-20221116.1","release_id":"20221116.1"}}},"Platform":{"sg-identity-platform-sgidentityplatformsgidentityplatformimportedclustersgidentityplat-167GRCPH6KXPA":"20221116.0","sg-identity-platform":"20221116.0","platform-dns-stack":"20221116.0","identity-eks-stack":"20221116.0","BaselineStack":"20221116.0","subscription-filter-stack":"20221116.0","ssm-stack":"20221116.0","sg-alerting-stack":"20221116.0","PersistentLoggingStack":"20221116.0"},"PWYA":{"Consent-Service":{"version":"release-20221116.0","commit_sha":"2bd208f0af7b715b0f0aee66a7c4d381668fafc0","build_number":"14108","release_id":"20221116.0"},"Consent-UI":{"version":"release-20221116.0","commit_sha":"2bd208f0af7b715b0f0aee66a7c4d381668fafc0","build_number":"14108","release_id":"20221116.0"},"IDV-Service":{"version":"release-20221116.0","commit_sha":"2bd208f0af7b715b0f0aee66a7c4d381668fafc0","build_number":"14108","release_id":"20221116.0"},"IDV-UI":{"version":"release-20221116.0","commit_sha":"2bd208f0af7b715b0f0aee66a7c4d381668fafc0","build_number":"14108","release_id":"20221116.0"},"Orchestrator":{"version":"release-20221116.0","commit_sha":"2bd208f0af7b715b0f0aee66a7c4d381668fafc0","build_number":"14108","release_id":"20221116.0"},"Attribute-Service":{"version":"release-20221116.0","commit_sha":"2bd208f0af7b715b0f0aee66a7c4d381668fafc0","build_number":"14108","release_id":"20221116.0"}}}