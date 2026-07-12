const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return sendError(res, Messages.AUTH.UNAUTHORIZED, 401);
    }

    const decoded = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        employeeCode: true,
        name: true,
        email: true,
        phone: true,
        profileImage: true,
        role: true,
        status: true,
        departmentId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return sendError(res, Messages.AUTH.NOT_FOUND, 404);
    }

    if (user.status !== "ACTIVE") {
      return sendError(res, "Access Denied: Account is deactivated.", 403);
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication middleware error:", error);
    return sendError(res, Messages.AUTH.INVALID_TOKEN, 401);
  }
};

module.exports = { protect };