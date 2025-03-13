# VerifyYourIdentity Service

## Key concepts
- Key concept 1
- Key concept 2

## Component Diagram
```puml
@startuml
title PWYA As-Is Component Diagram

component AWS_account #LightGrey {
    database DynamoDB
    queue Kinesis
    component Internet_VPC #LightGreen {
        [AWS ALB]
        [Squid_outbound_proxy]
        [Squid_outbound_proxy_NLB] as "AWS NLB"
        [Squid_outbound_proxy_NLB] ..> [Squid_outbound_proxy]
    }

    component Application_VPC #LightGreen {
        database SecretsManager
        database CloudWatch
        [AWS NLB]
        database Redis as "Redis\n\nCache &\nRedis\nStreams"

        component EKS_cluster #LightBlue {
            component PWYA_namespace #LightPink {
                rectangle "business layer" #LightBlue {
                    [Orchestrator] <<pod>> #LightYellow
                    [IDV_Service] <<pod>> #LightYellow
                    [IDV_Egress] <<pod>> #LightYellow

                    component IDV_Egress <<pod>> #LightYellow {
                        [experianTunnel] <<container>> as "experian-tunnel (nginx)"
                        [crosscoreTunnel] <<container>> as "crosscore-tunnel (socat)"
                        [experianTunnel] ..> [crosscoreTunnel]
                    }
                    
                    [Orchestrator] ..> Redis
                    [IDV_Service] ..> Redis
                }

                rectangle "UI layer" <<node.js/javascript>> #LightBlue {
                    component IDV_UI <<pod>> #LightYellow {
                        [SecureGateway2] <<container>> as "SecureGateway"
                        [IDV_UI_cont] <<container>> as "IDV UI"
                        [SecureBiometrics] <<container>> as "Secure Biometric"

                        [SecureGateway2] ..> [IDV_UI_cont]
                        [SecureGateway2] ..> [SecureBiometrics]
                        [SecureBiometrics] ..> [IDV_UI_cont] : passes encrypted\nbiometric data
                    }
                }

                IDV_UI_cont ..> [IDV_Service]
            }

            component SSO_namespace #LightPink {
                component sso_services as "..." {
                }
            }

            component nginx_ingress_namespace #LightPink {
                [nginx]
            }
        }
    }
}

[IDV_Service] ..> SSO_namespace : store results

cloud Internet
Internet ..> [AWS ALB]
[AWS ALB] ..> [AWS NLB]
[AWS NLB] ..> [nginx]
[Squid_outbound_proxy] ..> Internet
[crosscoreTunnel] ..> [Squid_outbound_proxy_NLB]
[IDV_Service] ..> [Squid_outbound_proxy_NLB] : viaEuropa
[IDV_Service] ..> [experianTunnel] : Experian
[Orchestrator] <..> SSO_namespace
Orchestrator ..> Kinesis : business events\ndemographic statistics
[Orchestrator] <..> [IDV_Service]
[Orchestrator] ..up..> DynamoDB : store consent\n & sensitive logs
[IDV_Service] ..up..> DynamoDB : data for improving\nname matching\n & sensitive logs
[nginx] ..> SecureGateway2
[nginx] ..> sso_services

@enduml
```