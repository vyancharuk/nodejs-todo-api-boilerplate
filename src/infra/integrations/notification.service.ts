import { NotifData } from '../../common/types';

// TODO: provide proper email notification implementation
export default class Notifications {
  public async sendEmail(notifData: NotifData): Promise<any> {}
  public async sendPushNotification(notifData: NotifData): Promise<any> {}
}
