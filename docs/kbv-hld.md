KBV Interface - HLD
===================

```puml
@startuml kbv-hld
' Uncomment the line below for "dark mode" styling
'!$AWS_DARK = true
!define AWSPuml https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/v17.0/dist
!define KubernetesPuml https://raw.githubusercontent.com/dcasati/kubernetes-PlantUML/master/dist
!define SPRITESURL https://raw.githubusercontent.com/plantuml-stdlib/gilbarbara-plantuml-sprites/v1.1/sprites

!includeurl KubernetesPuml/kubernetes_Common.puml
!includeurl KubernetesPuml/kubernetes_Context.puml
!includeurl KubernetesPuml/kubernetes_Simplified.puml
!includeurl KubernetesPuml/OSS/KubernetesPod.puml

!include AWSPuml/AWSCommon.puml
!include AWSPuml/AWSSimplified.puml
!include AWSPuml/EndUserComputing/all.puml
!include AWSPuml/General/all.puml
!include AWSPuml/Groups/all.puml
!include AWSPuml/NetworkingContentDelivery/all.puml
!include AWSPuml/Analytics/all.puml
!include AWSPuml/Storage/all.puml
!include AWSPuml/ApplicationIntegration/all.puml
!include AWSPuml/Compute/all.puml
!include AWSPuml/SecurityIdentityCompliance/all.puml
!include AWSPuml/Containers/all.puml

hide stereotype
skinparam linetype polyline

' External Service Icon for Identity IQ
together {
  Boundary(experian, "Experian") {
      rectangle "Identity IQ API" as iiqApi        
      rectangle "WASP API" as waspApi
  }
  note bottom of iiqApi #Beige
    **Identity IQ API**:
    - Implements Knowledge-Based Verification (KBV).
    - Uses a question-and-answer protocol to match responses with trusted data sources.
    - Provides fallback identity verification when biometrics are unavailable.
    - Encrypts communication via **SSL** over HTTPS with **SOAP/XML** protocols.
  end note

  note bottom of waspApi #Beige
    **WASP API**:
    - Authentication system Experian uses to secure access to it's services including Identity IQ.
    - Clients use mTLS with an Experian provided certificate to connect.
    - After a successful handshake WASP returns a limited life token for use in subsequent API calls.
    - Encrypts communication via **SSL** over HTTPS with **SOAP/XML** protocols.
  end note
}


AWSCloudGroup(cloud) {
    AWSAccountGroup(build, "Digital_Identity-Production (Strategic Cloud Platform)") {
        Cluster_Boundary(eks, "EKS Cluster") {
            KubernetesPod(vyi, "VYI Service", "")
            KubernetesPod(mysafe, "MySafe Service", "")

            note top of vyi #Beige
              **VYI Service**:
              - Verifies user's identity using external services from Experian.
              - Uses **Identity IQ** for **Knowledge-Based Verification (KBV)** when biometric verification is not feasible.
              - Uses **WASP** for authentication, and retrieval of a security token that can be used to access Identity IQ.             - Communicates securely with Identity IQ over **HTTPS/SOAP/XML** protocols.
              - Communicates securely with Identity IQ & WASP over **HTTPS/SOAP/XML** protocols.
            end note

            note top of mysafe #Beige
              **MySafe Service**:
              - Stores verified identity attributes.
              - Stores metadata about identity verification processes (e.g. KBV question quality).
            end note
        }

        Cluster_Boundary(ecs, "ECS Cluster") {
            ElasticContainerService(squid, "Squid Proxy", "")

            note top of squid #Beige
              **Squid Proxy**:
              - Manages outbound internet traffic.
              - Allows access to Experian's Identity IQ and WASP API by whitelisting domains.
              - Ensures controlled and secure communication to external web services.
            end note
        }

        together {
            SimpleStorageServiceS3Standard(mysafeBucket, "MySafe S3 Bucket", "") #Transparent
            KeyManagementService(mysafeKey, "MySafe KMS Key", "") #Transparent

            note bottom of mysafeBucket #Beige
              **MySafe Bucket**:
              - Persists verified claims and metadata for verification processes.
              - Metadata includes quality of the KBV questions posed to users.
              - Encrypted at rest using KMS. 
              - Client side encrypted with segregation by account. 
            end note

            note bottom of mysafeKey #Beige
              **MySafe KMS Key**:
              - Provides encryption for the MySafe S3 bucket.
              - Key is managed for limiting access to MySafe service.
            end note
        }
    }
}

' Connections for internal services
vyi --> mysafe : "HTTP/REST/JSON\nvia Kubernetes Virtual Network"
mysafe --> mysafeBucket : "HTTPS\nvia AWS network" 
mysafeBucket --> mysafeKey : "HTTPS\nvia AWS Network"

' VYI communicates with Squid Proxy
vyi --> squid : "HTTPS/SOAP/XML\nvia Squid Proxy"

' Squid Proxy communicates with the external Identity IQ API
squid --> experian : "HTTPS/SOAP/XML\nvia <&globe> Internet"


@enduml
```

