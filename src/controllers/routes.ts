import Log from "../services/common/logUtil";

const express = require("express");
const router = express.Router();
const log = new Log();

const auth = require("../services/app/auth");
const getObjects = require("../services/common/getObjects");

// middleware that is specific to this router
router.use(function timeLog(req: any, res: any, next: any) {
  const success =
    req.method === "POST" ? true : false;

  if (success) {
    log.getResponse(
      `${req.method} request made to ${req.url}.`,
      success,
      "Middleware routes.ts"
    );
  }
  next();
});

/*
 *   login
 */
router.post("/api/login", async (req: any, res: any, next: any) => {
  const facility = `POST to /api/login`;

  try {
    if (typeof req.body.username !== "undefined" && typeof req.body.password !== "undefined") {
      const data = await auth.login(req.body);

      res.json(data);
    } else {
      res.status(500);
      res.json({success: false, msg: `Invalid request.`})
    }
  } catch (e) {
    res.status(500);
    res.json({success: false, msg: `catch: ${e}`})
  }
});

/*
 *   signup
 */
router.post("/api/signup", async (req: any, res: any, next: any) => {
  const facility = `POST to /api/signup`;

  try {
    if (typeof req.body.username !== "undefined" && typeof req.body.password !== "undefined") {
      const data = await auth.signup(req.body);

      res.json(data);
    } else {
      res.status(500);
      res.json({success: false, msg: `Invalid request.`})
    }
  } catch (e) {
    res.status(500);
    res.json({success: false, msg: `catch: ${e}`})
  }
});

/*
 *   signout
 */
router.post("/api/signout", async (req: any, res: any, next: any) => {
  const facility = `POST to /api/signout`;

  try {
    if (typeof req.body.username !== "undefined") {
      const data = await auth.signout(req.body.username);

      res.json(data);
    } else {
      res.status(500);
      res.json({success: false, msg: `Invalid request.`})
    }
  } catch (e) {
    res.status(500);
    res.json({success: false, msg: `catch: ${e}`})
  }
});

router.get("/not-found", (req: any, res: any, next: any) => {
  const json = {
    success: false,
    errorMessage: "GET requests are not allowed."
  };
  log.getResponse(`"/": ${json.errorMessage}`, json.success, "GET to /");
  res.json(json);
});

router.get("*", (req: any, res: any, next: any) => {
  res.redirect("/not-found");
});

router.use((req: any, res: any, next: any) => {
  log.getResponse(
    `404 ${req.method} request made to ${req.url}.`,
    false,
    "Not found"
  );
  res.status(404).send({
    status: 404,
    error: `Not found`
  });
});

module.exports = router;
