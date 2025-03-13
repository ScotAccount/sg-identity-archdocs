# MySafe Service

## Key concepts
- Key concept 1
- Key concept 2

## Component Diagram
```puml
@startuml
title MySafe as-is component diagram
component AWS_account #LightGrey{
    component Internet_VPC #LightGreen{
      [AWS ALB for App Ingress] as "AWS ALB"
      [AWS NLB for Squid] as "AWS NLB ('Basel')"
      component ECS_cluster #LightBlue{
         [Squid_outbound_proxy]
      }
      [AWS NLB for Squid] ..up..> Squid_outbound_proxy
      [AWS ALB for EKS] as "AWS ALB"
'      [AWS ALB for EKS] ..> [AWS lambda for EKS API]
      [NAT_Gateway]
    }
    component Application_VPC #LightGreen{
      [EKS API]
      database SecretsManager <<VPC endpoint>>
      database CloudWatch <<VPC endpoint>>
      [AWS NLB for App Ingress] as "AWS NLB"
      database DynamoDB <<VPC endpoint>>
      database S3 <<VPC endpoint>>
      [KMS] <<VPC endpoint>>
      component EKS_cluster #LightBlue{
          component VYI_namespace #LightPink{
                component VYI_services  as "..."{
                }
          }
          component ScotAccount_namespace #LightPink{
                component ScotAccount_services  as "Authz (Mediator)"{
                }
                component ScotAccount_services_other  as "..."{
                }
                [Connect2id]
          }
        component Issuer_namespace #LightPink{
         [Issuer_Service] as "Issuer_Service\n<s>MySafe_Service" <<SpringBoot>>
         [Issuer_UI] as "Issuer_UI\n<s>MySafe_UI"<<node.js>>
        }
        component MySafe_namespace #LightPink{
         [Locker_Service] as "Locker-service" <<SpringBoot>>
        }
        component nginx_ingress_namespace #LightPink{
              [nginx]
        }
      }
    }
}
cloud Internet
cloud VPN

Internet ..>[AWS ALB for App Ingress]
VPN ..>[AWS ALB for EKS]
[AWS ALB for EKS]  ..> [EKS API]

[AWS ALB for App Ingress]..>[AWS NLB for App Ingress]
[AWS NLB for App Ingress]..>[nginx]
[Squid_outbound_proxy] ..up..> [NAT_Gateway]
[NAT_Gateway] ..> Internet
nginx ..> [Issuer_UI]

[Issuer_UI] ..> [Issuer_Service]

VYI_services <..> Issuer_Service
ScotAccount_services <..> Issuer_Service

[Issuer_Service]..> DynamoDB
Issuer_Service ..> SecretsManager
[Issuer_Service]..> [Connect2id] : OAuth2 Token Exchnage

[Locker_Service]..> S3
[Locker_Service]..> [Connect2id] : verify access token
[Locker_Service]..> [KMS]

Issuer_Service ..> [Locker_Service]
EKS_cluster ..> CloudWatch

legend right
  Dotted arrows represent direction of dependencies.
  HTTP-redirecting-to is not depicted by dotted arrows.
endlegend
@enduml
```

## High level data flow diagram
```puml
@startuml
title High level data flow between components
autonumber
hide footbox
participant RP as "Relying Party"
actor Citizen as "Citizen/\nweb browser"
participant ScotAccount
participant Issuer as "Issuer\n<s>MySafe"
participant VYI
participant Locker as "Locker-\nservice"
Citizen -> RP
RP --> Citizen: redirect to DIS
Citizen -> ScotAccount : sign me in
ScotAccount --> Citizen : redirect to Issuer
Citizen -> Issuer :    (...)
group OPTIONAL: reuse data from Locker
  Issuer -> Locker: pull citizen data
  Issuer <-- Locker:
end group
group OPTIONAL: VYI
Issuer --> Citizen : redirect to VYI
Citizen -> VYI : undergo successful IDV
VYI -> Issuer : push IDV results\nvia backchannel
Issuer -> Issuer: verify VYI's signature
VYI --> Citizen : redirect to Issuer
Citizen -> Issuer :  (...)
end
group OPTIONAL: save data to Locker
  Issuer -> Locker: push citizen data
end group
Issuer --> Citizen : redirects to ScotAccount
Citizen -> ScotAccount
ScotAccount -->  Citizen : redirects to RP - to finalize OIDC flow
Citizen -> RP
RP -> ScotAccount : exchanges authorization code for <i>access token</i> (amongst others)
RP -> Issuer : presents <i>access token</i>
Issuer --> RP : returns JWT token with citizen data
@enduml
```

## MySafe journey (Save)
```puml
@startuml
title Journey with VYI and saving into MySafe
[RP] as "Relying Party"
[SSO] as "ScotAccount"
RP ..> SSO : (1) requests verified data
SSO ..> SSO: (2) sign-in/up
SSO ..> [Issuer] : (3)
Issuer ..> Issuer : (4) should we reuse Mysafe data?
[Issuer] ..> [VYI] : (5) No! Start IDV journey,\nrather than reusing data from Mysafe
VYI ..> VYI : (6) successful IDV,\n(7) consent to store page
VYI ..> [Issuer] : (8) data handed over to Issuer\n& data removed from VYI
[Issuer] ..> [MySafe] : (9)\nOPTIONAL:\nstore in Mysafe,\nif consented
[Issuer] --> RP : (10) data handed over\nfrom Issuer to RP
@enduml
```

## MySafe journey (Reuse)
```puml
@startuml
title Journey with reusing data from MySafe
[RP] as "Relying Party"
[SSO] as "ScotAccount"
RP ..> SSO : (1) requests verified data
SSO ..> SSO: (2) sign-in/up
SSO ..> [Issuer] : (3)
Issuer ..> Issuer : (4) should we reuse Mysafe data?
Issuer <-- [MySafe] : (5) Yes! Issuer retrieves data from MySafe for reuse
[Issuer] --> RP : (6) data handed over\nfrom Issuer to RP
@enduml
```

## MySafe Service internal components
```puml
@startuml
title MySafe's components\n
cloud internal_others as "ScotAccount & IDV"
cloud RPs as "Relying Parties"
database S3
database DynamoDB
[mySafeFrontend] as "\n<b>issuer-UI</b>\n<s>mySafe-UI" <<node.js>>
[mysafeService] as "\n<b>issuer-service</b>\n<s>mySafe-service" <<java/spring>>
component mysafeLocker as "\nlocker-service" <<java/spring>> #whitesmoke{
  [AWS Encryption SDK] #LightGrey
}
[mySafeFrontend] ..>[mysafeService]
[mysafeService]..> mysafeLocker : getCitizenData(CitizenAccountID, Oauth2_access_token) : JSON\n\n  addCitizenData(CitizenAccountID, Oauth2_access_token, newJWT)\n\ndeleteCitizenData(CitizenAccountID, Oauth2_access_token,..)
mysafeLocker ..> S3
mysafeService ..> DynamoDB : store & retrieve session data
note bottom of mysafeLocker
<b>Inner hardened locker aka "locker service":</b>
  - verifies OAuth2 access token for each request
  - HTTPS API provides CRUD operations for citizen data
  - encrypts/decrypts data coming to/from S3
end note
internal_others <..>[mysafeService]
RPs <..>[mysafeService]
@enduml
```