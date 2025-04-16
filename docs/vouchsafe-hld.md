Vouchsafe Interface - HLD
=========================

```puml
@startuml vouchsafe-hld
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
  Boundary(vouchsafe, "Vouchsafe") {
      rectangle "Vouchsafe API" as vouchsafeApi        
  }

  note bottom of vouchsafeApi #Beige
    **Vouchsafe API**:
    - Enables client to request a new verification, commencing a vouching process.
    - On commencement, vouchsafe provides a url to be used by client to redirect the user for verification
    - Client can track the progress of a verification journey synchronously via request/response API or asynchronously via a webhook API.
  end note

  note left of vouchsafeApi #Beige
    **Vouchsafe API**:
    - Client pre-authenticates with Vouchsafe using client id and secret to retrieve an access token.
    - All subsequent requests require use of access token.
    - Access token expires after 1 day. On expiry, access token needs refresh.
  end note

  note top of vouchsafeApi #Beige
    **Vouchsafe API**:
    - Vouchsafe acts as relying party for the referees journey
    - Undertakes a standard OIDC flow via ScotAccount
  end note
}


AWSCloudGroup(cloud) {
    AWSAccountGroup(build, "Digital_Identity-Production (Strategic Cloud Platform)") {
        Cluster_Boundary(eks, "EKS Cluster") {
            KubernetesPod(vyi, "VYI Service", "")
            KubernetesPod(mysafe, "MySafe Service", "")
            KubernetesPod(scotaccount, "ScotAccount", "") 
            
            note top of vyi #Beige
              **VYI Service**:
              - Verifies user's identity using external services from Vouchsafe.
              - Uses request/response API to receive notifications as a user moves through the stages of the vouching process
              - Ensures referees are biometrically verified
              - Communicates securely with Vouchsafe using **HTTPS/Rest** protocols.
            end note

            note top of mysafe #Beige
              **MySafe Service**:
              - Stores verified identity attributes.
              - Stores metadata about identity verification processes (e.g. KBV question quality).
            end note

            note top of scotaccount #Beige
              **ScotAccount Service**:
              - Authenticates and authorizes users and referees. 
              - Delegates to VYI for verification journey
              - Uses MySafe to retrieve verified claims
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
scotaccount --> mysafe : "HTTP/REST/JSON\nvia Kubernetes Virtual Network"
scotaccount --> vyi : "HTTP/REST/JSON\nvia Kubernetes Virtual Network"

mysafe --> mysafeBucket : "HTTPS\nvia AWS network" 
mysafeBucket --> mysafeKey : "HTTPS\nvia AWS Network"

' VYI communicates with Squid Proxy
vyi --> squid : "HTTPS/Rest/JSON\nvia Squid Proxy"

' Squid Proxy communicates with the external Vouchsafe API
squid --> vouchsafeApi : "HTTPS/Rest/JSON\nvia <&globe> Internet"

' Vouchsafe communicates with the ScotAccount as relying party
vouchsafeApi --> scotaccount : "HTTPS/Rest/JSON\nvia <&globe> Internet"

@enduml
```

The above diagram depicts the high-level design of the elements of the
Digital Identity Services involved in the use of **Vouchsafe** to verify a user's identity leveraging a vouching process using a trusted referee. This
architecture emphasizes secure transport mechanisms, controlled access
policies, and encrypted storage for handling sensitive identity-related
data.

#### Key Components:

1.  **ScotAccount Service**:

    - Deployed within the **EKS Cluster** (Kubernetes), this service provides our standard OIDC flow to relying parties

    - It delegates to **VYI** to enable the verification of a user's identity to GPG45 medium level.

    - Post verification, users identity details are shared with the relying party (in this case **Vouchsafe**) after consent has been given.   

2.  **VYI Service**:

    -   Deployed within the **EKS Cluster** (Kubernetes), this service
        orchestrates the identity verification flow.

    -   It uses the **Vouchsafe API** to redirect the user to vouchsafe to undertake a verification journey using a vouching process.

    - The journey taken involves a user selecting a trusted referee to vouch for them
    
    - A trusted referee is an individual who will undergo or has previously undergone biometric verification via **ScotAccount**.

    - Following a successful verification process the user is assured to **GPG 45 M2B** level.   

3.  **MySafe Service**:

    -   Deployed in the **EKS Cluster**, MySafe is responsible for
        securely storing verified identity attributes and metadata about
        verification processes.

    -   This includes data such as the verified users given name, surname, email, phone number and address.

4.  **Squid Proxy Service**:

    -   Hosted in the **ECS Cluster**, the **Squid Proxy** acts as a
        mediator for all outbound traffic to ensure controlled and
        secure communication with external web services.

    -   It whitelists domains for traffic only to authorized Vouchsafe
        APIs

4.  **Vouchsafe Service**:

    -   **Vouchsafe API**:

        - Allows a client to trigger a verification process.

        - Provides a url to allow the client to redirect the user to vouchsafe to undergo the vouching process

        -   Allows client to retrieve the current status of the verification process synchronously or asynchronously

        - Uses ScotAccount as a relying party for the authentication and verificiation of referees invited to the vouching process.

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
    communications are secured using **HTTPS** with **Rest protocols**, ensuring sensitive data cannot be intercepted in
    transit.

    -   Communication between **VYI and Vouchsafe** involves client
        authentication using **client id and secret**.

    -   All requests require access token issued by **Vouchsafe** for secure access.

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