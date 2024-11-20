import configs from "../sessionConfig";
import { EnvironmentLevelKeys } from "../../config/environmentConfigs/configTypes";
const serverRoot = {
  US3: "us3-server-node0.hoolva.com",
  prod: "ncsapp.com",
  US1: "us1-dev.hoolva.com",
  NCS: "us3-test.ncsapp.com",
  US7: "us7-cluster.hoolva.com",
  US2: 'us2-stage.ncsapp.com'
};

export const DocumentRoot = [{
  domain: 'us7-cluster.hoolva.com',
  env: 'test'
  },
  {
  domain: 'us3-test.ncsapp.com',
  env: 'dev'
  },{
  domain: 'us2-stage.ncsapp.com',
  env: 'staging'
  },
  {
  domain: 'ncsapp.com',
  env: 'prod'
  }

]

class Environment {
  static instance: Environment;
  rootUrl: string;
  keycloak_rootUrl: string;
  keycloak_reg: string;
  keycloak_logout: string;
  keycloak_tenant_login: string;
  siloute_api: string;
  tenant_info_api: string;
  update_display_name: string;
  personal_status: string;
  update_user: (value: string) => string;
  keycloak_get_tenant: (value: string) => string;
  keycloak_api_login: (value: string) => string;
  forgot_password: string;
  EnvironmentLevel: EnvironmentLevelKeys;
  apikey: string;
  loglevel: number;

