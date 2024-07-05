export const generateAuthToken = (user, message, statusCode, res) => {
  const token = user.generateJsonWebToken();

  user.password = undefined;

  res
    .status(statusCode)
    .cookie("access_token", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Exactly 7 days from now
      httpOnly: true,
    })
    .json({
      success: true,
      message,
      user,
    });
};
