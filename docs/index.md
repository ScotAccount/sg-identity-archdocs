# Overview
Architectural documentation curating the designs of the constituent parts of the Digital Identity service. It currently provides 3 distinct services: Authentication and
Identity Verification and Issuer services. These are provided to Relying Parties using a
OIDC (Open ID Connect) auth code flow with PKCE. 

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

## OIDC flow
The service implements a standard OIDC flow plus additional verification step:
```puml
@startuml 

actor User as user
participant "Client Application" as client
participant "SSO (Authorization Server)" as sso
participant "MySafe (Resource Server)" as mysafe

user -> client: Access Application
client -> sso: (1) Redirect to /authorize endpoint
sso -> user: (2) Prompt for consent & login (if not authenticated)
user -> sso: Consent approval & credentials
sso -> client: (3) Redirect back with Authorization Code

client -> sso: (4) Token Exchange (POST /token)
sso -> client: (5) Access Token + ID Token

client -> mysafe: (6) Access Protected Resource (using Access Token)
mysafe -> client: (7) Return Resource & Claims

@enduml
```

## System Context View
This model describes the external environment in which the Digital
Identity Scotland system operates and identifies the parties which
interact with or are used by the system.

```puml
@startuml Digital Identity Scotland System Context

top to bottom direction
skinparam linetype curved

!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Container.puml

' Define user and RP above the DIS boundary
together {
  Person(user, "User", "Citizen wishing to access digital public services.")
  System_Ext(rp, "Relying Party", "Provider of digital public service.")
}

' Define the DIS boundary
together {
  System_Boundary(dis, "Digital Identity Scotland") {
      Container(sso, "SSO", "Java", "Single Sign-On component for authentication and authorization")
      Container(mysafe, "MySafe", "Java", "Secure vault for storing user identity data and claims")
      Container(vyi, "VYI", "Java", "Verifies your identity through external identity verification services")

      ' MySafe roles and responsibilities
      note left of mysafe
        MySafe manages and shares users' personal information (user attributes) securely:
        1. Issuer Service/UI - Displays locker data, manages consent, and handles attribute requests.
        2. Locker Service - Ensures secure storage of user-selected attributes.
        3. Account Management Service/UI - Allows users to manage stored attributes and view sharing history.
        Users are directed to MySafe after authentication if relying parties request access to attributes 
        using specific scopes.
      end note

      ' SSO roles and responsibilities
      note left of sso
        SSO manages both authentication (Authn) and authorization (Authz):
        1. **Authn Responsibilities:**
          - Guides users through journeys: Sign Up, Sign In, Recover/Reset Email, 
            Reset Password, and Reset Phone Number.
          - Provides UI and backend API to manage journey sessions and user account records, 
            deployed as separate pods in a Kubernetes cluster.
        2. **Authz Responsibilities:**
          - Manages client registrations (relying parties) and handles OIDC user flows.
          - Acts as a wrapper around Connect2Id to customize its behavior and proxy its APIs.
          - Determines user destinations when the `/authorize` API is called:
              - Authn for authentication,
              - MySafe for consent,
              - Relying Party with an authorization code,
              - Error page for failures.
          - Primarily interacts with external parties but has internal interactions with 
            Authn, MySafe, and VYI.
      end note

      ' VYI roles and responsibilities
      note left of vyi
        VYI (Verify Your Identity) orchestrates third-party services to verify 
        a user's claimed identity according to GPG 45 at a medium level of assurance.
        
        **Responsibilities:**
        - Interacts with external verification providers (e.g., document checks, biometrics, vouching).
        - Ensures consistency with GPG 45 guidelines by verifying identity evidence, 
          corroboration, and validation processes. GPG 45 is a UK government guideline for identity verification.
        - Medium level of assurance requires:
          - Sufficient identity evidence (e.g., photo ID and address proof).
          - Verification of the claimed evidence's validity and accuracy.
          - Corroboration across multiple checks to ensure identity linkage.
      end note
  }
}

' Define external systems below the DIS boundary
together {
  ' Updated Experian with Cross-Core Gateway and supporting services
  System_Ext(experian, "Experian Cross-Core Gateway", "Identity verification system delegating to multiple API services.")
  
  System_Ext(idauth, "ID Authenticate", "Validates identity and assesses confidence levels.")
  System_Ext(hunter, "Hunter", "Fraud detection service analyzing user behavior.")
  System_Ext(mitek, "Mitek", "Biometric verification service for facial recognition.")
  System_Ext(iiq, "Identity IQ", "Knowledge based verification. Challenge and response system.")

  ' ID Authenticate roles and responsibilities
  note bottom of idauth
    1. Validates name and address by searching trusted data sources.
    2. Checks for data inconsistencies indicating impersonation (e.g., mismatched DOB, deceased flags, credit activity).
    3. Assesses identity confidence based on number/quality of data proofs, duration, and type (e.g., mortgage vs credit card).
  end note

  ' Identity IQ roles and responsibilities
  note bottom of iiq
    1. Identity IQ performs challenge-response verification using trusted data.
    2. Asks randomly generated questions based on personal data only the legitimate user would know.
    3. Supports multiple clients and accounts with high configurability controlled by parameters.
  end note

  ' Hunter roles and responsibilities
  note bottom of hunter
    Hunter screens applications and customers to highlight potentially fraudulent activity. 
    1. It checks against previous applications or accounts for potential data manipulation and anomalies that could indicate fraud
    2. Previous applications that are known or suspected to be fraudulent, indicators of fraud risk
    3. Identifies applications from idividuals who are PEPs, subject to Sanctions, or with Adverse Media mentions that might indicate fraudulent activity.
  end note

  ' Mitek roles and responsibilities
  note bottom of mitek
    1. Verifies identity documents by analyzing security features.
    2. Performs facial comparison using a selfie and document photo to confirm ownership.
    3. Provides fraud indicators and checks against PEPs, sanctions, and media data.
  end note
}

together {
  System_Ext(cifas, "Cifas", "Fraud identification system.")
  System_Ext(via, "Via Europa", "Address lookup system.")
  System_Ext(vouchsafe, "Vouchsafe", "Identity checking system providing a vouching mechanism.")
  System_Ext(notify, "Gov.UK Notify", "Messaging system for SMS and email notifications.")

  ' Gov.UK Notify roles and responsibilities
  note top of notify
    Gov.UK Notify is used to send notifications to users via SMS and email. 
    1. Provides notification during account registration, recovery, and verification processes.
    2. Sends secure one-time passwords (OTP).
  end note

  ' Cifas roles and responsibilities
  note top of cifas
    Cifas is used to enhance identity verification by checking for indications of risk or misuse 
    associated with a claimed identity. 
    1. Operates on a reciprocal basis, providing access to attempted/actual fraud details from other members.
    2. Requires submission of identified fraud cases and retention of records for 3-6 years.
    3. Supports more robust IDV checks and mitigates risks from knowledge-based verification and vouching.
  end note

  ' ViaEuropa roles and responsibilities
  note top of via
    ViaEuropa is used for address lookup services.
    1. Validates and standardizes user-provided addresses against authoritative address datasets.
    2. Ensures accurate and consistent address data for identity verification processes.
    3. Supports services that require precise address validation to mitigate input errors or fraud.
  end note

  ' Vouchsafe roles and responsibilities
  note top of vouchsafe
    Vouchsafe is used for identity verification when users cannot provide documents 
    for biometric checks or fail the knowledge-based verification (KBV) process. 
    1. Allows verification using alternative evidence such as bank accounts, paper letters, 
      digital IDs, or trusted referees.
    2. Performs background checks to ensure the identity is genuine and not fraudulent.
    3. Enables access for individuals who find it difficult to prove their identity.
  end note
}

' Relationships
user --> dis: "Authorization (account registration/idv, authentication, consent), account management, account recovery, logout, support request"
user -l-> rp: "Access protected resource"
rp --> dis: "Endpoint discovery, get keyset, get user data"

' Connections to external systems
dis --> experian: "Verify user identity through gateway"
dis --> cifas: "Verify user fraud"
dis --> vouchsafe: "Verify user identity"
dis --> via: "Lookup address"
dis --> notify: "Trigger SMS/Email"
notify -u-> user: "Send SMS/Email"

' Expanded Experian Cross-Core Gateway delegation
experian --> idauth: "Perform identity verification"
experian --> hunter: "Analyze user behavior for fraud"
experian --> mitek: "Use biometric verification for identity"
experian --> iiq: "Knowledge-based verification"

' Internal relationships within DIS
sso --> vyi: "Handles identity verification process"
vyi <--> mysafe: "Stores and retrieves identity data securely"
sso <--> mysafe: "Access user claims and attributes for authentication"

@enduml
```

The Digital Identity Scotland service has a customer/supplier
relationship with each enrolled public sector body. The public sector
body is identified in this document as the **relying party**. Users
(i.e. citizens of Scotland) will continue to be identified as **user**.

## Container View

![](./container-view.png)

## Deployment Diagram

This diagram shows the key network topology and services used in the ScotAccount application.  It shows the correct network ingress and egress routes as well as illustrating the availability zone distribution of key components.  This diagram was based on the code in the repository as well as the information discovered using the AWS portal.

![](./deployment-view.jpeg)

