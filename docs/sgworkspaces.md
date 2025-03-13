# SG Workspaces service
This service provides a virtual desktop environment to internal Scottish Government develepers working on the Digital Identity Service.

## Key concepts

- Each developer to be provided with an AWS Workspace.
- AWS Workspace are Ubuntu 22.04 virtual desktops running on AWS managed infrastructure.
- Each workspace comes with a curated set of development tools pre-installed for use by developers in Identity (and Payments) teams. 
- Workspaces are locked down, users have no ability to install further software or sudo.
- Images are security hardened Ubuntu 22.04 (CIS Level 1).
- Workspaces have limited egress. Just enough to access Gitlab, Artifactory and Kubernetes environments in the tactical cloud, and perform software updates and patching from approved software repositories.
- Ansible playbooks written for each required development and security tool. Ansible controller instance used to run playbooks against fleet of Workspace instances. 
- Software updates and patching done automatically via scheduled jobs running on the Ansible Controller box.
- All maintenance of workspaces and software installs all done under the control of Ansible.
- Authentication done against private AD domain using AD Connector which delegates MFA to Okta.
- MFA performed via ScotsConnect Okta using Okta Radius instance.
- Private AD domain synchronized with ScotGov active directory via ScotsConnect Okta using Okta AD Agent instance. 

## Solution Design

```puml
@startuml aws-workspaces-service-design

  !define AWSPuml https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/v17.0/dist
  !define SPRITESURL https://raw.githubusercontent.com/plantuml-stdlib/gilbarbara-plantuml-sprites/v1.1/sprites

  !include AWSPuml/AWSCommon.puml
  !include AWSPuml/AWSSimplified.puml
  !include AWSPuml/Compute/EC2.puml
  !include AWSPuml/Compute/EC2Instance.puml
  !include AWSPuml/Containers/ElasticContainerService.puml
  !include AWSPuml/EndUserComputing/all.puml
  !include AWSPuml/General/all.puml
  !include AWSPuml/Groups/all.puml
  !include AWSPuml/NetworkingContentDelivery/all.puml
  !include AWSPuml/SecurityIdentityCompliance/all.puml
  !include AWSPuml/ManagementGovernance/all.puml
  !includeurl SPRITESURL/okta.puml

  hide stereotype
  'skinparam linetype ortho
  skinparam linetype polyline

  cloud Internet as internet
  Users(developers, "Developers", "")
  Users(operators, "Operators", "")
  rectangle "<$okta>\nScots Connect" as scots_connect

  VPCCustomerGateway(zscaler, "ZScaler", "ZScaler")

  AWSCloudGroup(cloud) {

    TransitGateway(transit_gateway, "TransitGW", "Transit Gateway")

    AWSAccountGroup(strategic_devops, "DevOps Account(Strategic Cloud Platform)") {

      VPCGroup(pd_vpc_app, "Workspaces VPC") {
        PrivateSubnetGroup(az_2_private, "Private subnet") {
          EC2Instance(radius, "Radius", "EC2") #Transparent
          EC2Instance(adagent, "AD Agent", "EC2") #Transparent
          DirectoryServiceADConnector(workspaces_ad_connector, "Workspaces AD Connector", "") #Transparent

          note bottom of radius #Beige
            Used to perform MFA handshake with Okta
          end note

          note bottom of adagent #Beige
            Keeps Workspaces AD synchronized with users and credential of developers assigned to Okta group
          end note
        }
      }

      VPCGroup(managed_vpc, "AWS Managed") {
        WorkSpacesFamilyAmazonWorkSpaces(workspaces, "AWS Workspaces", "") #Transparent
        DirectoryServiceAWSManagedMicrosoftAD(workspaces_ad, "Workspaces AD", "") #Transparent
        SystemsManagerAutomation(ansible, "Ansible SSM Controller", "SSM") #Transparent
        SystemsManagerSessionManager(rdp, "SSM Rdp Session", "SSM") #Transparent

        ansible .left.> workspaces
        internet .down.> ansible       
        internet .down.> rdp

        note bottom of workspaces #Beige
          Multiple AWS Workspaces (one per developer). Uses AD Connector to authenticate against AD and perform MFA via Okta.
        end note

        note bottom of workspaces_ad #Beige
          Private AD domain containing users and credentials of developers assigned to Okta group.
        end note

        note bottom of ansible #Beige
          Allows operators to run Ansible playbooks via SSM which support:
            Managing workspaces
            Installation of software development tooling
            Auditing and securing workspaces
            Patching and upgrading OS and development tooling
        end note

        note bottom of rdp #Beige
          Allows operators to run remote session using SSM which support:
            Managing and configuring AD Agent
            Managing and configuring Radius
        end note
      }

      adagent .up.> transit_gateway
      adagent .right.> workspaces_ad
      radius .up.> transit_gateway
      workspaces_ad_connector .up.> transit_gateway
      workspaces_ad_connector .right.> workspaces_ad
      workspaces .up.> workspaces_ad_connector
      workspaces .up.> transit_gateway
      rdp .up.> adagent
      rdp .up.> radius
    }
 
    AWSAccountGroup(build, "Build Account(Tactical Cloud Platform)") {
      VPCGroup(build_internet_vpc, "Internet VPC") {
        ElasticLoadBalancingApplicationLoadBalancer(build_ingress_lb,"Ingress","ALB")
        ElasticContainerService(build_egress_proxy,"Squid Proxy", "Egress")
        VPCNATGateway(build_transit_gateway, "NAT", "NAT Gateway")
      }

      VPCGroup(vpc_app, "Application VPC") {
        EC2Instance(ec2_gitlab, "GitLab", "EC2") #Transparent
        EC2Instance(ec2_artifactory, "Artifactory", "EC2") #Transparent
      }

      VPCPeeringConnection(build_vpc_peering,"VPC Peering","VPC Peering")
      note left of build_internet_vpc #Beige
        Allow ingress access to new static IP in platform dev (to allow Cloud9 to access GitLab and Artifactory)
      end note

      ec2_gitlab <.up.> build_vpc_peering
      ec2_artifactory <.up.> build_vpc_peering
      build_ingress_lb .down.> build_vpc_peering
      build_egress_proxy <.down. build_vpc_peering
      build_egress_proxy .up.> build_transit_gateway
      build_transit_gateway .up.> internet
    }

    transit_gateway .up.> zscaler    
  }

  note top of scots_connect #Beige
    Used by Radius server to perform MFA handshake with Okta.0
    Used by AD Agent to keep Workspaces AD synchronized with users and credential of developers assigned to Okta group.
  end note

  note top of developers #Beige
    Use the AWS workspaces client on Scot Gov laptops to access their Ubuntu workspace using the WSP protocol.
  end note

  note top of operators #Beige
    Use the Windows rdp or ssh clients on Scot Gov laptops to access the bastion servers in the public subnet, from where they can jump onto boxes in the private subnet.
  end note

  note left of zscaler #Beige
    Egress traffic constrained according to whitelist of domains
  end note

  developers .down.> internet
  operators .down.> internet
  internet .down.> build_ingress_lb
  internet .down.> workspaces
  internet .up.> scots_connect
  zscaler .right.> internet

@enduml
```

- AD Agent and Radius server patched and upgrade automatically using AWS Systems Manager.
- Systems Manager Ansible automation used to administer AWS workspaces.
- Operators access via Systems Manager RDP to perform manual configuration tasks.
- Access to external services constrained via Transit Gateway and Z-scaler configured to constrain accessible domains.