export class DriverLogoutController {
  constructor() {}

  async logout(req, res, next) {
    try {
      res.clearCookie("driverRefreshToken");
      res.status(200).json({ success: true });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
}
