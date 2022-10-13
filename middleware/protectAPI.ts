const protectAPI = (handler: any) => {
  return async (req: any, res: any) => {
    try {
      if (new URL(req.headers.referer).origin !== "https://app.metabillionaire.com") {
        return res
          .status(403)
          .json({ success: false, message: `Forbidden Access` });
      }
      return handler(req, res);
    } catch {
      return res
        .status(403)
        .json({ success: false, message: `Forbidden Access` });
    }
  };
};

export default protectAPI;
