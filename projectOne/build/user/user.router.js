"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var user = __importStar(require("./user"));
var user_1 = require("./user");
var user_service_1 = __importDefault(require("./user.service"));
var router = express_1.default.Router();
router.get('/', function (req, res, next) {
    console.log("Inside NORMAL GET");
    var u = __assign({}, req.session.user);
    res.send(JSON.stringify(u));
});
router.get('/:username', function (req, res, next) {
    console.log("Inside Specific GET");
    console.log("Specific params:" + req.params.username);
    user_service_1.default.getUserByName(req.params.username).then(function (val) {
        console.log("U =" + JSON.stringify(val));
        res === null || res === void 0 ? void 0 : res.send(JSON.stringify(val));
    });
});
router.put('/:supervisor', function (req, res, next) {
    console.log("Supervisor PUT");
    var sup = req.body;
    var updatedSup = user_1.updateUserClaims(sup);
    res.send(JSON.stringify(updatedSup));
});
router.put('/', function (req, res, next) {
    console.log("USER PUT");
    req.session.user = req.body;
    req.session.save();
    console.log(req.session.user);
    user_1.updateUserClaims(req.session.user);
    res.send(JSON.stringify(req.session.user));
});
// Legacy route, do not use.
router.get('/logout', function (req, res, next) {
    req.session.destroy(function (err) { return console.log(err); });
    res.redirect('/');
});
// Much more restful
router.delete('/', function (req, res, next) {
    req.session.destroy(function (err) { return console.error(err); });
    res.sendStatus(204);
});
router.post('/', function (req, res, next) {
    console.log(req);
    user.login(req.body.name, req.body.password).then(function (user) {
        if (user === null) {
            res.sendStatus(401);
        }
        req.session.user = user;
        res.send(JSON.stringify(user));
    }).catch(function (err) { return console.log(err); });
});
exports.default = router;
