
 export const EnvironmentLevel = {
    SANDBOX: "SANDBOX",
    TESTING: "TESTING",
    PRODUCTION: "PRODUCTION",
    DEVELOPMENT: "DEVELOPMENT",
    LOADTEST: "LOADTEST",
    BETADEVELOP: "BETADEVELOP",
    KOSANGANA: "KOSANGANA",
    BETATEST: "BETATEST",
    CHATCLIENT: "CHATCLIENT",
    BETASANDBOX: "BETASANDBOX",
    MQTTCLIENT: "MQTTCLIENT",
    TEST: "TEST",
    CODETEST: "CODETEST",
    TESTKUBERNETES: "TESTKUBERNETES",
    NCSTEST: "NCSTEST",
    "STAGING-3": "STAGING-3",
}

export type EnvironmentLevelKeys = keyof typeof EnvironmentLevel;

enum LogLevel {
    ALL = 1,
    INFO = 2,
    WARN = 3,
    ERROR = 4,
    OFF = 5,
}
export interface configType {
    apiKey: string,
    logLevel: LogLevel,
    environmentLevel: EnvironmentLevelKeys
}