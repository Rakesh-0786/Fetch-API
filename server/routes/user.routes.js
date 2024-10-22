// import { Router } from "express";
// import { login, register } from "../controllers/user.controller.js";
// const router=Router();


// router.post('/register',register);
// router.post('/login',login);


// export default router;

import { Router } from "express";
import { login, register, googleSignIn } from "../controllers/user.controller.js";
const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google-signin', googleSignIn); // New route for Google Sign-In

export default router;
