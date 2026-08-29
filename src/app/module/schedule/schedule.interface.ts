export interface ICreateSchedulePayload {
  startDateTime: Date;
  endDateTime: Date;
  meetingLink: String;
}

export interface IUpdateSchedulePayload {
  startDateTime?: Date;
  endDateTime?: Date;
  meetingLink?: string;
}
