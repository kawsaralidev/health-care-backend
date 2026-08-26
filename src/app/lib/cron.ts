import cron from "node-cron";

export const deleteUnverifiedDoctors = async () => {
  cron.schedule("*/10 * * * *", () => {
    console.log("running a task every 10 minute");
  });
};
