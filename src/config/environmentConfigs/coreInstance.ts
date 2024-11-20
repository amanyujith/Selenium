import { ChatSession, ChatSessionType, MeetingSession, MeetingSessionType } from "hdmeet";
import { Environment } from "./config";

class CoreInstance {
    static chatsession: ChatSessionType;
    static meetingsession: MeetingSessionType;
    static SessionData = Environment.getInstance()

    public static getChatInstance(): ChatSessionType {
        if (!CoreInstance.chatsession) {
            CoreInstance.chatsession = new ChatSession(
                CoreInstance.SessionData.apikey,
                CoreInstance.SessionData.loglevel,
                CoreInstance.SessionData.EnvironmentLevel, {
                isGrafanalogger: true
            });
        }
        return CoreInstance.chatsession;
    }
    public static getMeetInstance(): MeetingSessionType {
        if (!CoreInstance.meetingsession) {
            CoreInstance.meetingsession = new MeetingSession(
                CoreInstance.SessionData.apikey,
                CoreInstance.SessionData.loglevel,
                CoreInstance.SessionData.EnvironmentLevel, {
                isGrafanalogger: true
            });
        }
        return CoreInstance.meetingsession;
    }
}

export default CoreInstance