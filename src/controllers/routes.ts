const express = require("express");
const router = express.Router();

const auth = require("../services/app/auth");
const user = require("../services/app/user");
const blitz = require("../services/app/deckofcards/blitz");

// middleware that is specific to this router
router.use(function timeLog(req: any, res: any, next: any) {
  const success =
    req.method === "POST" ? true : false;

  if (success) {
    console.log(
      `${req.method} request made to ${req.url}.`,
      success,
      "Middleware routes.ts"
    );
  }
  next();
});

/*
 *   signin
 */
router.post("/api/signin", async (req: any, res: any, next: any) => {
  try {
    if (typeof req.body.username !== "undefined" && typeof req.body.password !== "undefined") {
      const data = await auth.login(req.body);

      res.json(data);
    } else {
      res.status(500);
      res.json({ success: false, msg: `Invalid request.` })
    }
  } catch (e) {
    res.status(500);
    res.json({ success: false, msg: `catch: ${e}` })
  }
});

/*
 *   signup
 */
router.post("/api/signup", async (req: any, res: any, next: any) => {
  try {
    if (typeof req.body.username !== "undefined" && typeof req.body.password !== "undefined") {
      const data = await auth.signup(req.body);

      res.json(data);
    } else {
      res.status(500);
      res.json({ success: false, msg: `Invalid request.` })
    }
  } catch (e) {
    res.status(500);
    res.json({ success: false, msg: `catch: ${e}` })
  }
});

/*
 *   signout
 */
router.post("/api/signout", async (req: any, res: any, next: any) => {
  try {
    if (typeof req.body.username !== "undefined") {
      const data = await auth.signout(req.body.username);

      res.json(data);
    } else {
      res.status(500);
      res.json({ success: false, msg: `Invalid request.` })
    }
  } catch (e) {
    res.status(500);
    res.json({ success: false, msg: `catch: ${e}` })
  }
});


/*
 *   users
 */
router.post("/api/user", async (req: any, res: any, next: any) => {
  try {
    const data = await user.list();

    res.json(data);
  } catch (e) {
    res.status(500);
    res.json({ success: false, msg: `catch: ${e}` })
  }
});


/*
 *   new game
 */
router.post("/api/blitz/new", async (req: any, res: any, next: any) => {
  try {
    if (typeof req.body.username !== "undefined") {
      const data = await blitz.create(req.body.username);

      res.json(data);
    } else {
      res.status(500);
      res.json({ success: false, msg: `Invalid request.` })
    }
  } catch (e) {
    res.status(500);
    res.json({ success: false, msg: `catch: ${e}` })
  }
});

/*
 *   join game
 */
router.post("/api/blitz/join", async (req: any, res: any, next: any) => {
  try {
    if (typeof req.body.username !== "undefined" && typeof req.body.initialUser !== "undefined") {
      const data = await blitz.join(req.body.initialUser, req.body.username);

      res.json(data);
    } else {
      res.status(500);
      res.json({ success: false, msg: `Invalid request.` })
    }
  } catch (e) {
    res.status(500);
    res.json({ success: false, msg: `catch: ${e}` })
  }
});

router.get("/not-found", (req: any, res: any, next: any) => {
  const json = {
    success: false,
    errorMessage: "GET requests are not allowed."
  };
  console.log(`"/": ${json.errorMessage}`, json.success, "GET to /");
  res.json(json);
});

router.get("*", (req: any, res: any, next: any) => {
  res.redirect("/not-found");
});

router.use((req: any, res: any, next: any) => {
  console.log(
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
