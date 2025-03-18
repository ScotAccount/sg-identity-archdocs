# CIFAS Interface
  Cifas is used to enhance identity verification by checking for indications of risk or misuse 
  associated with a claimed identity.

  1. Operates on a reciprocal basis, providing access to attempted/actual fraud details from other members.
  2. Requires submission of identified fraud cases and retention of records for 3-6 years.
  3. Supports more robust IDV checks and mitigates risks from knowledge-based verification and vouching.

## Key concepts

## Solution Design

```puml
@startuml cifas-interface-design
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
!includeurl SPRITESURL/jira.puml
!includeurl SPRITESURL/openapi.puml
!includeurl SPRITESURL/microsoft-teams.puml
hide stereotype
'skinparam linetype ortho
skinparam linetype polyline
rectangle "<$jira>\nJIRA" as jira
rectangle "CIFAS\n API" as cifasapi
rectangle "Experian\n API" as experianapi
rectangle "<$microsoft-teams>\Teams" as teams
AWSCloudGroup(cloud) {
    AWSAccountGroup(build, "Digital_Identity-Production(Strategic Cloud Platform)") {
        together {
            SimpleStorageServiceS3Standard(cifasBucket, "CIFAS S3 bucket", "") #Transparent
            KeyManagementService(cifasKey, "CIFAS KMS key", "") #Transparent
            Kinesis(cifasTopic, "CIFAS Kinesis topic", "") #Transparent
            Lambda(cifasLambda, "CIFAS Notification lambda", "") #Transparent
        }
        Cluster_Boundary(eks, "EKS") {
            KubernetesPod(vyi, "VYI service", "")
        }
        vyi .right.> cifasBucket
        vyi .right.> cifasTopic
        cifasBucket .down.> cifasKey
        cifasTopic <.right. cifasLambda
        note top of vyi #Beige
        - Verifies user's identity using Experian API.
        - Check for potential fraud using CIFAS API.
        - In the case of an amberhill case match being identified, continues verification journey gathering and storing request/responses into S3.
        - Notification of fraud data being captured raised via Kinesis.
        - Message pushed to Kinesis containing the matched transactionId.
        end note
        note top of cifasBucket #Beige
        - S3 service used to store collected request/responses on a per transactionId basis.
        - Request/responses stored in files using transaction id path prefix
        - Bucket encrypted using KMS. 
        - Access to key controlled to ensure access limited to authorized users.
        - Bucket configured with auditing and 6 year retention period.
        end note
        note top of cifasTopic #Beige
        - Kinesis service used to store notifications of fraud data tracking.
        - Payload contains matched transaction id.
        end note
        note top of cifasLambda #Beige
        - Reads notifications from Kinesis.
        - Creates ticket in JIRA using webhook. 
        - Create message in TEAMS using webhook.
        end note
        note bottom of cifasKey #Beige
        - KMS used to encrypt S3 bucket.
        - Key management to limit access to the bucket content to authorized users. 
        end note
    }
}
vyi .up.> experianapi
vyi .down.> cifasapi
cifasLambda .up.> jira
cifasLambda .left.> teams
note bottom of experianapi #Beige
    - Webservice used to verify user's identity.
end note
note bottom of cifasapi #Beige
    - Webservice used to identify potential fraud cases.
end note
@enduml
```