  private constructor(
    env: EnvironmentLevelKeys,
    apikey: string,
    loglevel: number
  ) {
    this.EnvironmentLevel = env;
    this.apikey = apikey;
    this.loglevel = loglevel;
    if (env === "PRODUCTION") {
      this.rootUrl = `https://${serverRoot.prod}/app`
      this.keycloak_rootUrl = `https://${serverRoot.prod}/sso/?d=desk&q=`;
      this.keycloak_reg = `https://${serverRoot.prod}/sso/?d=desk&q=signup`;
      this.keycloak_logout = `https://${serverRoot.prod}/v1/logout/user`;
      this.keycloak_tenant_login = `https://${serverRoot.prod}/v2/email/clients?email=`;
      this.tenant_info_api = `https://${serverRoot.prod}/v1/getTenantInfo`;
      this.siloute_api = `https://${serverRoot.prod}/v1/telco/system/tenant/system/siloute`;
      this.update_display_name = `https://${serverRoot.prod}/v1/updateUser/null`;
      this.personal_status = `https://${serverRoot.prod}/v1/chat/changePersonalStatus`;
      this.update_user = (value: string) =>
        `https://${serverRoot.prod}/v1/updateUser/${value}`;
      this.keycloak_get_tenant = (userName: string) =>
        `https://${serverRoot.prod}/v2/email/clients?email=${userName}`;
      this.keycloak_api_login = (name: string) =>
        `https://${serverRoot.prod}/auth/realms/${name}/protocol/openid-connect/token`;
      this.forgot_password = `https://${serverRoot.prod}/v2/reset_password`
    } else if (env === "NCSTEST") {
      this.rootUrl = `https://${serverRoot.NCS}/app`
    this.keycloak_rootUrl = `https://${serverRoot.NCS}/sso/?d=desk&q=`;
      this.keycloak_reg = `https://${serverRoot.NCS}/sso/?d=desk&q=signup`;
      this.keycloak_logout = `https://${serverRoot.NCS}/v1/logout/user`;
      this.keycloak_tenant_login = `https://${serverRoot.NCS}/v2/email/clients?email=`;
      this.tenant_info_api = `https://${serverRoot.NCS}/v1/getTenantInfo`;
      this.siloute_api = `https://${serverRoot.NCS}/v1/telco/system/tenant/system/siloute`;
      this.update_display_name = `https://${serverRoot.NCS}/v1/updateUser/null`;
      this.personal_status = `https://${serverRoot.NCS}/v1/chat/changePersonalStatus`;
      this.update_user = (value: string) => `https://${serverRoot.NCS}/v1/updateUser/${value}`;
      this.keycloak_get_tenant = (userName: string) => `https://${serverRoot.NCS}/v2/email/clients?email=${userName}`;
      this.keycloak_api_login = (name: string) => `https://${serverRoot.NCS}/auth/realms/${name}/protocol/openid-connect/token`;
      this.forgot_password = `https://${serverRoot.NCS}/v2/reset_password`
    } else if (env === 'DEVELOPMENT') {
      this.rootUrl = `https://${serverRoot.US1}/app`
      this.keycloak_rootUrl = `https://${serverRoot.US1}/sso/?d=desk&q=`;
      this.keycloak_reg = `https://${serverRoot.US1}/sso/?d=desk&q=signup`;
      this.keycloak_logout = `https://${serverRoot.US1}/v1/logout/user`;
      this.keycloak_tenant_login = `https://${serverRoot.US1}/v2/email/clients?email=`;
      this.tenant_info_api = `https://${serverRoot.US1}/v1/getTenantInfo`;
      this.siloute_api = `https://${serverRoot.US1}/v1/telco/system/tenant/system/siloute`;
      this.update_display_name = `https://${serverRoot.US1}/v1/updateUser/null`;
      this.personal_status = `https://${serverRoot.US1}/v1/chat/changePersonalStatus`;
      this.update_user = (value: string) => `https://${serverRoot.US1}/v1/updateUser/${value}`;
      this.keycloak_get_tenant = (userName: string) => `https://${serverRoot.US1}/v2/email/clients?email=${userName}`;
      this.keycloak_api_login = (name: string) => `https://us3-test.hoolva.com/auth/realms/${name}/protocol/openid-connect/token`;
      this.forgot_password = `https://${serverRoot.US1}/v2/reset_password`
    } else if (env === 'STAGING-3') {
      this.rootUrl = `https://${serverRoot.US2}/app`
      this.keycloak_rootUrl = `https://${serverRoot.US2}/sso/?d=desk&q=`;
      this.keycloak_reg = `https://${serverRoot.US2}/sso/?d=desk&q=signup`;
      this.keycloak_logout = `https://${serverRoot.US2}/v1/logout/user`;
      this.keycloak_tenant_login = `https://${serverRoot.US2}/v2/email/clients?email=`;
      this.tenant_info_api = `https://${serverRoot.US2}/v1/getTenantInfo`;
      this.siloute_api = `https://${serverRoot.US2}/v1/telco/system/tenant/system/siloute`;
      this.update_display_name = `https://${serverRoot.US2}/v1/updateUser/null`;
      this.personal_status = `https://${serverRoot.US2}/v1/chat/changePersonalStatus`;
      this.update_user = (value: string) => `https://${serverRoot.US2}/v1/updateUser/${value}`;
      this.keycloak_get_tenant = (userName: string) => `https://${serverRoot.US2}/v2/email/clients?email=${userName}`;
      this.keycloak_api_login = (name: string) => `https://${serverRoot.US2}/auth/realms/${name}/protocol/openid-connect/token`;
      this.forgot_password = `https://${serverRoot.US2}/v2/reset_password`
    } else if (env === 'SANDBOX') {
      this.rootUrl = `https://${serverRoot.US7}/app`
      this.keycloak_rootUrl = `https://${serverRoot.US7}/sso/?d=desk&q=`;
      this.keycloak_reg = `https://${serverRoot.US7}/sso/?d=desk&q=signup`;
      this.keycloak_logout = `https://${serverRoot.US7}/v1/logout/user`;
      this.keycloak_tenant_login = `https://${serverRoot.US7}/v2/email/clients?email=`;
      this.tenant_info_api = `https://${serverRoot.US7}/v1/getTenantInfo`;
      this.siloute_api = `https://${serverRoot.US7}/v1/telco/system/tenant/system/siloute`;
      this.update_display_name = `https://${serverRoot.US7}/v1/updateUser/null`;
      this.personal_status = `https://${serverRoot.US7}/v1/chat/changePersonalStatus`;
      this.update_user = (value: string) => `https://${serverRoot.US7}/v1/updateUser/${value}`;
      this.keycloak_get_tenant = (userName: string) => `https://${serverRoot.US7}/v2/email/clients?email=${userName}`;
      this.keycloak_api_login = (name: string) => `https://us1dev-ncs.kanimango.com/auth/realms/${name}/protocol/openid-connect/token`;
      this.forgot_password = `https://${serverRoot.US7}/v2/reset_password`
    } else {
      this.rootUrl = `https://${serverRoot.US3}/app`
      this.keycloak_rootUrl = `https://${serverRoot.US3}/sso/?d=desk&q=`;
      this.keycloak_reg = `https://${serverRoot.US3}/sso/?d=desk&q=signup`;
      this.keycloak_logout = `https://${serverRoot.US3}/v1/logout/user`;
      this.keycloak_tenant_login = `https://${serverRoot.US3}/v2/email/clients?email=`;
      this.tenant_info_api = `https://${serverRoot.US3}/v1/getTenantInfo`;
      this.siloute_api = `https://${serverRoot.US3}/v1/telco/system/tenant/system/siloute`;
      this.update_display_name = `https://${serverRoot.US3}/v1/updateUser/null`;
      this.personal_status = `https://${serverRoot.US3}/v1/chat/changePersonalStatus`;
      this.update_user = (value: string) =>
        `https://${serverRoot.US3}/v1/updateUser/${value}`;
      this.keycloak_get_tenant = (userName: string) =>
        `https://${serverRoot.US3}/v2/email/clients?email=${userName}`;
      this.keycloak_api_login = (name: string) =>
        `https://${serverRoot.US3}/auth/realms/${name}/protocol/openid-connect/token`;
      this.forgot_password = `https://${serverRoot.US3}/v2/reset_password`
    }
  }

  public static getInstance(): Environment {
    if (!Environment.instance) {
      Environment.instance = new Environment(
        configs.environmentLevel,
        configs.apiKey,
        configs.logLevel
      );
    }
    return Environment.instance;
  }
}



export { Environment, serverRoot };