The above diagram depicts the high-level design of the elements of the
Digital Identity Services involved in the use of **Knowledge-Based
Verification (KBV)** to verify a user's identity leveraging
**Experian\'s services, Identity IQ API** and **WASP API**. This
architecture emphasizes secure transport mechanisms, controlled access
policies, and encrypted storage for handling sensitive identity-related
data.

#### Key Components:

1.  **VYI Service**:

    -   Deployed within the **EKS Cluster** (Kubernetes), this service
        orchestrates the identity verification flow.

    -   It uses the **WASP API** for secure authentication to obtain a
        token and communicates with Identity IQ to perform KBV.

    -   Interaction with external Experian services is tightly secured
        using **HTTPS/SOAP/XML**, via the **Squid Proxy** to ensure
        controlled outbound traffic.

    -   Implements fallback identity verification processes when
        biometric methods cannot be used.

2.  **MySafe Service**:

    -   Also deployed in the **EKS Cluster**, MySafe is responsible for
        securely storing verified identity attributes and metadata about
        verification processes.

    -   This includes data such as the quality of KBV challenge
        questions posed to users.

3.  **Squid Proxy Service**:

    -   Hosted in the **ECS Cluster**, the **Squid Proxy** acts as a
        mediator for all outbound traffic to ensure controlled and
        secure communication with external web services.

    -   It whitelists domains for traffic only to authorized Experian
        APIs (Identity IQ and WASP).

4.  **Experian Services**:

    -   **Identity IQ API (IIQ)**:

        -   Plays a central role in implementing **Knowledge-Based
            Verification (KBV)**.

        -   It uses a question-and-answer protocol to validate a user\'s
            identity by comparing their responses to trusted data
            sources.

        -   IIQ serves as a **fallback identity verification method**
            when biometric verification is not feasible.

        -   Communication with Identity IQ is secured through **SSL over
            HTTPS**, employing **SOAP/XML** protocols to ensure data
            confidentiality and integrity.

    -   **WASP API**:

        -   Acts as Experian\'s **authentication service**, securing
            access to IIQ.

        -   Clients use **mutual TLS (mTLS)** to establish a secure
            connection, authenticated with a certificate provided by
            Experian.

        -   WASP generates **short-lived tokens**, which the client (in
            this case, the VYI service) uses in subsequent API requests
            to Identity IQ.

        -   All communications are encrypted using **SSL over HTTPS**
            with **SOAP/XML**.

5.  **Identity Storage**:

    -   Verified identity attributes are securely stored in the **MySafe
        S3 bucket**, encrypted with **Amazon\'s Key Management Service
        (KMS)**.

    -   The S3 bucket uses **AES-256 encryption** for client-side
        encryption, ensuring data remains secure at rest.

    -   Access to the S3 bucket is strictly controlled, with policies
        limiting access only to the MySafe service.

#### Security Highlights:

-   **Transport-Level Security**: All inter-process and external
    communications are secured using **SSL over HTTPS** with **SOAP/XML
    protocols**, ensuring sensitive data cannot be intercepted in
    transit.

    -   Communication between **VYI and WASP** involves client
        authentication using **mTLS certificates**.

    -   Communication with **Identity IQ** employs a token issued by
        WASP for secure access.

-   **Controlled Outbound Traffic**: The **Squid Proxy** ensures that
    outbound requests are directed only to trusted endpoints by
    whitelisting the domains for Identity IQ and WASP APIs. This
    minimizes unauthorized traffic.

-   **Secure Data Storage**: Verified identity attributes are stored in
    an encrypted **S3 bucket**, where:

    -   **Encryption at Rest**: Achieved with **KMS-managed AES-256
        encryption**.

    -   **Access Control**: Enforced through strict IAM policies that
        allow only **MySafe** to access the data.