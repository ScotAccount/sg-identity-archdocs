# vouchsafe referee journey (extended oidc flow)
![dis flow](./dis-oidc-flow.svg)

This is an Enhanced OpenID Connect (OIDC) Flow with Identity Verification and Consent Management. This sequence diagram represents an **extended OIDC flow** that includes an additional identity verification step, the storage of verified claims, and user consent to share specific claims with the Relying Party (Vouchsafe). The enhanced flow empowers the user to control which verified claims (e.g., name, date of birth, email, etc.) are shared, ensuring greater transparency and control over their data. Below is a concise explanation of the key elements of the flow:

## 1. **Resource Access and Authorization Request**
- The **User** initiates access to a protected resource on the **Relying Party (Vouchsafe) (Web App)**.
- The RP redirects the user to the **SSO** authorization endpoint with the OIDC parameters (`client_id`, `scopes`, `redirect_uri`, `response_type=code`, `state`).
- The **Browser** forwards the OIDC request to the **SSO** server.

## 2. **User Authentication**
- The **SSO** presents the user with an **Authentication UI** (e.g., login or sign-up).
- The **User** submits authentication details through the **Browser**, which are sent to the **SSO**.

## 3. **Verified Claims Discovery**
- The **SSO** checks for the existence of the user's verified claims in **MySafe**.
- Two possible scenarios follow:
  - **If verified claims exist** in MySafe:
    - **MySafe** returns the verified claims directly to the **SSO**.
  - **If verified claims are not found**:
    - The **SSO** initiates an **identity verification process** via **VYI (Verify Your Identity)**.

## 4. **Identity Verification and Consent to Store Claims**
- The **VYI** service verifies the user’s identity using their provided data (e.g., name, date of birth, address, email, mobile).
- Upon successful verification:
  - The **VYI** shows a **Consent to Store UI** to the user, allowing them to approve the storage of verified claims in **MySafe**.
  - The user submits their consent via the **Browser**.
  - After receiving consent, the **VYI** securely stores the user's verified claims in **MySafe**.
  - **MySafe** confirms the storage completion and notifies the **SSO** that the verified claims are now available.

## 5. **Consent to Share Claims**
- The **SSO** displays a **Consent to Share UI** to the user, listing the verified claims being requested by the RP.
- The user is given the choice to decide which verified claims (e.g., name, date of birth, email, etc.) are shared with the RP.
- The user submits their consent via the **Browser**, and the consent details are sent to the **SSO**.

## 6. **Token Exchange**
- Upon receiving the user's consent to share, the **SSO** redirects the user to the RP’s `redirect_uri` with an authorization `code` and state.
- The RP exchanges the authorization `code` for tokens by sending a POST request to the **SSO**'s token endpoint.
- The **SSO** returns an `access_token`, `id_token`, and `refresh_token` to the RP.

## 7. **Request for Verified Claims**
- The RP sends a request to the **SSO** to retrieve the user's verified claims using the `access_token`.
- The **SSO** forwards the request to **MySafe** to fetch the verified claims for the user's requested scopes.
- **MySafe** responds with the claims, which the **SSO** then delivers to the RP.

## 8. **Access to Protected Resource**
- The RP uses the verified claims received from the **SSO** to serve the user’s requested resource, maintaining a secure and seamless user experience.

## **Key Highlights of the Extended OIDC Flow**
- **Identity Verification Step**: If verified claims are not present, the flow incorporates an identity verification step via **VYI**. 
- **Consent to Store**: After successful verification, the user must consent before their claims are stored in **MySafe**.
- **Granular Claim Sharing**:
  - The user retains control over which verified claims are shared with the RP.
  - This ensures transparency and alignment with privacy principles.
- **Seamless Claim Management**: Secure interactions between the **SSO**, **MySafe**, and **VYI** ensure the integrity and availability of verified claims for the user's convenience.

This extended flow enhances the standard OIDC process by integrating identity verification, secure storage, and user-managed consent, ensuring robust security and user trust.
