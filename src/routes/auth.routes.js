import { Router } from "express";
import * as authCtrl from "../controllers/auth.controller";
import { checkForm } from "../middlewares/verify";

const router = Router()

router.post('/new', checkForm, authCtrl.createNewUser)
router.post('/login', checkForm, authCtrl.loginUser)


export default router;