"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/** JWT sign payload method */
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Signs a given payload using either the `jose` library (for Bun runtime) or `jsonwebtoken`.
 *
 * @async
 * @function
 * @param {Object} options - The options for signing the payload.
 * @param {Object} options.payload - The payload to be signed.
 * @param {string} options.secret - The secret key used for signing.
 * @param {number} options.expirationTime - The expiration time in seconds.
 * @returns {Promise<string>} Returns a promise that resolves to the signed JWT.
 * @throws {Error} Throws an error if there's an issue during signing.
 *
 * @example
 * const signedPayload = await signPayload({
 *   payload: { userId: 123 },
 *   secret: 'my-secret-key',
 *   expirationTime: 3600
 * });
 */
const signPayload = (_a) => __awaiter(void 0, [_a], void 0, function* ({ payload, secret, expirationTime, }) {
    return jsonwebtoken_1.default.sign(payload, secret, { expiresIn: expirationTime });
});
exports.default = signPayload;
